"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toast, useToast } from "@/components/toast/Toast";
import styles from "@/app/auth.module.css";

export default function RegisterPage() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const { toast, showToast, hideToast } = useToast();

    async function handleRegister() {
        // Validações antes de enviar para a API
        if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
            showToast("Preencha todos os campos.", "error");
            return;
        }

        if (senha !== confirmarSenha) {
            showToast("As senhas não coincidem.", "error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha }),
            });

            if (response.ok) {
                showToast("Conta criada com sucesso!", "success");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                const data = await response.json();
                showToast(data.error || "Erro ao criar conta.", "error");
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
                    <div className={styles.header}>
                        <h1 className={styles.title}>Criar conta</h1>
                        <p className={styles.subtitle}>
                            Junte-se ao bolão da Copa
                        </p>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="nome">
                                Nome
                            </label>
                            <input
                                id="nome"
                                type="text"
                                placeholder="Seu nome"
                                className={styles.input}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="email">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="senha">
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                className={styles.input}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="confirmarSenha">
                                Confirmar senha
                            </label>
                            <input
                                id="confirmarSenha"
                                type="password"
                                placeholder="••••••••"
                                className={styles.input}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                autoComplete="off"
                                // Permite pressionar Enter para cadastrar
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleRegister()
                                }
                            />
                        </div>

                        <button
                            className={styles.btnPrimary}
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Criando conta..." : "Criar conta"}
                        </button>
                    </div>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            Já tem conta?{" "}
                            <Link href="/login" className={styles.link}>
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}