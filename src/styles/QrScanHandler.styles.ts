import styled from "styled-components";

export const VideoContainer = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
`;

export const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

export const ScannerWrapper = styled.div`
    width: 100%;
    max-width: 320px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
`;