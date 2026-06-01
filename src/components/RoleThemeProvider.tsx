import { ThemeProvider } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { getThemeByRole } from '../styles/theme';
import type { UserRole } from '../styles/theme';
import type { ReactNode } from 'react';

type RoleThemeProviderProps = {
    children: ReactNode;
}

export default function RoleThemeProvider({ children }: RoleThemeProviderProps) {
    const location = useLocation();

    const getRoleFromPath = (pathname: string): UserRole => {
        if (pathname.startsWith('/customer')) {
            return 'customer';
        }
        if (pathname.startsWith('/trader')) {
            return 'trader';
        }
        if (pathname.startsWith('/supervisor')) {
            return 'supervisor';
        }
        return 'default';
    };

    const role = getRoleFromPath(location.pathname);
    const theme = getThemeByRole(role);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}