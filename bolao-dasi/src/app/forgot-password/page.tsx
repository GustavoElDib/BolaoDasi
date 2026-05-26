"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

    const [email, setEmail] =
        useState("");

    async function handleSend() {

        const response =
            await fetch(
                "/api/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email,
                    }),
                }
            );

        if (response.ok) {

            alert(
                "Email enviado!"
            );

        } else {

            alert(
                "Erro ao enviar email"
            );

        }

    }

    return (

        <div>

            <h1>
                Recuperar senha
            </h1>

            <input
                placeholder="Seu email"
                value={email}
                onChange={(e) =>
                    setEmail(
                        e.target.value
                    )
                }
            />

            <button
                onClick={handleSend}
            >
                Enviar
            </button>

        </div>

    );

}