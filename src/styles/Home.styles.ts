import styled from "styled-components";
import { Button } from "./common.styles.ts";

export const HomeContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 5vh;
`;

export const CardCarouselContainer = styled.div`
    width: 100%;
    max-width: 360px;
    position: relative;
    padding: 20px 0;
`;

export const ScrollTrack = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: 24px 40px;

    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export const RoleCard = styled.div`
    flex: 0 0 100%; 
    scroll-snap-align: center;
    scroll-snap-stop: always;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background: ${({ theme }) => theme.colors.buttonBackground}15;
    border: 2px solid ${({ theme }) => theme.colors.buttonBackground};
    border-radius: 16px;
    padding: 32px 24px;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 8px 24px rgba(0,0,0,0.05);
`;

export const InfoButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.text};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-family: 'Balsamiq Sans', cursive;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;

    &:hover {
        opacity: 1;
        transform: scale(1.05);
    }
`;

export const EnterRoleButton = styled(Button)`
    width: 100%;
    max-width: 200px;
    height: 50px;
    padding: 0;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.buttonBackground}40;
`;

export const InfoDialog = styled.dialog`
    border: none;
    border-radius: 16px;
    padding: 24px;
    max-width: 300px;
    width: 90%;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Balsamiq Sans', cursive;
    box-shadow: 0 12px 36px rgba(0,0,0,0.25);
    text-align: center;

    &::backdrop {
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
    }
`;