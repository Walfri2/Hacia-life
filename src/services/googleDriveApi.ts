/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState } from '../types';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

const SAVE_FILE_NAME = 'haci_yuma_save.json';

/**
 * List files from user's Google Drive
 */
export async function listDriveFiles(token: string, searchQuery = ''): Promise<DriveFileItem[]> {
  let q = 'trashed = false';
  if (searchQuery.trim()) {
    q += ` and name contains '${searchQuery.replace(/'/g, "\\'")}'`;
  }

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('pageSize', '25');
  url.searchParams.set('fields', 'files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)');
  url.searchParams.set('orderBy', 'modifiedTime desc');
  url.searchParams.set('q', q);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al listar archivos de Google Drive (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Find the latest Haci cloud save file in Drive
 */
export async function findGameSaveFile(token: string): Promise<DriveFileItem | null> {
  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', `name = '${SAVE_FILE_NAME}' and trashed = false`);
  url.searchParams.set('fields', 'files(id, name, mimeType, size, modifiedTime, webViewLink)');
  url.searchParams.set('pageSize', '1');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0];
  }
  return null;
}

/**
 * Save current game state to Google Drive
 */
export async function saveGameToDrive(
  token: string,
  state: GameState,
  existingFileId?: string | null
): Promise<{ fileId: string; modifiedTime: string }> {
  const fileData = {
    app: 'Haci: De la Soldadura a la Yuma',
    version: '2.0.0',
    savedAt: new Date().toISOString(),
    state
  };

  const jsonContent = JSON.stringify(fileData, null, 2);

  // If file already exists, update content via PATCH
  if (existingFileId) {
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: jsonContent
      }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error al actualizar partida en Google Drive: ${err}`);
    }

    const data = await res.json();
    return {
      fileId: data.id || existingFileId,
      modifiedTime: data.modifiedTime || new Date().toISOString()
    };
  }

  // Otherwise create a new file via multipart upload
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: SAVE_FILE_NAME,
    mimeType: 'application/json',
    description: 'Partida guardada de Haci: De la Soldadura a la Yuma'
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    jsonContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error al crear archivo de guardado en Google Drive: ${err}`);
  }

  const data = await res.json();
  return {
    fileId: data.id,
    modifiedTime: data.modifiedTime || new Date().toISOString()
  };
}

/**
 * Load game state from Google Drive
 */
export async function loadGameFromDrive(token: string, fileId: string): Promise<GameState> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error al leer archivo de Google Drive (${res.status}): ${err}`);
  }

  const json = await res.json();
  if (json.state) {
    return json.state as GameState;
  }
  return json as GameState;
}

/**
 * Delete a file in Google Drive (Requires explicit UI confirmation!)
 */
export async function deleteDriveFile(token: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(`Error al eliminar archivo de Google Drive: ${err}`);
  }
}
