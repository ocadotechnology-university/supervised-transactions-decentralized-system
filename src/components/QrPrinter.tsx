import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateQrSvg} from "../utils/generateQr.ts";
import {Button, ButtonContainer, ErrorText, Paragraph, Screen, Title} from "../styles/common.styles.ts";
import { QrContainer, QrSvgWrapper } from "../styles/QrPrinter.styles.ts";

type QrPrinterProps = {
    title: string;
    qrData: unknown;
};

const QR_VERSION = 14;
const QR_CORRECTION = "L";

export default function QrPrinter() {
    const location = useLocation();
    const navigate = useNavigate();

    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);

    const [showRawData, setShowRawData] = useState<boolean>(false);

    const qrPayload: QrPrinterProps = location.state;

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

    const rawDataString = JSON.stringify(qrPayload.qrData);

    const renderQrContent = () => {
        if (showRawData) {
            return <Paragraph style={{ wordBreak: "break-all", userSelect: "all" }}>
                {rawDataString}
            </Paragraph>;
        }
        if (qrError) {
            return <ErrorText>{ qrError }</ErrorText>;
        }
        if (qrSvg) {
            return <QrSvgWrapper dangerouslySetInnerHTML={{ __html: qrSvg }} />;
        }
        return <Paragraph>Generating...</Paragraph>;
    };

    return (
        <Screen>
            <Title>{ qrPayload.title }</Title>

            <QrContainer>
                { renderQrContent() }
            </QrContainer>

            <ButtonContainer>
                <Button onClick={() => setShowRawData(!showRawData)}>
                    {showRawData ? "SHOW QR CODE" : "SHOW RAW DATA"}
                </Button>

                <Button onClick={() => navigate(-1)}>
                    DONE
                </Button>
            </ButtonContainer>
        </Screen>
    );
}