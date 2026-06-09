import {FooterWrapper, FooterLink, FooterText} from "../styles/Footer.styles.ts";
import githubLogo from "../assets/github-logo.svg";

export default function Footer() {
    return (
        <FooterWrapper>
            <FooterText>© {new Date().getFullYear()} GitHub</FooterText>
            <FooterLink
                href="https://github.com/ocadotechnology-university/supervised-transactions-decentralized-system"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
            >
                <img
                    src={githubLogo}
                    height="24"
                    width="24"
                    alt="GitHub Repository"
                />
            </FooterLink>
        </FooterWrapper>
    );
}