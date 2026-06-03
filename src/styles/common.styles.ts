import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html, body, #root {
        margin: 0;
        scroll-padding-top: 70px;
        scroll-behavior: smooth;
    }
`;

export const Screen = styled.div`
    min-height: 100vh;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Balsamiq Sans', cursive;
    padding: 20px;
    box-sizing: border-box;
`;

export const Title = styled.h1`
    width: 100%;
    text-align: center;
    word-wrap: break-word;
    overflow-wrap: break-word;
    color: ${({ theme }) => theme.colors.text};
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;
    max-width: 320px;
`;

export const Button = styled.button`
    background-color: ${({ theme }) => theme.colors.buttonBackground};
    color: ${({ theme }) => theme.colors.buttonText};
    padding: 18px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    letter-spacing: 1px;
    font-family: 'Balsamiq Sans', cursive;
    cursor: pointer;
`;

export const Input = styled.input`
    width: 100%;
    max-width: 320px;
    padding: 16px;
    margin-bottom: 30px;
    border-radius: 25px;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    text-align: center;
    font-size: 16px;
    font-family: 'Balsamiq Sans', cursive;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
`;

export const ErrorText = styled.p`
    color: ${({ theme }) => theme.colors.error};
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: center;
`;

export const Paragraph = styled.p`
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: center;
    color: ${({ theme }) => theme.colors.text};
`;