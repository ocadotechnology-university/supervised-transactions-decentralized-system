import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type { TraderEntry } from "../utils/types.ts";
import { Button, ButtonContainer, Screen, Title } from "../styles/common.styles.ts";
import { Circle, PointsContainer, PointsLabel, PointsValue } from "../styles/points.styles.ts";

const TRADER_KEY = "traderData";

export default function TraderMain() {
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