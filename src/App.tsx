import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "./components/ui/use-toast";
import { AuthProvider } from "./pages/auth/auth.provider";
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import router from "./router";
import { useAuthStore } from "./store/authStore";
import { useAuth } from "./pages/auth/use-auth.hook";

function createQueryClient() {
    const { logout } = useAuth();
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
        queryCache: new QueryCache({
            onError: (error) => {
                if (error.message === "Unauthenticated." || error.message === "Authentication failed" || error.message === "Invalid authentication") {
                    const clearAuth = useAuthStore.getState().clearAuth;
                    clearAuth();
                    logout()
                    localStorage.removeItem('token');
                    window.location.href = '/';
                } else {
                    console.log(error);
                    toast({
                        title: 'Error!',
                        description: error.message,
                    });
                }
            },
        }),
        mutationCache: new MutationCache({
            onError: (error) => {
                return toast({
                    title: 'Error!',
                    description: error.message,
                })
            },
        }),
    });
}

export default function App() {
    const queryClient = createQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
                    <RouterProvider router={router} />
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}