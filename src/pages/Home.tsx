import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { Screen, Title, ErrorText } from "../styles/common.styles.ts";
import {RoleSelectorContainer, RoleButton, ArrowButton, HomeContent} from "../styles/Home.styles.ts";
import { getThemeByRole } from "../styles/theme.ts";
import type { UserRole } from "../styles/theme.ts";

const errorMessage = "Your browser is not supported. Please update your browser.";

type RoleDef = {
    name: string;
    path: string;
    roleType: UserRole;
    isValid: () => boolean;
};

export default function Home() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [roleIndex, setRoleIndex] = useState<number>(0);

    const hasCrypto = typeof window !== 'undefined' && !!window.crypto;
    const hasRandomValues = hasCrypto && typeof window.crypto.getRandomValues === 'function';
    const hasSubtleCrypto = hasCrypto && window.crypto.subtle !== undefined;
    const hasBase64Methods = typeof Uint8Array.prototype.toBase64 === 'function' && typeof Uint8Array.fromBase64 === 'function';

    const roles: RoleDef[] = [
        {
            name: "CUSTOMER",
            path: "/customer",
            roleType: "customer",
            isValid: () => hasRandomValues
        },
        {
            name: "TRADER",
            path: "/trader",
            roleType: "trader",
            isValid: () => hasSubtleCrypto && hasBase64Methods
        },
        {
            name: "SUPERVISOR",
            path: "/supervisor",
            roleType: "supervisor",
            isValid: () => hasSubtleCrypto && hasBase64Methods
        }
    ];

    const handlePrev = () => {
        setError(null);
        setRoleIndex((prev) => (prev - 1 + roles.length) % roles.length);
    };

    const handleNext = () => {
        setError(null);
        setRoleIndex((prev) => (prev + 1) % roles.length);
    };

    const handleRoleClick = () => {
        const currentRole = roles[roleIndex];

        if (!currentRole.isValid()) {
            setError(errorMessage);
            return;
        }

        setError(null);
        navigate(currentRole.path);
    };

    const currentRole = roles[roleIndex];
    const localTheme = getThemeByRole(currentRole.roleType);

    return (
        <Screen>
            <HomeContent>
                <Title>WHO ARE YOU</Title>

                {error && (
                    <ErrorText>{ error }</ErrorText>
                )}

                <ThemeProvider theme={localTheme}>
                    <RoleSelectorContainer>
                        <ArrowButton onClick={handlePrev}>
                            {"<"}
                        </ArrowButton>

                        <RoleButton onClick={handleRoleClick}>
                            {currentRole.name}
                        </RoleButton>

                        <ArrowButton onClick={handleNext}>
                            {">"}
                        </ArrowButton>
                    </RoleSelectorContainer>
                </ThemeProvider>
            </HomeContent>
        </Screen>
    );
}