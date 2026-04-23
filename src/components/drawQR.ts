import { toCanvas, type QRCodeErrorCorrectionLevel } from "qrcode";

interface drawQRProps {
    data: string,
    QRversion: number,
    errorCorrectionLevel: QRCodeErrorCorrectionLevel
}

export async function drawQR({data, QRversion, errorCorrectionLevel}: drawQRProps): Promise<HTMLCanvasElement>{

    const canvas = document.createElement("canvas")

    canvas.style.maxWidth = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";

    const options = {
        version: QRversion,
        errorCorrectionLevel: errorCorrectionLevel,
    };

    try{
        await toCanvas(canvas, data, options);
        return canvas;

    } catch (error){
        console.error("Error while creating QR code: ", error);
        throw error;
    }
}