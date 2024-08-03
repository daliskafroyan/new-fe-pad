import { QueryClientProvider, QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "./components/ui/use-toast";
import { AuthProvider } from "./pages/auth/auth.provider";
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import router from "./router";

export default function App() {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => {
                if (error.message === "Unauthenticated.") {
                    // logout();
                    window.localStorage.removeItem("token");
                    // globalStore$.delete();
                    window.location.replace("/sign-in");
                    // navigate("/login", { replace: true });
                }
                console.log(error);
                return toast({
                    title: 'Error!',
                    description: error.message,
                })
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