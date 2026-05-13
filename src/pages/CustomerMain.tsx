import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, CustomerEntry } from "../utils/types.ts";
import { Screen, Title, ButtonContainer, Button, PointsContainer, Circle, PointsValue, PointsLabel } from "../styles/common.styles.ts";

const CUSTOMER_KEY = "customerData";
const POINTS_KEY = "customerTransactions";

export default function CustomerMain() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const storedCustomerData = localStorage.getItem(CUSTOMER_KEY);
        if (storedCustomerData) {
            const customerData: CustomerEntry = JSON.parse(storedCustomerData);
            setName(`${customerData.name}#${customerData.id}`);
        }

        const storedCustomerPoints = localStorage.getItem(POINTS_KEY);
        if (storedCustomerPoints) {
            const storedTransactions: Transaction[] = JSON.parse(storedCustomerPoints);
            const customerPoints = storedTransactions.reduce((accumulator, transaction) => {
                return accumulator + transaction.points;
            }, 0);
            setPoints(customerPoints);
        }
    }, []);

    if (!name) {
        return null;
    }

    return (
        <Screen>
            <Title>{name}</Title>

            <PointsContainer>
                <Circle>
                    <PointsValue>{points}</PointsValue>
                </Circle>
                <PointsLabel>POINTS</PointsLabel>
            </PointsContainer>

            <ButtonContainer>
                <Button onClick={() => navigate("/customer/scan")}>
                    SCAN TRANSACTION
                </Button>

                <Button >
                    CASHOUT POINTS
                </Button>
            </ButtonContainer>
        </Screen>
    );
}
