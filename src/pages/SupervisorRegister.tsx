import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateEd25519KeyPair, exportKey } from "../utils/crypto.ts";
import type { TraderEntry } from "../utils/types.ts";
import { Screen, Title, ButtonContainer, Button, Input, ErrorText } from "../styles.ts";

const TRADERS_KEY = "traders";
const MAX_NAME_LENGTH = 20;

export default function SupervisorRegister() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [points, setPoints] = useState("");
    const [nameError, setNameError] = useState("");
    const [pointsError, setPointsError] = useState("");

    const checkNameValidationError = (trimmedName: string): string | null => {
        if (!trimmedName) {
            return "Trader name is required";
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            return `Max ${MAX_NAME_LENGTH} characters`;
        }
        return null;
    }

    const checkPointsValidationError = (trimmedPoints: string): string | null => {
        if (!trimmedPoints) {
            return "Point pool is required";
        }
        if (!trimmedPoints || !/^[0-9]+$/.test(trimmedPoints)) {
            return "Must be a positive number";
        }
        return null;
    }

    async function handleGenerate() {
        const trimmedName = name.trim();
        const trimmedPoints = points.trim();

        const nameValidationError = checkNameValidationError(trimmedName);
        const pointsValidationError = checkPointsValidationError(trimmedPoints);

        if (nameValidationError || pointsValidationError) {
            setNameError(nameValidationError || "");
            setPointsError(pointsValidationError || "");
            return;
        }

        setNameError("");
        setPointsError("");

        const storedTraders = localStorage.getItem(TRADERS_KEY)
        const allTraders: TraderEntry[] = storedTraders ? JSON.parse(storedTraders) : [];

        if (allTraders.some((trader) => trader.name === trimmedName)) {
            setNameError("Trader with this name already exists");
            return;
        }

        try {
            const keys = await generateEd25519KeyPair();
            const privJwk = await exportKey(keys.privateKey);
            const pubJwk = await exportKey(keys.publicKey);

            const now = Date.now();
            const parsedPoints = Number(trimmedPoints);

            const newTrader: TraderEntry = {
                name: trimmedName,
                points: parsedPoints,
                key: pubJwk,
                timestamp: now,
            };

            const updatedTraders = [...allTraders, newTrader];
            localStorage.setItem(TRADERS_KEY, JSON.stringify(updatedTraders));

            const qrPayload = {
                name: trimmedName,
                points: parsedPoints,
                key: privJwk,
                timestamp: now,
            };

            navigate("/supervisor/register/qr", { state: qrPayload, replace: true });

        } catch (error) {
            console.error(error);
            setNameError("Failed to generate cryptographic keys");
        }
    }

    return (
        <Screen>
            <Title>ENTER TRADER DETAILS</Title>

            <Input
                placeholder="TRADER NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {nameError && <ErrorText>{nameError}</ErrorText>}

            <Input
                placeholder="POINT POOL"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
            />
            {pointsError && <ErrorText>{pointsError}</ErrorText>}

            <ButtonContainer>
                <Button onClick={handleGenerate}>
                    OK
                </Button>

                <Button onClick={() => navigate("/supervisor")}>
                    BACK
                </Button>
            </ButtonContainer>
        </Screen>
    );
}