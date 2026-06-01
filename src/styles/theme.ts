import type { DefaultTheme } from 'styled-components';

export const customerTheme: DefaultTheme = {
    colors: {
        background: '#e3f2fd',
        text: '#1565c0',
        buttonBackground: '#1976d2',
        buttonText: '#ffffff',
        inputBorder: '#90caf9',
        error: '#d32f2f',
    },
};

export const traderTheme: DefaultTheme = {
    colors: {
        background: '#e8f5e9',
        text: '#2e7d32',
        buttonBackground: '#388e3c',
        buttonText: '#ffffff',
        inputBorder: '#a5d6a7',
        error: '#d32f2f',
    },
};

export const supervisorTheme: DefaultTheme = {
    colors: {
        background: '#f5e5e5',
        text: '#a21f37',
        buttonBackground: '#aa2443',
        buttonText: '#ffffff',
        inputBorder: '#d89393',
        error: '#d32f2f',
    },
};

export const defaultTheme: DefaultTheme = {
    colors: {
        background: '#eaeaea',
        text: '#111111',
        buttonBackground: '#111111',
        buttonText: '#ffffff',
        inputBorder: '#cccccc',
        error: '#ff0000',
    },
};

export type UserRole = 'customer' | 'trader' | 'supervisor' | 'default';

export const getThemeByRole = (role: UserRole): DefaultTheme => {
    switch (role) {
        case 'customer':
            return customerTheme;
        case 'trader':
            return traderTheme;
        case 'supervisor':
            return supervisorTheme;
        default:
            return defaultTheme;
    }
};