import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            background: string;
            text: string;
            buttonBackground: string;
            buttonText: string;
            inputBorder: string;
            error: string;
        };
    }
}