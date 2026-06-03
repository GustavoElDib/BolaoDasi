"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/toast/Toast";

type Props = {
    userId: string;
};

export default function DeleteUserButton({ userId }: Props) {
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        try {
            setDeleting(true);

            const response = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                showToast("Usuário excluído com sucesso.", "success");
                setConfirmOpen(false);
                router.refresh();
            } else {
                showToast("Erro ao excluir usuário.", "error");
            }
        } catch {
            showToast("Erro inesperado. Tente novamente.", "error");
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

            {/* Modo normal: botão excluir */}
            {!confirmOpen ? (
                <button
                    onClick={() => setConfirmOpen(true)}
                    style={{
                        background: "transparent",
                        border: "0.5px solid rgba(239, 68, 68, 0.35)",
                        color: "#f87171",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background 0.2s, border-color 0.2s",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            "rgba(239, 68, 68, 0.08)";
                        e.currentTarget.style.borderColor =
                            "rgba(239, 68, 68, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor =
                            "rgba(239, 68, 68, 0.35)";
                    }}
                >
                    Excluir
                </button>
            ) : (
                /* Modo confirmação: dois botões inline */
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                    }}
                >
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                            background: "#ef4444",
                            border: "none",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: deleting ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: deleting ? 0.6 : 1,
                        }}
                    >
                        {deleting ? "Excluindo..." : "Confirmar"}
                    </button>
                    <button
                        onClick={() => setConfirmOpen(false)}
                        style={{
                            background: "transparent",
                            border: "0.5px solid rgba(255,255,255,0.08)",
                            color: "#888",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </>
    );
}