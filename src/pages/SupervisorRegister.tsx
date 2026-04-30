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


    function validate(trimmedName: string, trimmedPoints: string): boolean {
        if (!trimmedName) {
            setNameError("Trader name is required");
            return false;
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            setNameError(`Max ${MAX_NAME_LENGTH} characters`);
            return false;
        }
        if (!trimmedPoints) {
            setPointsError("Point pool is required");
            return false;
        }
        if (!trimmedPoints || !/^[0-9]+$/.test(trimmedPoints)) {
            setPointsError("Must be a positive number");
            return false;
        }
        setNameError("");
        setPointsError("");
        return true;
    }

    async function handleGenerate() {
        const trimmedName = name.trim();
        const trimmedPoints = points.trim();
        if (!validate(trimmedName, trimmedPoints)){
            return;
        }

        let allTraders: TraderEntry[] = [];

        const storedTraders = localStorage.getItem(TRADERS_KEY)
        if (storedTraders) {
            allTraders = JSON.parse(storedTraders)
            if (allTraders.some((trader) => trader.name === trimmedName)) {
                setNameError("Trader with this name already exists");
                return;
            }
        }

        try {
            const keys = await generateEd25519KeyPair();
            const privJwk = await exportKey(keys.privateKey);
            const pubJwk = await exportKey(keys.publicKey);

            const now = Date.now();
            const parsedPoints = Number(trimmedPoints);

            allTraders.push({
                name: trimmedName,
                points: parsedPoints,
                publicKey: pubJwk,
                timestamp: now,
            });

            localStorage.setItem(TRADERS_KEY, JSON.stringify(allTraders));

            const qrPayload = {
                name: name.trim(),
                points: parsedPoints,
                privateKey: privJwk,
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