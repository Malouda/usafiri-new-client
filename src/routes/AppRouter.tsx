import { Navigate, Route, Routes, type RouteProps } from 'react-router-dom';
import { useAuthInit } from '../modules/auth/hooks/useAuthInit';
import AuthRedirect from '../modules/auth/components/AuthRedirect';
import RequireAuth from '../modules/auth/components/RequireAuth';
import AdminLayout from "../modules/layout/AdminLayout";
import NotFound from '../modules/layout/NotFound';
import { adminRoutes, protectedRoutes, publicRoutes } from './index';

const AppRouter = (props: RouteProps) => {
    // Initialize authentication and get status from Redux store
    const { isAuthenticated, isLoading } = useAuthInit();

    console.log('AppRouter rendering:', { isAuthenticated, isLoading });

    // Show loading spinner while initializing auth
    if (isLoading) {
        console.log('Showing loading screen');
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-xs text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    console.log('Rendering routes');
    return (
        <Routes>
            {/* Root route redirects based on authentication status */}
            <Route
                path="/"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/auth/login" replace />
                }
            />

            {/* Public routes - accessible to everyone */}
            {publicRoutes.map((route, idx) => (
                <Route
                    key={`public-${idx}-${route.name}`}
                    path={route.path}
                    element={
                        route.path?.toString().startsWith('/auth') && route.path !== '/auth/register' ? (
                            <AuthRedirect>
                                {route.element}
                            </AuthRedirect>
                        ) : (
                            route.element
                        )
                    }
                />
            ))}

            {/* Admin dashboard routes with AdminLayout */}
            {adminRoutes.map((route, idx) => (
                <Route
                    key={`admin-${idx}-${route.name}`}
                    path={route.path}
                    element={
                        <RequireAuth requiredRoles={route.roles}>
                            <AdminLayout {...props} breadcrumbItems={route.breadcrumb}>
                                {route.element}
                            </AdminLayout>
                        </RequireAuth>
                    }
                />
            ))}

            {/* Other protected routes without AdminLayout */}
            {protectedRoutes.map((route, idx) => (
                <Route
                    key={`protected-${idx}-${route.name}`}
                    path={route.path}
                    element={
                        <RequireAuth requiredRoles={route.roles}>
                            {route.element}
                        </RequireAuth>
                    }
                />
            ))}

            {/* Catch-all route for unmatched paths */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
