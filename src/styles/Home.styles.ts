import styled from "styled-components";
import {Button} from "./common.styles.ts";

export const HomeContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20vh;
`;

export const RoleSelectorContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 320px;
    gap: 15px;
`;

export const ArrowButton = styled(Button)`
    width: 55px;
    height: 55px;
    padding: 0; 
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 20px;
`;

export const RoleButton = styled(Button)`
    flex: 1;
    height: 55px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;