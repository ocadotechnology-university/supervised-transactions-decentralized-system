import styled from "styled-components";

export const QrContainer = styled.div`
    width: 100%;
    max-width: 300px;
    margin: 20px auto;
    min-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    border-radius: 16px;
    padding: 5px;
    box-sizing: border-box;
`;

export const QrSvgWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    svg {
        width: 100%;
        height: auto;
        display: block;
    }
`;
