import "../styles.css";
import { drawQR } from "../drawQR";
import { generateEd25519KeyPair, exportKey } from "../cryptography.ts";
import { useEffect, useRef } from "react";

async function jwkPubKey() {
    // Generating public key to export with QR code
    const keys = await generateEd25519KeyPair();
    if (keys) {
        return await exportKey(keys.publicKey);
    }
}

export default function RegisterTrader(){
    
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function displayToken(){
            // Displaying QR code to canvas);
        
            const jwk = await jwkPubKey();
        
            // data has to be in string to proper show QR code
            const data = JSON.stringify(jwk);
            const QRversion = 10;
            const errorCorrectionLevel = "L";
        
            if(containerRef.current){
                const QRcode = await drawQR({data, QRversion, errorCorrectionLevel});
        
                containerRef.current.innerHTML = '';

                containerRef.current.appendChild(QRcode);
            }
        }

        displayToken();
    }, [])

    return(
        <div className="screen">
            <h1> SCAN CODE QR</h1>
            <h1>TO REGISTER A TRADER</h1>
            <div ref={containerRef}></div>
        </div>
    );
}