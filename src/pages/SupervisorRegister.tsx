import "../styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateEd25519KeyPair, exportKey } from "../utils/cryptoutils";

type TraderEntry = {
    name: string;
    points: number,
    publicKey: JsonWebKey;
    timestamp: number;
};

// equals to 24 hours
const DAY_MS = 24 * 60 * 60 * 1000;

function getValidEntries(stored: TraderEntry[]): TraderEntry[] {
    const now = Date.now();
    return stored.filter((entry) => now - entry.timestamp < DAY_MS);
}

export default function RegisterTrader() {
    const [name, setName] = useState("");
    const [points, setPoints] = useState("");

    const [nameError, setNameError] = useState("");
    const [pointsError, setPointsError] = useState("");

    const navigate = useNavigate();

    function validate(): boolean {
        let valid = true;

        setNameError("");
        setPointsError("");

        const trimmedName = name.trim();

        if (!trimmedName) {
            setNameError("Trader name is required");
            valid = false;
        } else if (trimmedName.length > 20) {
            setNameError("Max 20 characters");
            valid = false;
        }

        if (!points.trim()) {
            setPointsError("Point pool is required");
            valid = false;
        } else if (!/^[0-9]+$/.test(points)) {
            setPointsError("Must be a number");
            valid = false;
        }

        if (valid) {
            const STORAGE_KEY = "traders";

            const stored: TraderEntry[] = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            const validEntries = getValidEntries(stored);

            const exists = validEntries.some(
                (entry) =>
                    entry.name.toLowerCase() === trimmedName.toLowerCase()
            );

            if (exists) {
                setNameError("Trader with this name already exists");
                valid = false;
            }
        }

        return valid;
    }

    async function handleGenerate() {
        if (!validate()) return;

        try {
            const keys = await generateEd25519KeyPair();

            const privJwk = await exportKey(keys.privateKey);
            const pubJwk = await exportKey(keys.publicKey);

            const STORAGE_KEY = "traders";

            const stored: TraderEntry[] = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            const validEntries = getValidEntries(stored);
            const now = Date.now();

            validEntries.push({
                name: name.trim(),
                points: Number(points),
                publicKey: pubJwk,
                timestamp: now,
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));

            const payload = {
                name: name.trim(),
                points: Number(points),
                privateKey: privJwk,
                timestamp: now,
            };

            navigate("/supervisor/registerTrader/qr", { state: payload});

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
                <button className="button" onClick={handleGenerate} >
                    OK
                </button>

                <button
                    className="button"
                    onClick={() => navigate("/supervisor", { replace: true })}
                >
                    BACK
                </button>
            </div>
        </div>
    );
}