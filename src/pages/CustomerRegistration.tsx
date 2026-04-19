import "../styles.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {generateUUID} from "../components/cryptoutils.ts";

export default function CustomerRegistration() {
    const [name, setName] = useState("");

    const [nameError, setNameError] = useState("");

    const navigate = useNavigate();

    function validate(): boolean {
        let valid = true;

        // reset errors
        setNameError("");

        // sanitize name (trim + basic cleanup)
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
            // store customer name, uuid and timestamp in localStorage
            const STORAGE_KEY = "customerName";

            const payload = {
                name: name.trim(),
                uuid: generateUUID(),
                timestamp: Date.now(),
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            sessionStorage.setItem("isCustomer", "true");
            navigate("/customer/main");
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
                <button className="button" onClick={handleRegister} disabled={!name.trim()}>
                    OK
                </button>

                <button
                    className="button"
                    onClick={() => navigate("/")}
                >
                    BACK
                </button>
            </div>
        </div>
    );
}