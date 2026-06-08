import styled from "styled-components";
import { Link } from "react-router-dom";

export const BreadcrumbWrapper = styled.nav`
    width: 100%;
    box-sizing: border-box;
    padding: 10px 24px;

    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 10px;

    background: ${({ theme }) => theme.colors.background};
    font-family: 'Balsamiq Sans', cursive;

    position: sticky;
    top: 0;
    z-index: 100;

    overflow-x: auto;
    overflow-y: hidden;
    
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
    
`;

export const BreadcrumbItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    white-space: nowrap;
`;

export const BreadcrumbLink = styled(Link)`
    color: ${({ theme }) => theme.colors.buttonBackground || theme.colors.text};
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    transition: opacity 0.2s ease-in-out;

    &:hover {
        opacity: 0.75;
        text-decoration: underline;
    }
    
    &:focus {
        outline: 2px dashed ${({ theme }) => theme.colors.text};
        outline-offset: 4px;
    }

    &:active {
        opacity: 0.9;
    }
`;

export const BreadcrumbCurrent = styled.span`
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
    font-weight: 700;
    opacity: 0.85;
`;

export const Separator = styled.span`
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.45;
    font-size: 18px;
    user-select: none;
`;