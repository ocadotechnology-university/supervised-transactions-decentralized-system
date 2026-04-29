import "../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import {useEffect} from "react";

export default function CustomerScanResults() {
    const navigate = useNavigate();

    useEffect(() => {
        const STORAGE_KEY = "customerData";
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            navigate("/customer/register", { replace: true });
            return;
        }
    }, []);

    const location = useLocation();
    const data = location.state;

    if (!data) {
        return (
            <div className="screen">
                <h1 className="title">NO DATA</h1>
                <div className="buttonContainer">
                    <button className="button" onClick={() => navigate("/customer", { replace: true })}>
                        BACK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen">
            {data.success ? (
                <>
                    <h1 className="title">YOU GOT</h1>

                    <div className="pointsContainer">
                        <div className="circle">
                            <span className="pointsValue">{data.transactionPoints}</span>
                        </div>
                        <h2 className="pointsLabel">POINTS</h2>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="title">TRANSACTION FAILED</h1>
                    {data.duplicate && (
                        <h1 className="title">DUPLICATE DETECTED</h1>
                    )}
                </>
            )}

            <div className="buttonContainer">
                <button className="button" onClick={() => navigate("/customer/scan", { replace: true })}>
                    SCAN AGAIN
                </button>

                <button className="button" onClick={() => navigate("/customer", { replace: true })}>
                    BACK
                </button>
            </div>
        </div>
    );
}

