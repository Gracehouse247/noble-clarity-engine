
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/NobleContext';
import { useAuth } from '../contexts/AuthContext';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FunctionComponent<AdminProtectedRouteProps> = ({ children }) => {
    const { userProfile } = useUser();
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-noble-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Check if logged in AND has admin systemRole
    if (!user || userProfile.systemRole !== 'admin') {
        console.warn("Unauthorized admin access attempt", { user: user?.email, role: userProfile.systemRole });
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;
