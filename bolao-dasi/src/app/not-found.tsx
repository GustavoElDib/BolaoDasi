"use client";
import { Error404 } from "@/components/animations/Error404";
import styles from "./page.module.css";
import Link from "next/link";
export default function NotFound() {
    
    return (
        <div style={{width: '100vw', height: '100vh', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24}}>
            <h1>Página não encontrada!</h1>
            <Error404 />
            <div className={styles.btnPrimary}>
                <Link href="/">
                    Voltar para a home
                </Link>
            </div>
        </div>
    );
}
