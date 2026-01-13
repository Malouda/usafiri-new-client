import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { SocketProvider } from "./contexts/SocketProvider";
import AppRouter from "./routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Loading app...</p>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SocketProvider>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <AppRouter />
              </BrowserRouter>
            </SocketProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
