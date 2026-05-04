import {useEffect, useState} from "react";
import {generateQrSvg} from "../utils/generateQr.ts";
import {QRContainer} from "../styles.ts";

interface GenerateQRProps {
    data: unknown; // accepts any payload
}

const QR_VERSION = 14;
const QR_CORRECTION = "L";

export default function GenerateQR({ data }: GenerateQRProps) {
    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);

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

    return (
        <QRContainer>
            {qrError ? (
                <p>{qrError}</p>
            ) : qrSvg ? (
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
            ) : (
                <p>Generating...</p>
            )}
        </QRContainer>
    );
}