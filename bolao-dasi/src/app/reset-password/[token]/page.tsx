"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Toast, useToast } from "@/components/toast/Toast";
import styles from "@/app/auth.module.css";

export default function ResetPasswordPage() {
    const params = useParams();
    const [senha, setSenha] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    async function handleReset() {
        // validações antes de enviar
        if (!senha.trim()) {
            showToast("Digite a nova senha.", "error");
            return;
        }

        if (senha !== confirmar) {
            showToast("As senhas não coincidem.", "error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: params.token,
                    senha,
                }),
            });

            if (response.ok) {
                // mostra tela de confirmação em vez de redirecionar direto
                setDone(true);
            } else {
                showToast(
                    "Link inválido ou expirado. Solicite um novo.",
                    "error"
                );
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

                    {/* tela de confirmação após senha alterada */}
                    {done ? (
                        <>
                            <div className={styles.header}>
                                <span className={styles.trophy}>✅</span>
                                <h1 className={styles.title}>Senha alterada!</h1>
                                <p className={styles.subtitle}>
                                    Sua senha foi redefinida com sucesso.
                                    Faça login com a nova senha.
                                </p>
                            </div>
                            <div className={styles.footer}>
                                <Link href="/login" className={styles.link}>
                                    Ir para o login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Cabeçalho */}
                            <div className={styles.header}>
                                <span className={styles.trophy}>🔒</span>
                                <h1 className={styles.title}>Nova senha</h1>
                                <p className={styles.subtitle}>
                                    Escolha uma senha segura para sua conta.
                                </p>
                            </div>

                            <hr className={styles.divider} />

                            {/* Formulário */}
                            <div className={styles.form}>
                                <div className={styles.field}>
                                    <label
                                        className={styles.label}
                                        htmlFor="senha"
                                    >
                                        Nova senha
                                    </label>
                                    <input
                                        id="senha"
                                        type="password"
                                        placeholder="••••••••"
                                        className={styles.input}
                                        value={senha}
                                        onChange={(e) =>
                                            setSenha(e.target.value)
                                        }
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label
                                        className={styles.label}
                                        htmlFor="confirmar"
                                    >
                                        Confirmar senha
                                    </label>
                                    <input
                                        id="confirmar"
                                        type="password"
                                        placeholder="••••••••"
                                        className={styles.input}
                                        value={confirmar}
                                        onChange={(e) =>
                                            setConfirmar(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleReset()
                                        }
                                    />
                                </div>

                                <button
                                    className={styles.btnPrimary}
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    {loading ? "Salvando..." : "Salvar nova senha"}
                                </button>
                            </div>

                            <div className={styles.footer}>
                                <Link href="/login" className={styles.link}>
                                    Voltar para o login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}