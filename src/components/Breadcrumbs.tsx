import { useLocation } from "react-router-dom";
import { BreadcrumbWrapper, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, Separator } from "../styles/Breadcrumb.styles.ts";

const labels: Record<string, string> = {
    customer: "Customer",
    scan: "Scanner",
    results: "Results",
    cashout: "Cashout",
    trader: "Trader",
    points: "Points",
    supervisor: "Supervisor",
    register: "Register",
    verify: "Verify",
    ranking: "Ranking",
    qr: "QR",
};

export default function Breadcrumbs() {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter(Boolean);

    return (
        <BreadcrumbWrapper aria-label="Breadcrumb">
            <BreadcrumbLink to="/">
                Home
            </BreadcrumbLink>

            {pathnames.map((segment, index) => {
                const to =
                    "/" + pathnames
                        .slice(0, index + 1)
                        .join("/");

                const isLast = index === pathnames.length - 1;
                const label = labels[segment] || segment;

                return (
                    <BreadcrumbItem key={to}>
                        <Separator aria-hidden="true">
                            ›
                        </Separator>

                        {isLast ? (
                            <BreadcrumbCurrent aria-current="page">
                                {label}
                            </BreadcrumbCurrent>
                        ) : (
                            <BreadcrumbLink to={to}>
                                {label}
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                );
            })}
        </BreadcrumbWrapper>
    );
}