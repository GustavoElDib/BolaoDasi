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

export function EmptyAnimation() {
    return (
        <Player
            autoplay
            loop
            src="/animations/empty.json"
            style={{ width: 250, height: 250 }}
        />
    );
}