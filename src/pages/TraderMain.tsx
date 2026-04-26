import "../styles.css";

type JWK = JsonWebKey;

type TraderPayload = {
    name: string;
    points: number;
    privateKey: JWK;
    timestamp: number;
};

export default function TraderMain() {
    const stored = localStorage.getItem("traderPayload");

    if (!stored) {
        return <div className="screen">No data</div>;
    }

    const data: TraderPayload = JSON.parse(stored);

    return (
        <div className="screen">
            <h1 className="title">{data.name}</h1>

            <div className="pointsContainer">
                <div className="circle">
                    <span className="pointsValue">{data.points}</span>
                </div>
                <p className="pointsLabel">POINTS AVAILABLE</p>
            </div>

            <button className="button">TRANSFER POINTS</button>
        </div>
    );
}