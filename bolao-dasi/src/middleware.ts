import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy() {
        return NextResponse.next();
    },
    {
        // Força o middleware a usar a variável secreta explicitamente
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            authorized({ token }) {
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        "/games/:path*",
        "/ranking/:path*",
        "/profile/:path*",
        "/users/:path*",
    ],
};