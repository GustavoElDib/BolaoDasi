"use client";

import { Error404 } from "@/components/animations/Error404";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <Error404 />
                <h1 className={styles.title}>Página não encontrada</h1>
                <p className={styles.subtitle}>
                    Parece que essa página não existe ou foi movida.
                </p>
                <Link href="/" className={styles.btn}>
                    Voltar para a home
                </Link>
            </div>
        </div>
    );
}