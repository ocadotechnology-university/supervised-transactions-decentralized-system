import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="screen">
            <h1 className="title">WHO ARE YOU</h1>

            <div className="buttonContainer">
                <button className="button">
                    CUSTOMER
                </button>
                <button className="button">
                    TRADER
                </button>
                <button className="button" onClick={() => navigate("/supervisor")}>
                    SUPERVISOR
                </button>
            </div>
        </div>
    );
}