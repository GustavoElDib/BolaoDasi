//rota que lida com as rotas de autenticação do NextAuth, utilizando as opções definidas em authOptions
import NextAuth
    from "next-auth";

import { authOptions }
    from "@/lib/auth";

const handler =
    NextAuth(authOptions);

export {
    handler as GET,
    handler as POST
};