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
const DELAY_TIME = 500;

export default function QrPrinter() {
    const location = useLocation();
    const navigate = useNavigate();

    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [qrError, setQrError] = useState<string | null>(null);

    const [showRawData, setShowRawData] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const qrPayload: QrPrinterProps = location.state;
    const qrData = qrPayload?.qrData || [];

    useEffect(() => {
        if (qrData.length <= 1 || showRawData) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % qrData.length);
        }, DELAY_TIME);

        return () => clearInterval(timer);
    }, [qrData.length, showRawData]);

    useEffect(() => {
        if (!qrData || qrData.length === 0) return;

        const currentData = qrData[currentIndex];

        generateQrSvg({
            data: JSON.stringify(currentData),
            qrVersion: QR_VERSION,
            errorCorrectionLevel: QR_CORRECTION,
        })
            .then((svg) => {
                setQrSvg(svg);
                setQrError(null);
            })
            .catch((error) => {
                console.error("QR generation failed:", error);
                setQrError("Failed to generate QR code");
            });
    }, [qrData, currentIndex]);

    if (!qrPayload || qrData.length === 0) {
        return (
            <Screen>
                <Title>NO DATA</Title>
                <Button onClick={() => navigate(-1)}>
                    BACK
                </Button>
            </Screen>
        );
    }

    const currentRawDataString = JSON.stringify(qrData[currentIndex]);

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

            {qrData.length > 1 && (
                <Paragraph>
                    Code {currentIndex + 1} of {qrData.length}
                </Paragraph>
            )}

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