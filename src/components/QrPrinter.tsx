import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateQrSvg} from "../utils/generateQr.ts";
import { Button, ErrorText, Paragraph, Screen, Title } from "../styles/common.styles.ts";
import { QrContainer, QrSvgWrapper } from "../styles/QrPrinter.styles.ts";

const QR_VERSION = 14;
const QR_CORRECTION = "L";

export default function QrPrinter() {
    const location = useLocation();
    const navigate = useNavigate();

    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);

    const qrPayload = location.state;

    useEffect(() => {
        if (!qrPayload) {
            return;
        }

        generateQrSvg({
            data: JSON.stringify(qrPayload.qrData),
            qrVersion: QR_VERSION,
            errorCorrectionLevel: QR_CORRECTION,
        })
            .then(setQrSvg)
            .catch((error) => {
                console.error("QR generation failed:", error);
                setQrError("Failed to generate QR code");
            });
    }, [qrPayload]);

    if (!qrPayload) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <Button onClick={() => navigate(-1)}>
                    BACK
                </Button>
            </Screen>
        );
    }

    return (
        <Screen>
            <Title>{ qrPayload.title }</Title>

            <QrContainer>
                {qrError ? (
                    <ErrorText>{ qrError }</ErrorText>
                ) : qrSvg ? (
                    <QrSvgWrapper dangerouslySetInnerHTML={{ __html: qrSvg }} />
                ) : (
                    <Paragraph>Generating...</Paragraph>
                )}
            </QrContainer>

            <Button onClick={() => navigate(-1)}>
                DONE
            </Button>
        </Screen>
    );
}