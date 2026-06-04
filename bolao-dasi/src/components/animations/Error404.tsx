"use client";
import dynamic from "next/dynamic";

const Player = dynamic(
    () =>
        import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
    {
        ssr: false,
        loading: () => <div style={{ width: 250, height: 250 }} />,
    }
);

export function Error404() {
    return (
        <Player
            autoplay
            loop
            src="/animations/error404.json"
            style={{ width: 250, height: 250 }}
        />
    );
}