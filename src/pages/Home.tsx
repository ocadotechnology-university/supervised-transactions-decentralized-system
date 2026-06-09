import { useNavigate } from "react-router-dom";
import { useState, useRef} from "react";
import { ThemeProvider } from "styled-components";
import {Screen, Title, ErrorText, Paragraph} from "../styles/common.styles.ts";
import {HomeContent, CardCarouselContainer, ScrollTrack, RoleCard, InfoButton, EnterRoleButton, InfoDialog, CardTitle, DialogContent, DialogTitle, DialogCloseButton} from "../styles/Home.styles.ts";
import { getThemeByRole } from "../styles/theme.ts";
import type { UserRole } from "../styles/theme.ts";

const customerDescription = "As a Customer, You will gain points from Traders via QR codes. Later, You can cashout these points to a Supervisor, who will verify their validity and update Your placement in the ranking. Alternatively, You can transfer these points to another Customer."
const traderDescription = "As a Trader, You will transfer points to different Customers, based on their performance. To become a Trader, You need to scan a registration QR code from the Supervisor. "
const supervisorDescription = "As a Supervisor, You will manage the session: register Traders, verify Customers' points and display the ranking."
const errorMessage = "Your browser is not supported. Please update your browser.";

type RoleDef = {
    name: string;
    path: string;
    roleType: UserRole;
    description: string;
    isValid: () => boolean;
};

export default function Home() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [roleIndex, setRoleIndex] = useState<number>(0);
    const [infoText, setInfoText] = useState<string>("");
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const hasCrypto = typeof window !== 'undefined' && !!window.crypto;
    const hasRandomValues = hasCrypto && typeof window.crypto.getRandomValues === 'function';
    const hasSubtleCrypto = hasCrypto && window.crypto.subtle !== undefined;
    const hasBase64Methods = typeof Uint8Array.prototype.toBase64 === 'function' && typeof Uint8Array.fromBase64 === 'function';

    const roles: RoleDef[] = [
        {
            name: "CUSTOMER",
            path: "/customer",
            roleType: "customer",
            description: customerDescription,
            isValid: () => hasRandomValues
        },
        {
            name: "TRADER",
            path: "/trader",
            roleType: "trader",
            description: traderDescription,
            isValid: () => hasSubtleCrypto && hasBase64Methods
        },
        {
            name: "SUPERVISOR",
            path: "/supervisor",
            roleType: "supervisor",
            description: supervisorDescription,
            isValid: () => hasSubtleCrypto && hasBase64Methods
        }
    ];

    const handleScroll = () => {
        if (!scrollTrackRef.current) return;
        const track = scrollTrackRef.current;
        const cardWidth = track.firstElementChild?.getBoundingClientRect().width || 320;


        const newIndex = Math.round(track.scrollLeft / (cardWidth + 20));
        if (newIndex >= 0 && newIndex < roles.length && newIndex !== roleIndex) {
            setError(null);
            setRoleIndex(newIndex);
        }
    };

    const handleRoleClick = (role: RoleDef) => {
        if (!role.isValid()) {
            setError(errorMessage);
            return;
        }
        setError(null);
        navigate(role.path);
    };

    const openInfo = (description: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setInfoText(description);
        dialogRef.current?.showModal();
    };

    const closeInfo = () => {
        dialogRef.current?.close();
    };

    return (
        <Screen>
            <HomeContent>
                <Title>Who are you?</Title>

                {error && <ErrorText>{error}</ErrorText>}

                <CardCarouselContainer>
                    <ScrollTrack ref={scrollTrackRef} onScroll={handleScroll}>
                        {roles.map((role) => {
                            const cardTheme = getThemeByRole(role.roleType);

                            return (
                                <ThemeProvider key={role.name} theme={cardTheme}>
                                    <RoleCard>
                                        <InfoButton
                                            type="button"
                                            onClick={(e) => openInfo(role.description, e)}
                                            aria-label={`About ${role.name} role`}
                                        >
                                            i
                                        </InfoButton>

                                        <CardTitle>{role.name}</CardTitle>

                                        <EnterRoleButton onClick={() => handleRoleClick(role)}>
                                            Continue
                                        </EnterRoleButton>
                                    </RoleCard>
                                </ThemeProvider>
                            );
                        })}
                    </ScrollTrack>
                </CardCarouselContainer>

                <ThemeProvider theme={getThemeByRole(roles[roleIndex].roleType)}>
                    <InfoDialog ref={dialogRef} onClick={closeInfo}>
                        <DialogContent onClick={(e) => e.stopPropagation()}>

                            <DialogTitle>Role Details</DialogTitle>

                            <Paragraph>{infoText}</Paragraph>

                            <DialogCloseButton onClick={closeInfo}>
                                Close
                            </DialogCloseButton>

                        </DialogContent>
                    </InfoDialog>
                </ThemeProvider>

            </HomeContent>
        </Screen>
    );
}