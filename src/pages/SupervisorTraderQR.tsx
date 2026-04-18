import "../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { drawQR } from "../components/drawQR";

export default function SupervisorTraderQR() {
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
                <button
                    className="button"
                    onClick={() => navigate("/supervisor/registerTrader")}
                >
                    BACK
                </button>
            </div>
        );
    }

    return (
        <div className="screen">
            <h1 className="title">SHOW CODE TO TRADER</h1>

            <div
                ref={containerRef}
                style={{ width: "100%", maxWidth: "300px", margin: "20px auto" }}
            />

            <button
                className="button"
                onClick={() => navigate("/supervisor/registerTrader")}
            >
                DONE
            </button>
        </div>
    );
}