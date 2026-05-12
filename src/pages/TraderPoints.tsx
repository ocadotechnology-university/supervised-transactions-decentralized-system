import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TraderEntry } from "../utils/types.ts";
import { Button, ButtonContainer, ErrorText, PointsGrid, Screen, Title } from "../styles.ts";
import { importPrivateKey, signData, encodeData, bufferToBase64, generateID } from "../utils/cryptoutils";

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
            const privKey = await importPrivateKey(trader.key);

            const message = {
                name: trader.name,
                points: amount,
                id: generateID(),
                timestamp: Date.now(),
            };

            const encoded = encodeData(JSON.stringify(message));
            const signatureBuffer = await signData(privKey, encoded);
            const signature = bufferToBase64(signatureBuffer);

            const payload = {
                title: "SHOW CODE TO CUSTOMER",
                qrData: {
                    message,
                    signature
                }
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
        <Screen>
            <Title>SELECT POINT AMOUNT</Title>

            <PointsGrid>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                    <Button
                        key={val}
                        onClick={() => handleTransfer(val)}
                    >
                        {val}
                    </Button>
                ))}
            </PointsGrid>

            <ButtonContainer style={{ marginTop: "40px" }}>
                {error && <ErrorText>{error}</ErrorText>}
                <Button
                    onClick={() => navigate("/trader", {replace: true})}
                >
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}