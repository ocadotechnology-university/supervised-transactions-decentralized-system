import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passHash } from '../components/cryptoutils';
import "../styles.css";


export default function SupervisorAuth() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // hardcoded hash sha256 of "admin123" - will change the password later
    const HASH = "JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=";

    function validate(): boolean {
        setError("");

        const trimmed = password.trim();

        if (!trimmed) {
            setError("Password is required");
            return false;
        }

        return true;
    }

    const handleLogin = async () => {
        if (!validate()) return;

        const hashed = await passHash(password.trim());

        if (hashed === null) {
            setError("Encryption error");
            return;
        }

        if (hashed === HASH) {
            sessionStorage.setItem("isSupervisor", "true");
            navigate("/supervisor");
        } else {
            setError("Wrong password");
        }
    };

    return (
        <div className="screen">
            <h1 className="title">ENTER SUPERVISOR PASSWORD</h1>

            <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
            />

            {error && <p className="error">{error}</p>}

            <div className="buttonContainer">
                <button className="button" onClick={handleLogin} disabled={!password.trim()}>
                    OK
                </button>
                <button className="button" onClick={() => navigate("/")}>
                    BACK
                </button>
            </div>
        </div>
    );
}