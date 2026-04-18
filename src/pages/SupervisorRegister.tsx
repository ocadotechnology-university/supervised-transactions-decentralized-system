import "../styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateEd25519KeyPair, exportKey } from "../components/cryptoutils";

export default function RegisterTrader() {
    const [name, setName] = useState("");
    const [points, setPoints] = useState("");

    const [nameError, setNameError] = useState("");
    const [pointsError, setPointsError] = useState("");

    const navigate = useNavigate();

    function validate(): boolean {
        let valid = true;

        // reset errors
        setNameError("");
        setPointsError("");

        // sanitize name (trim + basic cleanup)
        const trimmedName = name.trim();

        if (!trimmedName) {
            setNameError("Trader name is required");
            valid = false;
        } else if (trimmedName.length > 20) {
            setNameError("Max 20 characters");
            valid = false;
        }

        // validate points (must be number)
        if (!points.trim()) {
            setPointsError("Point pool is required");
            valid = false;
        } else if (!/^[0-9]+$/.test(points)) {
            setPointsError("Must be a number");
            valid = false;
        }

        return valid;
    }

    async function handleGenerate() {
        if (!validate()) return;

        try {
            const keys = await generateEd25519KeyPair();

            const privJwk = await exportKey(keys.privateKey);
            const pubJwk = await exportKey(keys.publicKey);

            // store public key of Trader nin Supervisor sessionStorage
            const stored = JSON.parse(sessionStorage.getItem("pubKeys") || "[]");
            stored.push(pubJwk);
            sessionStorage.setItem("pubKeys", JSON.stringify(stored));

            const payload = {
                name: name.trim(),
                points: Number(points),
                privateKey: privJwk,
                publicKey: pubJwk,
            };

            navigate("/supervisor/registerTrader/qr", { state: payload });

        } catch (error) {
            console.error(error);
            alert("Failed to generate QR");
        }
    }

    return (
        <div className="screen">
            <h1 className="title">ENTER TRADER DETAILS</h1>

            <input
                className="input"
                placeholder="TRADER NAME"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="error">{nameError}</p>}

            <input
                className="input"
                placeholder="POINT POOL"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
            />
            {pointsError && <p className="error">{pointsError}</p>}

            <div className="buttonContainer">
                <button className="button" onClick={handleGenerate} disabled={!points.trim()}>
                    OK
                </button>

                <button
                    className="button"
                    onClick={() => navigate("/supervisor/main")}
                >
                    BACK
                </button>
            </div>
        </div>
    );
}