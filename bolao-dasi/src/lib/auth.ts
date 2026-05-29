//arquivo para configurar o NextAuth, que é a biblioteca de autenticação do Next.js. Ele define os provedores de autenticação, as opções de sessão e as páginas personalizadas para login. Neste caso, estamos usando o provedor de credenciais para autenticar os usuários com email e senha, verificando as credenciais no banco de dados usando Prisma e bcrypt para comparar as senhas.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {},
                senha: {},
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.senha) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    return null;
                }

                const senhaCorreta = await bcrypt.compare(
                    credentials.senha,
                    user.senha
                );

                if (!senhaCorreta) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.nome,
                    email: user.email,
                };
            },
        }),
    ],

    secret: process.env.AUTH_SECRET,

    session: {
        strategy: "jwt" as const,
    },

    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };