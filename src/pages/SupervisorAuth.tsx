import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "../styles.css";

export default function SupervisorAuth() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // hardcoded hash sha256 of "admin123" - will change later
    const HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

    const handleLogin = () => {
        const hashed = CryptoJS.SHA256(password).toString();
        if (hashed === HASH) {
            navigate("/supervisor/main");
        } else {
            alert("Wrong password");
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

            <div className="buttonContainer">
                <button className="button" onClick={handleLogin}>OK</button>
                <button className="button" onClick={() => navigate("/")}>BACK</button>
            </div>
        </div>
    );
}
