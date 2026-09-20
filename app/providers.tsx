"use client"

import "./globals.css"
import '@mantine/core/styles.css';

import { createTheme, DirectionProvider, MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { ModalsProvider } from "@mantine/modals";
import { ToastContainer } from "react-toastify";

const theme = createTheme({
    fontFamily: "Dana"
});

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <DirectionProvider initialDirection='rtl'>
            <MantineProvider theme={theme}>
                <ModalsProvider modalProps={{ closeButtonProps: { color: "red" } }} labels={{ cancel: "لفو", confirm: "تایید" }} >
                    {children}
                    <ToastContainer />
                </ModalsProvider>

            </MantineProvider>
        </DirectionProvider>

    );
}