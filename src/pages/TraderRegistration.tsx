import { useState } from 'react';
import ScanQR from "../components/ScanQR.tsx";

export default function TraderRegistration () {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);

    const handleScanSuccess = (decodedString: string) => {
        setScanResult(decodedString);
        setIsScanning(false);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>qr scanner</h1>

            {scanResult && (
                <div style={{ padding: '10px', backgroundColor: '#e0f7fa', marginBottom: '20px' }}>
                    <strong>Scanned data:</strong> {scanResult}
                </div>
            )}

            {isScanning ? (
                <div>
                    <button onClick={() => setIsScanning(false)} style={{ marginBottom: '10px' }}>
                        Cancel Scan
                    </button>
                    <ScanQR scanSuccess={handleScanSuccess} />
                </div>
            ) : (
                <button onClick={() => setIsScanning(true)}>Scan a QR Code</button>
            )}
        </div>
    );
};

