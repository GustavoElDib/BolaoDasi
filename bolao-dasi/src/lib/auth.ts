// arquivo para configurar o NextAuth, que é a biblioteca de autenticação do Next.js. Ele define os provedores de autenticação, as opções de sessão e as páginas personalizadas para login. Neste caso, estamos usando o provedor de credenciais para autenticar os usuários com email e senha, verificando as credenciais no banco de dados usando Prisma e bcrypt para comparar as senhas.
import NextAuth, { NextAuthOptions } from "next-auth"; // MODIFICADO: Importado NextAuthOptions
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import { prisma } from "./prisma";

// MODIFICADO: Adicionada a tipagem ': NextAuthOptions' para o TypeScript saber o tipo de tudo lá dentro automaticamente
export const authOptions: NextAuthOptions = {
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
                    id: String(user.id), // Garante que o id vai como String
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

    callbacks: {
        // Agora o TypeScript já sabe o tipo exato de { token, user, trigger, session }
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }

            if (trigger === "update" && session?.user) {
                if (session.user.name) token.name = session.user.name;
                if (session.user.email) token.email = session.user.email;
            }

            return token;
        },

        // Agora o TypeScript já sabe o tipo exato de { session, token }
        async session({ session, token }) {
            if (session.user && token) {
                // MODIFICADO: Adicionada a asserção 'as string' para evitar conflito de tipos (any/string)
                (session.user as any).id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };