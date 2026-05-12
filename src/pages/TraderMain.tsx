import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type { TraderEntry } from "../utils/types.ts";
import { Button, ButtonContainer, Circle, PointsContainer, PointsLabel, PointsValue, Screen, Title } from "../styles/common.styles.ts";

export default function TraderMain() {
    const TRADER_KEY = "traderData";
    const navigate = useNavigate();

    const [name, setName] = useState("");
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
            return;
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
                <Button onClick={() => navigate("/trader/points")}>
                    TRANSFER POINTS
                </Button>
            </ButtonContainer>
        </Screen>
    );
}