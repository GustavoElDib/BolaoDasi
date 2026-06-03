// Página de gerenciamento de usuários — acessível apenas pelo moderador
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteUserButton from "./DeleteUserButton";

const MODERATOR_EMAIL = process.env.MODERATOR_EMAIL;

export default async function UsersPage() {
    const session = await getServerSession(authOptions);

    // Redireciona se não estiver logado ou não for o moderador
    if (!session?.user?.email || session.user.email !== MODERATOR_EMAIL) {
        redirect("/");
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold mb-8">Usuários</h1>

            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between border border-zinc-800 rounded-xl p-4"
                    >
                        <div>
                            <h2 className="font-bold">{user.nome}</h2>
                            <p className="text-zinc-400">{user.email}</p>
                        </div>

                        {/* Não mostra o botão de deletar para o próprio moderador */}
                        {user.email !== MODERATOR_EMAIL && (
                            <DeleteUserButton userId={user.id} />
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}