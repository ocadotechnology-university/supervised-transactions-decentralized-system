import styled from "styled-components";

export const LeaderboardContainer = styled.div`
    width: 100%;
    max-width: 320px;
    padding-bottom: 20px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const LeaderboardList = styled.ol`
    padding-left: 0;
    margin: 0;
    width: 100%;
    list-style-position: inside;
    text-align: center;
`;

export const LeaderboardItem = styled.li`
    margin: 10px 0;
    font-size: 1.2rem;
    font-family: 'Balsamiq Sans', cursive;
`;

export const LeaderboardPoints = styled.span`
    margin-left: 15px;
    color: black;
    font-weight: bold;
`;