import { Navigate, Outlet } from "react-router-dom";
import { useReadLocalStorage } from "usehooks-ts"

type ProtectedRouteProps = {
    storageKey: string;
    path: string;
    requireData: boolean;
};

export default function ProtectedRoute({ storageKey, path, requireData }: ProtectedRouteProps) {
    const storedData = useReadLocalStorage(storageKey);

    if (requireData && !storedData) {
        return <Navigate to={path} replace />;
    }

    if (!requireData && storedData) {
        return <Navigate to={path} replace />;
    }

    return <Outlet />;
}