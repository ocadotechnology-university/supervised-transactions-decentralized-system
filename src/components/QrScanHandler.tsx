import {useEffect, useRef, useState} from 'react';
import { useNavigate } from "react-router-dom";
import QrScanner from 'qr-scanner';
import {Button, ButtonContainer, ErrorText, Input, Paragraph, Screen, Title} from "../styles/common.styles.ts";
import { Video, VideoContainer, ScannerWrapper } from "../styles/QrScanHandler.styles.ts";

type QrScanProps = {
    scanSuccess: (result: string) => void;
}

const QrScan = ({ scanSuccess }: QrScanProps)=> {
    const scannerRef = useRef<QrScanner | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [qrError, setQrError] = useState("");

    useEffect(() => {
        if (!videoRef.current) return;

        if (!scannerRef.current) {
            scannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    scanSuccess(result.data);
                },
                {
                    preferredCamera: "environment",
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    returnDetailedScanResult: true,
                }
            );

            scannerRef.current.start().catch((error) => {
                console.error("Error while starting camera:", error);
                setQrError("Failed to start QR scanner. Please check your browser camera permissions.");
            });
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop();
                scannerRef.current.destroy();
                scannerRef.current = null;
            }
        };
    }, []);

    if (qrError) {
        return (
            <ErrorText>{qrError}</ErrorText>
        )
    }

    return (
        <VideoContainer>
            <Video
                ref={videoRef}
            />
        </VideoContainer>
    );
}

type QrScanHandlerProps = {
    title: string;
    subtitle?: string;
    scanSuccessHandler: (result: string) => void;
}

type InputMode = "menu" | "camera" | "manual";

export default function QrScanHandler({ title, subtitle, scanSuccessHandler }: QrScanHandlerProps) {
    const navigate = useNavigate();

    const [mode, setMode] = useState<InputMode>("menu");
    const [manualInput, setManualInput] = useState("");

    return (
        <Screen>
            <Title>{ title }</Title>

            {subtitle && (
                <Paragraph>{subtitle}</Paragraph>
            )}

            {mode === "menu" && (
                <ButtonContainer>
                    <Button onClick={() => setMode("camera")}>
                        SCAN
                    </Button>
                    <Button onClick={() => setMode("manual")}>
                        MANUAL
                    </Button>
                    <Button onClick={() => navigate(-1)}>
                        BACK
                    </Button>
                </ButtonContainer>
            )}

            {mode === "camera" && (
                <>
                    <ScannerWrapper>
                        <QrScan scanSuccess={ scanSuccessHandler } />
                    </ScannerWrapper>

                    <ButtonContainer>
                        <Button onClick={() => setMode("menu")}>
                            CANCEL
                        </Button>
                    </ButtonContainer>
                </>
            )}

            {mode === "manual" && (
                <>
                    <Input
                        placeholder="RAW QR DATA"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                    />

                    <ButtonContainer>
                        <Button onClick={() => scanSuccessHandler(manualInput)}>
                            OK
                        </Button>
                        <Button onClick={() => setMode("menu")}>
                            CANCEL
                        </Button>
                    </ButtonContainer>
                </>
            )}
        </Screen>
    );
}