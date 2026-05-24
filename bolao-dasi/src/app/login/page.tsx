"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
        const result = await signIn("credentials", {
            email,
            senha,
            redirect: false,
        });

        if (result?.error) {
            alert("Email ou senha inválidos");
            return;
        }

        alert("Login realizado com sucesso!");

        router.push("../teste");
    }

    return (
        <div>
            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                onChange={(e) => setSenha(e.target.value)}
            />

            <button onClick={handleLogin}>
                Entrar
            </button>
        </div>
    );
}