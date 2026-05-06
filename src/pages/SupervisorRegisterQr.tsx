import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateQrSvg } from "../utils/generateQr.ts";
import { Screen, Title, Button, QRContainer } from "../styles.ts";

const QR_VERSION = 14;
const QR_CORRECTION = "L";

export default function SupervisorRegisterQr() {
    const location = useLocation();
    const navigate = useNavigate();

    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);

    const data = location.state;

    useEffect(() => {
        if (!data) {
            return;
        }

        generateQrSvg({
            data: JSON.stringify(data),
            qrVersion: QR_VERSION,
            errorCorrectionLevel: QR_CORRECTION,
        })
            .then(setQrSvg)
            .catch((error) => {
                console.error("QR generation failed:", error);
                setQrError("Failed to generate QR code");
            });
    }, [data]);

    if (!data) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <Button onClick={() => navigate("/supervisor/register")}>
                    BACK
                </Button>
            </Screen>
        );
    }

    return (
        <Screen>
            <Title>SHOW CODE TO TRADER</Title>

            <QRContainer>
                {qrError ? (
                    <p>{qrError}</p>
                ) : qrSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                ) : (
                    <p>Generating...</p>
                )}
            </QRContainer>

            <Button onClick={() => navigate("/supervisor/register", { replace: true })}>
                DONE
            </Button>
        </Screen>
    );
}