//arquivo para envolver a aplicação com os providers necessários, como o SessionProvider do next-auth para gerenciamento de sessões de autenticação
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}