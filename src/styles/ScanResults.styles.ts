import styled from "styled-components";

export const ErrorLogContainer = styled.div`
    margin-bottom: 20px;
    width: 100%;
    max-width: 320px;
`;

export const ErrorLogTitle = styled.h3`
    color: red;
    text-align: center;
    margin-bottom: 10px;
`;

export const ErrorList = styled.ul`
    color: #f88686;
    text-align: left;
    font-size: 14px;
    padding-left: 20px;
    padding-right: 6px;
    margin: 0;
    max-height: 160px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.inputBorder || "rgba(0,0,0,0.2)"};
        border-radius: 4px;
    }
`;

export const ErrorListItem = styled.li`
    margin-bottom: 5px;
`;