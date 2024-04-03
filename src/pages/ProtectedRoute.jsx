import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) navigate("/")
    }, [isAuthenticated, navigate])

    return (
        <div>
            {isAuthenticated ? children : null}
        </div>
    )
}

export default ProtectedRoute
