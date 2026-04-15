import { toCanvas } from "qrcode";

interface drawQRProps {
    data: string,
    QRversion: number,
    errorCorrectionLevel: string
}

export async function drawQR({data, QRversion, errorCorrectionLevel}: drawQRProps): Promise<HTMLCanvasElement>{
    /* 
    Function gets canvas from html div and creates QR code
    */
    const canvas = document.createElement("canvas")

    var options = {
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