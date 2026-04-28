import "../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import GenerateQR from "../components/GenerateQR";

export default function SupervisorTraderQR() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <div className="screen">
                <h1 className="title">NO DATA</h1>
                <div className="buttonContainer">
                    <button className="button" onClick={() => navigate("/supervisor", { replace: true })}>
                        BACK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen">
            <h1 className="title">SHOW CODE TO TRADER</h1>

            <GenerateQR data={data} />

            <div className="buttonContainer">
                <button className="button" onClick={() => navigate("/supervisor/registerTrader", { replace: true })}>
                    DONE
                </button>
            </div>
        </div>
    );
}