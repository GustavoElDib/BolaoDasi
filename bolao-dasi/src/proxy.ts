import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token }) {
                return !!token;
            },
        },
    }
);

// Rotas protegidas — requerem sessão válida
// /users incluído para impedir acesso direto por URL mesmo sem estar logado
export const config = {
    matcher: [
        "/games/:path*",
        "/ranking/:path*",
        "/profile/:path*",
        "/users/:path*",
    ],
};