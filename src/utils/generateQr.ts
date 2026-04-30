import { toString, type QRCodeErrorCorrectionLevel } from "qrcode";

type QrGeneratorPayload = {
    data: string;
    qrVersion: number;
    errorCorrectionLevel: QRCodeErrorCorrectionLevel;
};

export async function generateQrSvg({data, qrVersion, errorCorrectionLevel}: QrGeneratorPayload): Promise<string> {
    const options = {
        version: qrVersion,
        errorCorrectionLevel,
        type: "svg" as const,
        margin: 1,
    };

    return await toString(data, options);
}