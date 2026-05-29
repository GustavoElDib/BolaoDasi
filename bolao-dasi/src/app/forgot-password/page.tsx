"use client";

import { useState } from "react";
import Link from "next/link";
import { Toast, useToast } from "@/components/toast/Toast";
import styles from "@/app/auth.module.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Estado para mostrar mensagem de confirmação após envio
    const [sent, setSent] = useState(false);

    const { toast, showToast, hideToast } = useToast();

    async function handleSend() {
        if (!email.trim()) {
            showToast("Digite seu e-mail.", "error");
            return;
        }

        try {
            setLoading(true);

            // Chama a rota POST /api/forgot-password que envia o email de recuperação
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                // Mostra tela de confirmação em vez de redirecionar
                setSent(true);
            } else {
                showToast("Erro ao enviar e-mail. Tente novamente.", "error");
            }
        } catch {
            showToast("Erro inesperado. Tente novamente.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className={styles.page}>
                <div className={styles.card}>

                    {/* Mostra tela diferente após envio do email */}
                    {sent ? (
                        <>
                            <div className={styles.header}>
                                <span className={styles.trophy}>📬</span>
                                <h1 className={styles.title}>E-mail enviado!</h1>
                                <p className={styles.subtitle}>
                                    Verifique sua caixa de entrada e siga
                                    as instruções para redefinir sua senha.
                                </p>
                            </div>
                            <div className={styles.footer}>
                                <Link href="/login" className={styles.link}>
                                    ← Voltar para o login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Cabeçalho */}
                            <div className={styles.header}>
                                <span className={styles.trophy}>🔑</span>
                                <h1 className={styles.title}>Recuperar senha</h1>
                                <p className={styles.subtitle}>
                                    Digite seu e-mail e enviaremos um
                                    link para redefinir sua senha.
                                </p>
                            </div>

                            <hr className={styles.divider} />

                            {/* Formulário */}
                            <div className={styles.form}>
                                <div className={styles.field}>
                                    <label
                                        className={styles.label}
                                        htmlFor="email"
                                    >
                                        E-mail
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className={styles.input}
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleSend()
                                        }
                                    />
                                </div>

                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleSend}
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar link"}
                                </button>
                            </div>

                            {/* Link de volta */}
                            <div className={styles.footer}>
                                <Link href="/login" className={styles.link}>
                                    ← Voltar para o login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}