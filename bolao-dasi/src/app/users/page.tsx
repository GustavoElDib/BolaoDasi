// Página de gerenciamento de usuários — acessível apenas pelo moderador
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteUserButton from "./DeleteUserButton";
import styles from "./page.module.css";

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
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Gerenciar Usuários</h1>
                    <p className={styles.subtitle}>
                        {users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className={styles.list}>
                    {users.map((user) => (
                        <div key={user.id} className={styles.userCard}>
                            <div className={styles.avatar}>
                                {user.nome.slice(0, 2).toUpperCase()}
                            </div>

                            <div className={styles.userInfo}>
                                <p className={styles.userName}>{user.nome}</p>
                                <p className={styles.userEmail}>{user.email}</p>
                            </div>

                            {/* Badge para o moderador, botão deletar para os demais */}
                            {user.email === MODERATOR_EMAIL ? (
                                <span className={styles.modBadge}>Moderador</span>
                            ) : (
                                <DeleteUserButton userId={user.id} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}