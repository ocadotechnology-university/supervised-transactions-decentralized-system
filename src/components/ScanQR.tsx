import { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';

interface ScanQRProps {
    scanSuccess: (result: string) => void;
}

export default function ScanQR ({ scanSuccess }: ScanQRProps) {

    const scannerRef = useRef<QrScanner | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

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
            });
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop();
                scannerRef.current.destroy();
                scannerRef.current = null;
            }
        };
    }, [scanSuccess]);

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <video
                ref={videoRef}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
        </div>
    );
};

