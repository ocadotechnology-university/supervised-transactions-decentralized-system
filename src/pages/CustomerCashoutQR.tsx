import "../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import GenerateQR from "../components/GenerateQR";

export default function CustomerCashoutQR() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <div className="screen">
                <h1 className="title">NO DATA</h1>
                <div className="buttonContainer">
                    <button
                        className="button"
                        onClick={() => navigate("/customer", { replace: true })}
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

            <GenerateQR data={data} />

            <div className="buttonContainer">
                <button
                    className="button"
                    onClick={() => navigate("/customer/cashout", { replace: true })}
                >
                    CASHOUT AGAIN
                </button>

                <button
                    className="button"
                    onClick={() => navigate("/customer", { replace: true })}
                >
                    DONE
                </button>
            </div>
        </div>
    );
}