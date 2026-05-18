import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { TraderEntry } from "../utils/types.ts";
import { Button, ButtonContainer, ErrorText, PointsGrid, Screen, Title } from "../styles/common.styles.ts";
import { importKey, signData, encodeData, bufferToBase64, generateId } from "../utils/crypto.ts";

const TRADER_KEY = "traderData";
const POINT_VALUES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function TraderPoints() {
    const navigate = useNavigate();

    const [trader, setTrader] = useState<TraderEntry | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedData = localStorage.getItem(TRADER_KEY);
        if (storedData) {
            setTrader(JSON.parse(storedData));
        }
    }, []);

    const handleTransfer = async (amount: number): Promise<void> => {
        if (!trader) {
            return;
        }

        setError("");

        if (trader.points < amount) {
            setError("Not enough points");
            return;
        }

        try {
            const privKey = await importKey(trader.key, "sign");

            const message = {
                name: trader.name,
                points: amount,
                id: generateId(),
                timestamp: Date.now(),
            };

            const encoded = encodeData(JSON.stringify(message));
            const signatureBuffer = await signData(privKey, encoded);
            const signature = bufferToBase64(signatureBuffer);

            const qrPayload = {
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
            navigate("/trader/points/qr", { state: qrPayload });

        } catch (error) {
            console.error(error);
            setError("Signing failed");
        }
    }

    if (!trader) {
        return null;
    }

    return (
        <Screen>
            <Title>SELECT POINT AMOUNT</Title>

            <PointsGrid>
                {POINT_VALUES.map((val: number) => (
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
                <Button onClick={() => navigate(-1)}>
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}