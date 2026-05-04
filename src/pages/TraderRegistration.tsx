import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ScanQR from "../components/ScanQR";
import { Button, ButtonContainer, ScannerWrapper, Screen, Title } from "../styles.ts";


export default function TraderRegistration() {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScanSuccess = useCallback(
        (decodedString: string) => {
            try {
                const data = JSON.parse(decodedString);

                const isValid =
                    typeof data.name === "string" &&
                    typeof data.points === "number" &&
                    typeof data.timestamp === "number" &&
                    !!data.key;

                if (!isValid) {
                    console.error("Invalid data structure");
                    return;
                }

                localStorage.setItem("traderData", decodedString);

                setIsScanning(false);
                navigate("/trader", { replace: true });
            } catch (e) {
                console.error("Invalid QR payload", e);
            }
        },
        []
    );

    return (
        <Screen>
            <Title>SCAN SUPERVISOR CODE</Title>

            {!isScanning ? (
                <ButtonContainer>
                    <Button onClick={() => setIsScanning(true)}>
                        SCAN
                    </Button>

                    <Button onClick={() => navigate("/", { replace: true })}>
                        BACK
                    </Button>
                </ButtonContainer>
            ) : (
                <>
                    <ScannerWrapper>
                        <ScanQR scanSuccess={handleScanSuccess} />
                    </ScannerWrapper>

                    <ButtonContainer>
                        <Button
                            onClick={() => {
                                setIsScanning(false);
                                navigate("/", { replace: true });
                            }}
                        >
                            BACK
                        </Button>
                    </ButtonContainer>
                </>
            )}
        </Screen>
    );
}