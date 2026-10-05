/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { GameState } from '../types';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken
} from '../services/googleDriveAuth';
import {
  listDriveFiles,
  findGameSaveFile,
  saveGameToDrive,
  loadGameFromDrive,
  deleteDriveFile,
  DriveFileItem
} from '../services/googleDriveApi';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  FolderOpen,
  Search,
  ExternalLink,
  Trash2,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
  HardDrive,
  FileText
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: GameState;
  onRestoreState: (restoredState: GameState) => void;
  onShowMessage: (msg: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onRestoreState,
  onShowMessage
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'cloudSave' | 'explorer'>('cloudSave');

  // Cloud save state
  const [latestSave, setLatestSave] = useState<DriveFileItem | null>(null);
  const [isCheckingSave, setIsCheckingSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Explorer state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Destructive Confirmation Dialog
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDangerous?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: '',
    onConfirm: () => {}
  });

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch save file information when token becomes available
  const checkCloudSave = useCallback(async (authToken: string) => {
    setIsCheckingSave(true);
    try {
      const saveFile = await findGameSaveFile(authToken);
      setLatestSave(saveFile);
    } catch {
      // Ignored
    } finally {
      setIsCheckingSave(false);
    }
  }, []);

  // Fetch files for the explorer
  const fetchFiles = useCallback(async (authToken: string, query = '') => {
    setIsLoadingFiles(true);
    setFileError(null);
    try {
      const driveFiles = await listDriveFiles(authToken, query);
      setFiles(driveFiles);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al cargar archivos';
      setFileError(msg);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      checkCloudSave(token);
      if (activeSubTab === 'explorer') {
        fetchFiles(token, searchQuery);
      }
    }
  }, [token, activeSubTab, checkCloudSave, fetchFiles, searchQuery]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        onShowMessage(`¡Conectado a Google Drive como ${res.user.displayName || 'Usuario'}!`);
      }
    } catch (err) {
      console.error(err);
      onShowMessage('No se pudo conectar con Google Drive.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setLatestSave(null);
    setFiles([]);
    onShowMessage('Sesión de Google Drive cerrada.');
  };

  // Save game handler (requests confirmation if overwriting)
  const handleSaveGame = async () => {
    if (!token) return;

    const performSave = async () => {
      setIsSaving(true);
      setSaveSuccessMsg(null);
      try {
        const result = await saveGameToDrive(token, currentState, latestSave?.id);
        await checkCloudSave(token);
        setSaveSuccessMsg('¡Partida respaldada con éxito en Google Drive!');
        onShowMessage('¡Tu progreso de Haci ha sido guardado en Google Drive!');
        setTimeout(() => setSaveSuccessMsg(null), 5000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al guardar';
        alert(msg);
      } finally {
        setIsSaving(false);
      }
    };

    if (latestSave) {
      setConfirmModal({
        isOpen: true,
        title: '¿Sobrescribir copia en la nube?',
        description: `Ya existe una copia en tu Google Drive guardada anteriormente (${new Date(
          latestSave.modifiedTime || ''
        ).toLocaleString('es-ES')}). ¿Deseas reemplazarla con tu partida actual?`,
        actionLabel: 'Sí, sobrescribir',
        isDangerous: false,
        onConfirm: () => {
          setConfirmModal((p) => ({ ...p, isOpen: false }));
          performSave();
        }
      });
    } else {
      performSave();
    }
  };

  // Restore game handler (explicit confirmation required before replacing local state!)
  const handleRestoreGame = async () => {
    if (!token || !latestSave) return;

    setConfirmModal({
      isOpen: true,
      title: '¿Cargar partida desde Google Drive?',
      description:
        'Esta acción reemplazará el progreso actual en este dispositivo por los datos guardados en tu Google Drive. ¿Estás seguro de continuar?',
      actionLabel: 'Sí, restaurar partida',
      isDangerous: true,
      onConfirm: async () => {
        setConfirmModal((p) => ({ ...p, isOpen: false }));
        setIsLoadingSave(true);
        try {
          const restored = await loadGameFromDrive(token, latestSave.id);
          onRestoreState(restored);
          onShowMessage('¡Partida restaurada exitosamente desde Google Drive!');
          onClose();
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al restaurar';
          alert(msg);
        } finally {
          setIsLoadingSave(false);
        }
      }
    });
  };

  // Delete file handler (explicit confirmation required for destructive operations)
  const handleDeleteFile = (file: DriveFileItem) => {
    if (!token) return;

    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar archivo de Google Drive?',
      description: `¿Estás seguro de que deseas eliminar permanentemente "${file.name}" de tu Google Drive? Esta acción no se puede deshacer.`,
      actionLabel: 'Sí, eliminar',
      isDangerous: true,
      onConfirm: async () => {
        setConfirmModal((p) => ({ ...p, isOpen: false }));
        try {
          await deleteDriveFile(token, file.id);
          setFiles((prev) => prev.filter((f) => f.id !== file.id));
          if (latestSave?.id === file.id) {
            setLatestSave(null);
          }
          onShowMessage(`Archivo "${file.name}" eliminado de Google Drive.`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al eliminar';
          alert(msg);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#fdf8ee] text-[#0f3d2e] rounded-2xl shadow-2xl border-2 border-[#e0a93b] flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f3d2e] text-[#fdf8ee] border-b border-[#e0a93b]/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#e0a93b]/20 border border-[#e0a93b]/50 text-[#e0a93b]">
              <Cloud size={20} />
            </div>
            <div>
              <h2 className="font-serif-vintage font-bold text-base sm:text-lg leading-tight text-[#f6e9c8]">
                Google Drive en la Nube
              </h2>
              <p className="text-[11px] text-[#f6e9c8]/70">
                Sincroniza y respalda tu progreso en La Habana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#f6e9c8] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Account Bar */}
        <div className="px-4 py-2.5 bg-[#f6e9c8]/70 border-b border-[#0f3d2e]/15 flex items-center justify-between shrink-0">
          {user ? (
            <div className="flex items-center gap-2.5 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuario'}
                  className="w-8 h-8 rounded-full border border-[#0f3d2e]/30 object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0f3d2e] text-[#f6e9c8] font-bold flex items-center justify-center text-xs shrink-0">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-serif-vintage font-bold text-xs truncate text-[#0f3d2e]">
                  {user.displayName || 'Cuenta de Google'}
                </div>
                <div className="text-[10px] text-[#16553f] font-semibold truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#0f3d2e]/80">
              <HardDrive size={16} className="text-[#e0a93b]" />
              <span>Conecta tu cuenta de Google para activar la nube</span>
            </div>
          )}

          {user && (
            <button
              onClick={handleSignOut}
              className="text-[11px] font-semibold text-[#b3262e] hover:underline px-2 py-1 rounded bg-[#b3262e]/10 transition-colors cursor-pointer shrink-0"
            >
              Cerrar sesión
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!user ? (
            // Sign in prompt with official Google Sign In button styling
            <div className="text-center py-6 px-3 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0f3d2e]/10 border-2 border-[#0f3d2e]/20 flex items-center justify-center text-3xl">
                ☁️
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                <h3 className="font-serif-vintage font-bold text-base text-[#0f3d2e]">
                  Nunca pierdas tu viaje a La Yuma
                </h3>
                <p className="text-xs text-[#0f3d2e]/70 leading-relaxed">
                  Guarda tus pesos, negocios de soldadura, triciclos, ropa criolla y carros clásicos
                  directamente en tu Google Drive personal.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg border border-slate-300 shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isSigningIn ? (
                    <Loader2 size={18} className="animate-spin text-[#0f3d2e]" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                  )}
                  <span>{isSigningIn ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
                </button>
              </div>

              <div className="text-[10px] text-[#0f3d2e]/60">
                La aplicación solo accederá a sus copias de guardado con tu autorización.
              </div>
            </div>
          ) : (
            // Authenticated Tabs
            <>
              {/* Sub tabs: Sincronización vs Explorador */}
              <div className="flex border-b border-[#0f3d2e]/20 text-xs font-serif-vintage font-bold">
                <button
                  onClick={() => setActiveSubTab('cloudSave')}
                  className={`flex items-center gap-1.5 px-4 py-2 border-b-2 transition-colors cursor-pointer ${
                    activeSubTab === 'cloudSave'
                      ? 'border-[#e0a93b] text-[#0f3d2e] bg-[#f6e9c8]/40'
                      : 'border-transparent text-[#0f3d2e]/60 hover:text-[#0f3d2e]'
                  }`}
                >
                  <Cloud size={15} />
                  <span>Copia en la Nube</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('explorer')}
                  className={`flex items-center gap-1.5 px-4 py-2 border-b-2 transition-colors cursor-pointer ${
                    activeSubTab === 'explorer'
                      ? 'border-[#e0a93b] text-[#0f3d2e] bg-[#f6e9c8]/40'
                      : 'border-transparent text-[#0f3d2e]/60 hover:text-[#0f3d2e]'
                  }`}
                >
                  <FolderOpen size={15} />
                  <span>Explorador de Google Drive</span>
                </button>
              </div>

              {/* 1. CLOUD SAVE TAB */}
              {activeSubTab === 'cloudSave' && (
                <div className="space-y-4 pt-1">
                  {saveSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  {/* Local state summary */}
                  <div className="p-3.5 rounded-xl bg-[#f6e9c8]/50 border border-[#0f3d2e]/15 space-y-2">
                    <div className="text-[11px] font-serif-vintage font-bold uppercase tracking-wider text-[#16553f] flex items-center justify-between">
                      <span>Tu Partida en este Teléfono</span>
                      <span className="text-[#b3262e] font-extrabold text-sm tabular-nums">
                        ${Math.floor(currentState.pesos).toLocaleString('es-ES')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-white/70 rounded-lg border border-[#0f3d2e]/10">
                        <div className="text-[10px] text-[#0f3d2e]/70">Soldador</div>
                        <div className="font-bold text-[#0f3d2e]">Nivel {currentState.nivel}</div>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg border border-[#0f3d2e]/10">
                        <div className="text-[10px] text-[#0f3d2e]/70">Triciclo</div>
                        <div className="font-bold text-[#0284c7]">
                          Nivel {currentState.nivelTriciclo}
                        </div>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg border border-[#0f3d2e]/10">
                        <div className="text-[10px] text-[#0f3d2e]/70">Calle 13</div>
                        <div className="font-bold text-[#ec4899]">
                          Nivel {currentState.nivelCalle13}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cloud state summary */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#0f3d2e]/15 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cloud size={16} className="text-[#0284c7]" />
                        <span className="font-serif-vintage font-bold text-xs text-[#0f3d2e]">
                          Copia en Google Drive
                        </span>
                      </div>
                      <button
                        onClick={() => token && checkCloudSave(token)}
                        disabled={isCheckingSave}
                        className="text-[10px] font-semibold text-[#16553f] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Verificar copia en Drive"
                      >
                        <RefreshCw size={12} className={isCheckingSave ? 'animate-spin' : ''} />
                        <span>Comprobar</span>
                      </button>
                    </div>

                    {isCheckingSave ? (
                      <div className="text-center py-3 text-xs text-[#0f3d2e]/60 flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Buscando copia en tu Google Drive...</span>
                      </div>
                    ) : latestSave ? (
                      <div className="p-2.5 rounded-lg bg-[#f0fdf4] border border-[#86efac] text-xs space-y-1">
                        <div className="font-bold text-[#166534] flex items-center justify-between">
                          <span>✅ Copia encontrada: {latestSave.name}</span>
                          {latestSave.webViewLink && (
                            <a
                              href={latestSave.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#0284c7] hover:underline flex items-center gap-0.5"
                            >
                              <span>Ver en Drive</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-[#14532d]">
                          Última sincronización:{' '}
                          {new Date(latestSave.modifiedTime || '').toLocaleString('es-ES')}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-[#fff8e3] border border-[#e0a93b]/40 text-xs text-[#854d0e]">
                        Aún no tienes una copia guardada en tu Google Drive. Toca "Guardar en Google
                        Drive" para respaldar tu partida.
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={handleSaveGame}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-xs hover:bg-[#16553f] active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CloudUpload size={15} />
                        )}
                        <span>{isSaving ? 'Guardando...' : 'Guardar en Drive'}</span>
                      </button>

                      <button
                        onClick={handleRestoreGame}
                        disabled={!latestSave || isLoadingSave}
                        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-serif-vintage font-bold text-xs transition-all ${
                          latestSave && !isLoadingSave
                            ? 'bg-[#e0a93b] text-[#0a2e22] hover:bg-[#f5c258] active:scale-95 cursor-pointer shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isLoadingSave ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CloudDownload size={15} />
                        )}
                        <span>{isLoadingSave ? 'Cargando...' : 'Restaurar de Drive'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. DRIVE EXPLORER TAB */}
              {activeSubTab === 'explorer' && (
                <div className="space-y-3 pt-1">
                  {/* Search and refresh bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search
                        size={14}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0f3d2e]/50"
                      />
                      <input
                        type="text"
                        placeholder="Buscar archivos en Google Drive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#0f3d2e]/25 text-[#0f3d2e] focus:outline-hidden focus:border-[#e0a93b]"
                      />
                    </div>
                    <button
                      onClick={() => token && fetchFiles(token, searchQuery)}
                      disabled={isLoadingFiles}
                      className="p-2 rounded-xl bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] transition-colors cursor-pointer"
                      title="Refrescar lista"
                    >
                      <RefreshCw size={14} className={isLoadingFiles ? 'animate-spin' : ''} />
                    </button>
                  </div>

                  {fileError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                      {fileError}
                    </div>
                  )}

                  {/* File List */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {isLoadingFiles ? (
                      <div className="text-center py-6 text-xs text-[#0f3d2e]/60 flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Cargando archivos de Google Drive...</span>
                      </div>
                    ) : files.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#0f3d2e]/60">
                        No se encontraron archivos en Google Drive.
                      </div>
                    ) : (
                      files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#0f3d2e]/15 hover:border-[#e0a93b]/60 transition-all text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <FileText size={16} className="text-[#0284c7] shrink-0" />
                            <div className="min-w-0">
                              <div className="font-bold text-[#0f3d2e] truncate" title={file.name}>
                                {file.name}
                              </div>
                              <div className="text-[10px] text-[#0f3d2e]/60 truncate">
                                {file.modifiedTime
                                  ? new Date(file.modifiedTime).toLocaleDateString('es-ES')
                                  : 'Sin fecha'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-[#0284c7] hover:bg-[#0284c7]/10 rounded-lg transition-colors"
                                title="Abrir en Google Drive"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="p-1.5 text-[#b3262e] hover:bg-[#b3262e]/10 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar de Google Drive"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f6e9c8]/70 border-t border-[#0f3d2e]/20 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-xs hover:bg-[#16553f] transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Mandatory Explicit Confirmation Dialog for Destructive or Overwrite Operations */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#fdf8ee] text-[#0f3d2e] rounded-2xl p-4 border-2 border-[#e0a93b] shadow-2xl space-y-3 animate-scale-up">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle size={20} className="shrink-0" />
              <h3 className="font-serif-vintage font-bold text-sm text-[#0f3d2e]">
                {confirmModal.title}
              </h3>
            </div>

            <p className="text-xs text-[#0f3d2e]/80 leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal((p) => ({ ...p, isOpen: false }))}
                className="px-3 py-1.5 text-xs font-serif-vintage font-bold rounded-lg border border-[#0f3d2e]/30 text-[#0f3d2e] hover:bg-black/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-3.5 py-1.5 text-xs font-serif-vintage font-bold rounded-lg text-white shadow-xs cursor-pointer ${
                  confirmModal.isDangerous
                    ? 'bg-[#b3262e] hover:bg-[#8f1d24]'
                    : 'bg-[#0f3d2e] hover:bg-[#16553f]'
                }`}
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
