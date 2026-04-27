import "../styles.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {generateUUID} from "../utils/cryptoutils.ts";

export default function CustomerRegistration() {
    const STORAGE_KEY = "customerName";
    const navigate = useNavigate();

    useEffect(() => {
        const customerData = localStorage.getItem(STORAGE_KEY);
        if (customerData) {
            navigate("/customer/main", { replace: true });
        }
    }, []);

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");


    function validate(): boolean {
        let valid = true;

        setNameError("");

        const trimmedName = name.trim().toLowerCase();

        if (!trimmedName) {
            setNameError("Customer name is required");
            valid = false;
        } else if (trimmedName.length > 20) {
            setNameError("Max 20 characters");
            valid = false;
        }

        return valid;
    }

    async function handleRegister() {
        if (!validate()) return;

        try {
            const payload = {
                name: name.trim(),
                uuid: generateUUID().slice(-6),
                timestamp: Date.now(),
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            navigate("/customer", { replace: true });
        } catch (error) {
            console.error(error);
            alert("Failed to register");
        }
    }

    return (
        <div className="screen">
            <h1 className="title">CUSTOMER REGISTRATION</h1>

            <input
                className="input"
                placeholder="ENTER YOUR NAME"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="error">{nameError}</p>}

            <div className="buttonContainer">
                <button className="button" onClick={handleRegister}>
                    OK
                </button>

                <button className="button" onClick={() => navigate("/", { replace: true })}>
                    BACK
                </button>
            </div>
        </div>
    );
}