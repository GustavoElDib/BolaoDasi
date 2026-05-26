"use client";

import { useState }
    from "react";

import { useParams }
    from "next/navigation";

export default function
    ResetPasswordPage() {

    const params = useParams();

    const [senha, setSenha] =
        useState("");

    async function handleReset() {

        const response =
            await fetch(
                "/api/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        token: params.token,
                        senha,
                    }),
                }
            );

        if (response.ok) {

            alert(
                "Senha alterada!"
            );

        } else {

            alert(
                "Token inválido"
            );

        }

    }

    return (

        <div>

            <input
                type="password"
                placeholder="Nova senha"
                value={senha}
                onChange={(e) =>
                    setSenha(
                        e.target.value
                    )
                }
            />

            <button
                onClick={handleReset}
            >
                Alterar senha
            </button>

        </div>

    );

}