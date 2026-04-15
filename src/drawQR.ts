import { toCanvas, type QRCodeErrorCorrectionLevel } from "qrcode";

interface drawQRProps {
    data: JSON,
    QRversion: number,
    errorCorrectionLevel: QRCodeErrorCorrectionLevel
}

export async function drawQR({data, QRversion, errorCorrectionLevel = "L"}: drawQRProps): Promise<HTMLCanvasElement>{
    /* 
    Function gets canvas from html div and creates QR code
    */
    const canvas = document.createElement("canvas")

    var options = {
        version: QRversion,
        errorCorrectionLevel: errorCorrectionLevel,
    };

    // to generate QR code function needs data as string
    var stringData = JSON.stringify(data)

    try{
        await toCanvas(canvas, stringData, options);
        return canvas;

    } catch (error){
        console.error("Error while creating QR code: ", error);
        throw error;
    }
}