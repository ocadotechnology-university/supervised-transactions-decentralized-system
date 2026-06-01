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
    background-color: ${({ theme }) => theme.colors.buttonBackground};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
`;

export const PointsValue = styled.span`
    font-size: 64px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.buttonText};
    text-shadow: 
            -1px -1px 0 ${({ theme }) => theme.colors.buttonBackground},
            1px -1px 0 ${({ theme }) => theme.colors.buttonBackground},
            -1px 1px 0 ${({ theme }) => theme.colors.buttonBackground},
            1px 1px 0 ${({ theme }) => theme.colors.buttonBackground};
`;

export const PointsLabel = styled.h2`
    font-size: 32px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
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