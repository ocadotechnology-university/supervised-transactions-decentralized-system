import QrScanHandler from "./QrScanHandler";
import { Button, ButtonContainer } from "../styles/common.styles.ts";
import { AdditionalButtonWrapper, SequenceScannerWrapper } from "../styles/SequenceScannerLayout.styles.ts";

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
    const sequenceSubtitle = expectedQrCount && expectedQrCount > 1 ? `SCANNED ${scannedQrCount} OF ${expectedQrCount}` : "";

    const showEarlyFinish = scannedQrCount > 0 && expectedQrCount && scannedQrCount < expectedQrCount;

    return (
        <SequenceScannerWrapper>
            <QrScanHandler
                title={title}
                subtitle={sequenceSubtitle}
                scanSuccessHandler={onScanSuccess}
            />

            {showEarlyFinish && (
                <AdditionalButtonWrapper>
                    <ButtonContainer>
                        <Button
                            onClick={onFinalizeEarly}
                            disabled={pendingQrCount > 0}
                            style={{ backgroundColor: pendingQrCount > 0 ? "#918f8f" : "#e55555" }}
                        >
                            {pendingQrCount > 0 ? `VERIFYING ${pendingQrCount}...` : `FINISH EARLY (${successfulCount} VALID)`}
                        </Button>
                    </ButtonContainer>
                </AdditionalButtonWrapper>
            )}
        </SequenceScannerWrapper>
    );
}