import styled from "styled-components";

export const FooterWrapper = styled.footer`
    width: 100%;
    box-sizing: border-box;
    padding: 16px 24px;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;

    background: ${({ theme }) => theme.colors.background};
    font-family: 'Balsamiq Sans', cursive;
    color: ${({ theme }) => theme.colors.text};
    border-top: 1px solid ${({ theme }) => theme.colors.inputBorder || "rgba(0,0,0,0.1)"};
`;

export const FooterLink = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.buttonBackground || theme.colors.text};
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;

    &:hover {
        transform: scale(1.1);
        opacity: 0.8;
    }

    &:focus {
        outline: 2px dashed ${({ theme }) => theme.colors.text};
        outline-offset: 4px;
    }
`;

export const FooterText = styled.span`
    font-size: 14px;
    margin-right: 8px;
`;