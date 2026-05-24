"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleRegister() {
        const response = await fetch("/api/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                nome,
                email,
                senha,
            }),
        });

        if (response.ok) {
            alert("Usuário criado com sucesso!");

            router.push("/login");
        } else {
            const data = await response.json();

            alert(data.error || "Erro ao criar usuário");
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: 300,
                margin: "100px auto",
            }}
        >
            <h1>Cadastro</h1>

            <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            <button onClick={handleRegister}>
                Criar Conta
            </button>
        </div>
    );
}