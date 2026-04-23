import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const isAuth = sessionStorage.getItem("isSupervisor") === "true";

    return isAuth ? <Outlet /> : <Navigate to="/supervisor/login" replace />;
}