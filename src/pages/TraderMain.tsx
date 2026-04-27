import "../styles.css";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

type TraderEntry = {
    name: string;
    points: number;
    privateKey: JsonWebKey;
    timestamp: number;
};

export default function TraderMain() {
    const TRADER_KEY = "traderData";
    const navigate = useNavigate();

    const [name, setName] = useState("TRADER");
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const storedTraderData = localStorage.getItem(TRADER_KEY);
        if (storedTraderData) {
            const traderData: TraderEntry = JSON.parse(storedTraderData);
            setName(traderData.name.toUpperCase());
            setPoints(traderData.points)
        }
        else {
            navigate("/trader/register", { replace: true });
        }
    }, []);

    return (
        <div className="screen">
            <h1 className="title">{name}</h1>

            <div className="pointsContainer">
                <div className="circle">
                    <span className="pointsValue">{points}</span>
                </div>
                <h2 className="pointsLabel">POINTS</h2>
            </div>

            <div className="buttonContainer">
                <button className="button">
                    TRANSFER POINTS
                </button>
            </div>
        </div>
    );
}