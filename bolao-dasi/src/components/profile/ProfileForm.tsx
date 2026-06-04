"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Toast, useToast } from "@/components/toast/Toast";
import styles from "../../app/profile/page.module.css";

type Props = {
    user: {
        id: string;
        nome: string;
        email: string;
    };
    // Passado pela page.tsx (server component) que lê o process.env
    // Client components não acessam process.env diretamente
    isModerator: boolean;
};

export function ProfileForm({ user, isModerator }: Props) {
    const { data: session, update } = useSession();
    const [nome, setNome] = useState(user.nome);
    const [email, setEmail] = useState(user.email);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { toast, showToast, hideToast } = useToast();
    const router = useRouter();

    async function handleSave() {
        if (!nome.trim() || !email.trim()) {
            showToast("Preencha todos os campos.", "error");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                showToast(data.error || "Erro ao salvar.", "error");
                return;
            }

            await update({
                ...session,
                        user: {
                        ...session?.user,
                        name: nome, 
                        email: email
                    }
            });
            
            showToast("Perfil atualizado com sucesso!", "success");
            router.refresh();
        } catch {
            showToast("Erro inesperado. Tente novamente.", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        try {
            setDeleting(true);
            const res = await fetch(`/api/users/${user.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                showToast("Erro ao excluir conta.", "error");
                return;
            }

            await signOut({ redirect: false });
            router.push("/");
            router.refresh();
        } catch {
            showToast("Erro inesperado.", "error");
        } finally {
            setDeleting(false);
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

            <div className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="nome">
                        Nome
                    </label>
                    <input
                        id="nome"
                        type="text"
                        className={styles.input}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button
                    className={styles.btnSave}
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>

            {/* Zona de perigo — oculta para o moderador */}
            {!isModerator && (
                <div className={styles.dangerZone}>
                    <p className={styles.dangerTitle}>Zona de perigo</p>
                    <p className={styles.dangerDesc}>
                        Excluir sua conta é permanente. Todos os seus palpites
                        serão apagados.
                    </p>

                    {!confirmDelete ? (
                        <button
                            className={styles.btnDanger}
                            onClick={() => setConfirmDelete(true)}
                        >
                            Excluir minha conta
                        </button>
                    ) : (
                        <div className={styles.confirmRow}>
                            <span className={styles.confirmText}>
                                Tem certeza? Esta ação não pode ser desfeita.
                            </span>
                            <button
                                className={styles.btnDangerConfirm}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Excluindo..." : "Sim, excluir"}
                            </button>
                            <button
                                className={styles.btnCancel}
                                onClick={() => setConfirmDelete(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}