import '@/index.css';

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RootHeader } from '@/components/root-header';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

// Register types of custom variables here
interface AppRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  return (
    <>
      <RootHeader />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
      <Toaster />
      {(offlineReady || needRefresh) &&
        void toast(
          offlineReady ? 'App ready to work offline' : 'There is a new version of the app',
          {
            description: needRefresh && 'Click on the reload button to update',
            duration: 5000,
            action: {
              label: offlineReady ? 'Close' : 'Reload',
              onClick: () => {
                if (offlineReady) {
                  setOfflineReady(false);
                  setNeedRefresh(false);
                } else {
                  updateServiceWorker(true);
                }
              },
            },
          }
        )}
    </>
  );
}
