import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line no-console
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      // eslint-disable-next-line no-console
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2">
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg shadow-2xl flex items-start gap-4 max-w-sm animate-in slide-in-from-bottom-4">
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1">
            {offlineReady ? 'App ready to work offline' : 'New content available'}
          </h3>
          <p className="text-slate-400 text-sm">
            {offlineReady
              ? 'You can now use this app without an internet connection.'
              : 'Click reload to update to the latest version.'}
          </p>
          
          {needRefresh && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
          )}
        </div>
        <button onClick={close} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
