import "../styles.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

type CustomerEntry = {
    name: string;
    uuid: string;
    timestamp: number;
}

export default function CustomerMain() {
    const CUSTOMER_KEY = "customerName";
    const POINTS_KEY = "customerTransactions";
    const navigate = useNavigate();

    const [name, setName] = useState("CUSTOMER#000000");
    const [points, setPoints] = useState("0");

    useEffect(() => {
        const storedCustomerData = localStorage.getItem(CUSTOMER_KEY);
        if (storedCustomerData) {
            const customerData: CustomerEntry = JSON.parse(storedCustomerData);
            setName(`${customerData.name.toUpperCase()}#${customerData.uuid}`);
        }
        else {
            navigate("/customer/register", { replace: true });
        }

        const storedCustomerPoints = localStorage.getItem(POINTS_KEY);
        if (storedCustomerPoints) {
            // WIP - need to make transactions
            const customerPoints = JSON.parse(storedCustomerPoints);
            setPoints(customerPoints.points)
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
                <button className="button" onClick={() => navigate("/customer/scan")}>
                    SCAN TRANSACTION
                </button>

                <button className="button">
                    CASHOUT POINTS
                </button>
            </div>
        </div>
    );
}

