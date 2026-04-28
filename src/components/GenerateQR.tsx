import { useEffect, useRef } from "react";
import { drawQR } from "../utils/drawQR";

interface GenerateQRProps {
    data: unknown; // accepts any payload
}

export default function GenerateQR({ data }: GenerateQRProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function generateQR() {
            if (!data) return;

            const qrData = JSON.stringify(data);

            const canvas = await drawQR({
                data: qrData,
                QRversion: 14,
                errorCorrectionLevel: "L",
            });

            if (containerRef.current) {
                containerRef.current.innerHTML = "";
                containerRef.current.appendChild(canvas);
            }
        }

        generateQR();
    }, [data]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", maxWidth: "300px", margin: "20px auto" }}
        />
    );
}