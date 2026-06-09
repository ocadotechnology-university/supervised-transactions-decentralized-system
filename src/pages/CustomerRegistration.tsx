import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import {generateId} from "../utils/crypto.ts";
import type { CustomerEntry } from "../utils/types.ts";
import { Screen, Title, ButtonContainer, Button, Input, ErrorText } from "../styles/common.styles.ts";
import { STORAGE_KEYS } from "../utils/localStorageKeys.ts";

const MAX_NAME_LENGTH = 16;

export default function CustomerRegistration() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [, setCustomerData] = useLocalStorage<CustomerEntry | null>(STORAGE_KEYS.CUSTOMER_DATA, null);

    const checkNameValidationError = (trimmedName: string): string | null => {
        if (!trimmedName) {
            return "Customer name is required";
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            return `Max ${MAX_NAME_LENGTH} characters`;
        }
        return null;
    }

    const handleRegister = (): void => {
        const trimmedName = name.trim();
        const nameValidationError = checkNameValidationError(trimmedName);

        if (nameValidationError) {
            setNameError(nameValidationError);
            return;
        }

        setNameError("");

        const payload: CustomerEntry = {
            name: trimmedName.toUpperCase(),
            id: generateId(),
        };

        setCustomerData(payload);
    }

    return (
        <Screen>
            <Title>Customer registration</Title>

            <Input
                placeholder={"Enter your name".toUpperCase()}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {nameError && <ErrorText>{nameError}</ErrorText>}

            <ButtonContainer>
                <Button onClick={handleRegister}>
                    Ok
                </Button>

                <Button onClick={() => navigate("/", { replace: true })}>
                    Back
                </Button>
            </ButtonContainer>
        </Screen>
    );
}