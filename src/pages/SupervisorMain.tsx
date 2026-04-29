import "../styles.css";
import { useNavigate } from "react-router-dom";

export default function SupervisorMain() {
    const navigate = useNavigate();

    return (
        <div className="screen">
            <h1 className="title">CHOOSE ACTION</h1>

            <div className="buttonContainer">
            <   button className="button" onClick={() => navigate("/supervisor/ranking")}>
                    SHOW THE RANKING
                </button>
                <button className="button" onClick={() => navigate("/supervisor/registerTrader")}>
                    REGISTER A TRADER
                </button>

                <button className="button" onClick={() => navigate("/supervisor/verify")}>
                    VERIFY POINTS
                </button>
            </div>
        </div>
    );
}
