import {useEffect, useRef, useState} from 'react';
import { useNavigate } from "react-router-dom";
import QrScanner from 'qr-scanner';
import { Button, ButtonContainer, ErrorText, Screen, Title } from "../styles.ts";
import { Video, VideoContainer, ScannerWrapper } from "../styles/QrScanHandler.styles.ts";

const QrScan = ({ scanSuccess }: { scanSuccess: (result: string) => void })=> {
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

type QrScanProps = {
    title: string;
    scanSuccessHandler: (result: string) => void;
}

export default function QrScanHandler({ title, scanSuccessHandler }: QrScanProps) {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState<boolean>(false);

    return (
        <Screen>
            <Title>{ title }</Title>

            {!isScanning ? (
                <ButtonContainer>
                    <Button onClick={() => setIsScanning(true)}>
                        SCAN
                    </Button>
                    <Button onClick={() => navigate(-1)}>
                        BACK
                    </Button>
                </ButtonContainer>
            ) : (
                <>
                    <ScannerWrapper>
                        <QrScan scanSuccess={ scanSuccessHandler } />
                    </ScannerWrapper>

                    <ButtonContainer>
                        <Button onClick={() => {navigate(-1);}}>
                            BACK
                        </Button>
                    </ButtonContainer>
                </>
            )}
        </Screen>
    );
}

