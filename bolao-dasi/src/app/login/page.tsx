"use client";

// Ferramentas de autenticação do NextAuth
import { signIn } from "next-auth/react";

// Hooks do React para estado e do Next.js para navegação
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Componente de notificação (substitui alert)
import { Toast, useToast } from "@/components/toast/Toast";

// CSS module compartilhado entre todas as páginas de autenticação
import styles from "@/app/auth.module.css";

export default function LoginPage() {
    const router = useRouter();

    // Estado dos campos do formulário
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // Estado de carregamento para desabilitar o botão enquanto faz login
    const [loading, setLoading] = useState(false);

    // Hook do componente Toast para exibir mensagens de sucesso/erro
    const { toast, showToast, hideToast } = useToast();

    async function handleLogin() {
        try {
            setLoading(true);

            // Tenta autenticar com email e senha via NextAuth
            // redirect: false evita que o NextAuth redirecione sozinho
            // assim podemos tratar o erro manualmente
            const result = await signIn("credentials", {
                email,
                senha,
                redirect: false,
            });

            // Se houver erro, o NextAuth devolve result.error com a mensagem
            if (result?.error) {
                showToast("Email ou senha inválidos.", "error");
                return;
            }

            // router.refresh() faz o layout.tsx re-buscar a sessão no servidor
            // sem isso o Navbar não atualiza e continua mostrando "Login"
            router.refresh();
            router.push("/games");
        } catch {
            showToast("Erro inesperado. Tente novamente.", "error");
        } finally {
            // Sempre reativa o botão, independente de sucesso ou erro
            setLoading(false);
        }
    }

    return (
        <>
            {/* Toast aparece no canto da tela quando showToast() é chamado */}
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

                    {/* Cabeçalho com ícone e título */}
                    <div className={styles.header}>
                        <h1 className={styles.title}>Bolão DASI</h1>
                        <p className={styles.subtitle}>
                            Entre para fazer seus palpites
                        </p>
                    </div>

                    <hr className={styles.divider} />

                    {/* Formulário de login */}
                    <div className={styles.form}>
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
                                // Permite pressionar Enter para logar
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleLogin()
                                }
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
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleLogin()
                                }
                            />
                        </div>

                        <button
                            className={styles.btnPrimary}
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </div>

                    {/* Links secundários */}
                    <div className={styles.footer}>
                        <Link
                            href="/forgot-password"
                            className={styles.link}
                        >
                            Esqueci minha senha
                        </Link>
                        <hr className={styles.divider} style={{ width: "100%" }} />
                        <p className={styles.footerText}>
                            Não tem conta?{" "}
                            <Link href="/register" className={styles.link}>
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}