import styled from "styled-components";

export const PointsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60px;
`;

export const Circle = styled.div`
    width: 180px;
    height: 180px;
    background-color: #b3b3b3;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
`;

export const PointsValue = styled.span`
    font-size: 64px;
    font-weight: bold;
    color: white;
`;

export const PointsLabel = styled.h2`
    font-size: 32px;
    font-weight: bold;
    color: #111;
    margin: 0;
    letter-spacing: 2px;
`;

export const PointsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
    max-width: 320px;
    margin-top: 40px;
`;