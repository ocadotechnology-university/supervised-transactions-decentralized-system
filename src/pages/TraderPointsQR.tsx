import "../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { drawQR } from "../utils/drawQR";

export default function TraderPointsQR() {
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const data = location.state;

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

    if (!data) {
        return (
            <div className="screen">
                <h1 className="title">NO DATA</h1>
                <div className="buttonContainer">
                    <button
                        className="button"
                        onClick={() => navigate("/trader/main", { replace: true })}
                    >
                        BACK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen">
            <h1 className="title">SHOW QR TO SUPERVISOR</h1>

            <div
                ref={containerRef}
                style={{ width: "100%", maxWidth: "300px", margin: "20px auto" }}
            />

            <div className="buttonContainer">
                <button
                    className="button"
                    onClick={() => navigate("/trader/main", { replace: true })}
                >
                    DONE
                </button>
            </div>
        </div>
    );
}