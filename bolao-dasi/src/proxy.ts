import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token }) {
                // Retorna true se o usuário tiver token JWT válido
                // false redireciona automaticamente para a página de login
                return !!token;
            },
        },
    }
);

// rotas protegidas(tudo exceto home, login, registro e recuperação de senha)
export const config = {
    matcher: [
        "/games/:path*",
        "/ranking/:path*",
        "/profile/:path*",
    ],
};