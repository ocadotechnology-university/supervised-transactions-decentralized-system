import "../styles.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    importPrivateKey,
    signData,
    encodeData,
    bufferToBase64,
    generateUUID
} from "../utils/cryptoutils";

type TraderEntry = {
    name: string;
    points: number;
    privateKey: JsonWebKey;
    timestamp: number;
};

export default function TraderPoints() {
    const TRADER_KEY = "traderData";
    const navigate = useNavigate();

    const [trader, setTrader] = useState<TraderEntry | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem(TRADER_KEY);
        if (!stored) {
            navigate("/trader/register", { replace: true });
            return;
        }

        setTrader(JSON.parse(stored));
    }, []);

    async function handleTransfer(amount: number) {
        if (!trader) return;

        setError("");

        if (trader.points < amount) {
            setError("Not enough points");
            return;
        }

        try {
            const privKey = await importPrivateKey(trader.privateKey);

            const message = {
                name: trader.name,
                points: amount,
                uuid: generateUUID(),
                timestamp: Date.now(),
            };

            const encoded = encodeData(JSON.stringify(message));
            const signatureBuffer = await signData(privKey, encoded);
            const signature = bufferToBase64(signatureBuffer);

            const payload = {
                message,
                signature
            };

            const updatedTrader = {
                ...trader,
                points: trader.points - amount,
            };

            localStorage.setItem(TRADER_KEY, JSON.stringify(updatedTrader));
            navigate("/trader/points/qr", { state: payload });

        } catch (e) {
            console.error(e);
            setError("Signing failed");
        }
    }

    if (!trader) return null;

    return (
        <div className="screen">
            <h1 className="title">SELECT POINT AMOUNT</h1>

            <div className="pointsGrid">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                    <button
                        key={val}
                        className="button"
                        onClick={() => handleTransfer(val)}
                    >
                        {val}
                    </button>
                ))}
            </div>

            <div className="buttonContainer" style={{ marginTop: "40px" }}>
                {error && <p className="error">{error}</p>}
                <button
                    className="button"
                    onClick={() => navigate("/trader", {replace: true})}
                >
                    BACK
                </button>
            </div>
        </div>
    );
}