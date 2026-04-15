import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { encodeData, digestData, bufferToBase64 } from '../components/cryptoutils.ts';
import "../styles.css";

export async function passHash(text: string) {
    try {
        const encodedText = encodeData(text);
        const rawHashBuffer = await digestData(encodedText);
        return bufferToBase64(rawHashBuffer);
    } catch (error) {
        console.error("Failed to hash text:", error);
        return null;
    }
}

export default function SupervisorAuth() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // hardcoded hash sha256 of "admin123" - will change later
    const HASH = "JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=";

    const handleLogin = async () => {
        const hashed = await passHash(password);

        if (hashed === null) {
            alert("System: Encryption failed");
            return;
        }

        if (hashed === HASH) {
            // session storage as auth - not safe but without backend nothing else can be done
            localStorage.setItem("isSupervisor", "true");
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
