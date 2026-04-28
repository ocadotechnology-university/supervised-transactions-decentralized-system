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

            const nonce = generateUUID();

            const message = JSON.stringify({
                amount,
                name: trader.name,
                nonce,
            });

            const encoded = encodeData(message);

            const signatureBuffer = await signData(privKey, encoded);
            const signature = bufferToBase64(signatureBuffer);

            const payload = {
                amount,
                name: trader.name,
                nonce,
                signature,
            };

            console.log("SIGNED PAYLOAD:", payload);

            const updatedTrader = {
                ...trader,
                points: trader.points - amount,
            };

            localStorage.setItem(TRADER_KEY, JSON.stringify(updatedTrader));
            setTrader(updatedTrader);


            navigate("/trader/points/qr", { state: payload, replace: true });

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
                {[10, 60, 20, 70, 30, 80, 40, 90, 50, 100].map((val) => (
                    <button
                        key={val}
                        className="button"
                        onClick={() => handleTransfer(val)}
                    >
                        {val}
                    </button>
                ))}
            </div>

            {error && <p className="error">{error}</p>}

            <div className="buttonContainer" style={{ marginTop: "40px" }}>
                <button
                    className="button"
                    onClick={() => navigate("/trader")}
                >
                    BACK
                </button>
            </div>
        </div>
    );
}