"use client";

import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

type ToastType = "success" | "error";

type Props = {
    message: string;
    type: ToastType;
    onClose: () => void;
};

export function Toast({ message, type, onClose }: Props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // aguarda animação de saída
        }, 3500);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`
                ${styles.toast}
                ${styles[type]}
                ${visible ? styles.enter : styles.leave}
            `}
            role="alert"
        >
            <span className={styles.icon}>
                {type === "success" ? "✓" : "✕"}
            </span>
            <span className={styles.message}>{message}</span>
            <button
                className={styles.close}
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
                aria-label="Fechar"
            >
                ✕
            </button>
        </div>
    );
}

// hook para usar o toast facilmente
import { useCallback } from "react";

type ToastState = {
    message: string;
    type: ToastType;
    id: number;
} | null;

export function useToast() {
    const [toast, setToast] = useState<ToastState>(null);

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type, id: Date.now() });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, hideToast };
}
