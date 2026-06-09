import QrScanHandler from "./QrScanHandler";
import { Button } from "../styles/common.styles.ts";

type SequenceScannerLayoutProps = {
    title: string;
    expectedQrCount: number | null;
    scannedQrCount: number;
    pendingQrCount: number;
    successfulCount: number;
    onScanSuccess: (data: string) => void;
    onFinalizeEarly: () => void;
}

export default function SequenceScannerLayout({ title, expectedQrCount, scannedQrCount, pendingQrCount, successfulCount, onScanSuccess, onFinalizeEarly }: SequenceScannerLayoutProps) {
    const sequenceSubtitle = expectedQrCount && expectedQrCount > 1 ? `Scanned ${scannedQrCount} of ${expectedQrCount}` : "";

    const showEarlyFinish = scannedQrCount > 0 && expectedQrCount && scannedQrCount < expectedQrCount;

    const earlyFinishButton = showEarlyFinish ? (
        <Button
            onClick={onFinalizeEarly}
            disabled={pendingQrCount > 0}
            style={{ backgroundColor: pendingQrCount > 0 ? "#918f8f" : "#e55555" }}
        >
            {pendingQrCount > 0 ? `Verifying ${pendingQrCount}...` : `Finish early (${successfulCount} valid)`}
        </Button>
    ) : null;

    return (
        <QrScanHandler
            title={title}
            subtitle={sequenceSubtitle}
            scanSuccessHandler={onScanSuccess}
            additionalButton={earlyFinishButton}
        />
    );
}