import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
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

// rotas protegidas(tudo exceto home, login, registro e recuperação de senha)
export const config = {
    matcher: [
        "/games/:path*",
        "/ranking/:path*",
        "/profile/:path*",
    ],
};