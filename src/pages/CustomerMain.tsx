import "../styles.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

type CustomerEntry = {
    name: string;
    uuid: string;
    timestamp: number;
}

type Transaction = {
    name: string;
    points: number;
    uuid: string;
    timestamp: number;
    signature: string;
}

export default function CustomerMain() {
    const CUSTOMER_KEY = "customerData";
    const POINTS_KEY = "customerTransactions";
    const navigate = useNavigate();

    const [name, setName] = useState("CUSTOMER#000000");
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const storedCustomerData = localStorage.getItem(CUSTOMER_KEY);
        if (storedCustomerData) {
            const customerData: CustomerEntry = JSON.parse(storedCustomerData);
            setName(`${customerData.name}#${customerData.uuid}`);
        }
        else {
            navigate("/customer/register", { replace: true });
            return;
        }

        const storedCustomerPoints = localStorage.getItem(POINTS_KEY);
        if (storedCustomerPoints) {
            const storedTransactions: Transaction[] = JSON.parse(storedCustomerPoints);
            const customerPoints = storedTransactions.reduce((accumulator, transaction) => {
                return accumulator + transaction.points;
            }, 0);
            setPoints(customerPoints)
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

                <button className="button" onClick={() => navigate("/customer/cashout")}>
                    CASHOUT POINTS
                </button>
            </div>
        </div>
    );
}

