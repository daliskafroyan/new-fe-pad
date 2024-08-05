import { getUserRoutes } from '@/lib/utils';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function withRouteProtection<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedRoute(props: P) {
        const router = useLocation();
        const navigate = useNavigate();

        const userRoutes = getUserRoutes();

        useEffect(() => {
            if (userRoutes.length === 0) {
                // Redirect to login page if the user has no routes
                navigate("/login", { replace: true });
            } else if (!userRoutes.includes(router.pathname)) {
                // Redirect to dashboard if the user doesn't have access to the current route
                navigate("/dashboard", { replace: true });
            }
        }, [userRoutes, router]);

        if (userRoutes.length === 0 || !userRoutes.includes(router.pathname)) {
            return <div>Loading...</div>;
        }

        // If the user has permission, render the wrapped component
        return <WrappedComponent {...props} />;
    };
}