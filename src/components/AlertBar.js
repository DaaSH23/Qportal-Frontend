import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    animation: 'slideIn 0.9s ease-in-out',
                },
                '@keyframes slideIn': {
                    '0%': {
                        transform: 'translateY(-100%)',
                    },
                    '100%': {
                        transform: 'translateY(0)',
                    },
                },
                '@keyframes slideOut': {
                    '0%': {
                        transform: 'translateY(0)',
                    },
                    '100%': {
                        transform: 'translateY(-100%)',
                    },
                },
            },
        },
    },
});

export default function BasicAlerts({ show, status, msg }) {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {visible && (
                <Stack sx={{ width: '100%', alignItems: "center", margin: "0 0 10px 0" }} spacing={2}>
                    <Alert
                        severity={status}
                        sx={{
                            animation: !show && 'slideOut 0.5s ease-in-out',
                        }}
                    >
                        {msg}
                    </Alert>
                </Stack>
            )}
        </ThemeProvider>
    );
}
