import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html, body, #root {
        height: 100%;
        margin: 0;
    }
`;

export const Screen = styled.div`
    min-height: 100vh;
    width: 100%;
    background-color: #eaeaea;
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
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;
    max-width: 320px;
`;

export const Button = styled.button`
    background-color: #111;
    color: white;
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
    border: 1px solid #ccc;
    text-align: center;
    font-size: 16px;
    font-family: 'Balsamiq Sans', cursive;
    background: transparent;
`;

export const ErrorText = styled.p`
    color: red;
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
`;