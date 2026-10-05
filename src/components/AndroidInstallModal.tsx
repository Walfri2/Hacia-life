/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, Download, CheckCircle, ExternalLink, X } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallDirectly: boolean;
  onInstall: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  canInstallDirectly,
  onInstall
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#fdf8ee] text-[#0f3d2e] rounded-2xl border-3 border-[#e0a93b] shadow-2xl p-5 overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#0f3d2e]/60 hover:text-[#0f3d2e] p-1.5 rounded-lg hover:bg-[#e0a93b]/20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0a2e22] border-2 border-[#e0a93b] p-1 flex items-center justify-center text-2xl shadow-md shrink-0">
            🔧
          </div>
          <div>
            <h2 className="font-serif-vintage font-bold text-lg text-[#0f3d2e]">
              Instalar en Android
            </h2>
            <p className="text-xs text-[#0f3d2e]/75">
              Juega a pantalla completa, sin barras de navegador y sin conexión.
            </p>
          </div>
        </div>

        {/* Main Install Action */}
        {canInstallDirectly ? (
          <div className="mb-4 p-4 rounded-xl bg-[#0f3d2e] text-[#fdf8ee] text-center space-y-2.5">
            <p className="text-xs text-[#f6e9c8]/90">
              Tu teléfono Android está listo para instalar la aplicación directamente.
            </p>
            <button
              onClick={() => {
                onInstall();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-[#e0a93b] text-[#0a2e22] font-serif-vintage font-bold text-sm rounded-xl hover:bg-[#f6e9c8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <Download size={18} />
              <span>Instalar Aplicación en este teléfono</span>
            </button>
          </div>
        ) : (
          <div className="mb-4 p-3.5 rounded-xl bg-[#fff8e3] border border-[#e0a93b]/50 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#0f3d2e]">
              <Smartphone size={16} className="text-[#16553f]" />
              <span>Cómo instalar en Chrome para Android:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#0f3d2e]/85 pl-1 leading-relaxed">
              <li>Abre el menú de Chrome (los <strong>tres puntos ⋮</strong> arriba a la derecha).</li>
              <li>Toca en <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</li>
              <li>¡Listo! Aparecerá con su icono nativo y funcionará a pantalla completa como una app nativa.</li>
            </ol>
          </div>
        )}

        {/* Google Play / APK instructions */}
        <div className="p-3.5 rounded-xl bg-[#0f3d2e]/5 border border-[#0f3d2e]/15 text-xs space-y-2">
          <div className="font-bold text-[#0f3d2e] flex items-center gap-1.5">
            <CheckCircle size={15} className="text-[#10b981]" />
            <span>Publicación en Google Play Store:</span>
          </div>
          <p className="text-[#0f3d2e]/80 text-[11px] leading-relaxed">
            Esta app ya cuenta con <strong>Web App Manifest completo</strong>, <strong>Service Worker con caché offline</strong> y <strong>iconos maskable estándar</strong>.
          </p>
          <div className="bg-[#0a2e22] text-[#fdf8ee] p-2.5 rounded-lg text-[10px] font-mono select-all">
            npx @bubblewrap/cli build
          </div>
          <p className="text-[10px] text-[#0f3d2e]/70">
            Con la herramienta oficial de Google <em>Bubblewrap</em> o <em>Capacitor</em> puedes generar el archivo <code>.aab</code> firmado para subirlo directo a Google Play Console.
          </p>
        </div>

        {/* Close footer */}
        <div className="mt-4 pt-3 border-t border-[#0f3d2e]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-xs rounded-lg hover:bg-[#16553f] transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
