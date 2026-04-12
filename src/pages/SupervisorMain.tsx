import "../styles.css";

export default function SupervisorMain() {
    return (
        <div className="screen">
            <h1 className="title">CHOOSE ACTION</h1>

            <div className="buttonContainer">
                <button className="button">SHOW THE RANKING</button>
                <button className="button">REGISTER A TRADER</button>
                <button className="button">VERIFY POINTS</button>
            </div>
        </div>
    );
}
