import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProfileForm } from "@/components/profile/ProfileForm";
import styles from "./page.module.css";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, nome: true, email: true },
    });

    if (!user) redirect("/login");

    // Verifica se o usuário logado é o moderador
    // Feito aqui no Server Component porque process.env não está disponível no client
    const isModerator = session.user.email === process.env.MODERATOR_EMAIL;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.avatarLarge}>
                        {user.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className={styles.title}>Editar perfil</h1>
                        <p className={styles.subtitle}>
                            Atualize seus dados pessoais
                        </p>
                    </div>
                </div>

                {/* isModerator impede que o moderador veja a zona de perigo */}
                <ProfileForm user={user} isModerator={isModerator} />

                <div className={styles.passwordSection}>
                    <p className={styles.passwordLabel}>Senha</p>
                    <p className={styles.passwordDesc}>
                        Para alterar sua senha, acesse a página de redefinição.
                    </p>
                    <Link href="/reset-password" className={styles.passwordLink}>
                        Redefinir senha →
                    </Link>
                </div>
            </div>
        </div>
    );
}