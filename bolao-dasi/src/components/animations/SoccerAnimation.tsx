"use client";

// O @lottiefiles/react-lottie-player acessa o `document` no momento do import,
// o que causa erro no servidor (SSR). A solução é usar dynamic() com ssr: false,
// que garante que o componente só é carregado no navegador.
import dynamic from "next/dynamic";

const Player = dynamic(
    () =>
        import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
    {
        ssr: false, // nunca tenta renderizar no servidor
        loading: () => <div style={{ width: 220, height: 220 }} />, // placeholder enquanto carrega
    }
);

export function SoccerAnimation() {
    return (
        <Player
            autoplay
            loop
            src="/animations/soccer-player.json"
            style={{ width: 350, height: 350 }}
        />
    );
}