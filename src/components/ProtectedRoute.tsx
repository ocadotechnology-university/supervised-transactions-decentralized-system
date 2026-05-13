import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
    storageKey: string;
    path: string;
    requireData: boolean;
}

export default function ProtectedRoute({ storageKey, path, requireData }: ProtectedRouteProps) {
    const storedData = Boolean(localStorage.getItem(storageKey));

    if (requireData && !storedData) {
        return <Navigate to={path} replace />;
    }

    if (!requireData && storedData) {
        return <Navigate to={path} replace />;
    }

    return <Outlet />;
}