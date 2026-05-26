import { prisma } from "@/lib/prisma";

import DeleteUserButton from "./DeleteUserButton";

export default async function UsersPage() {

    const users =
        await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

    return (

        <main className="p-8">

            <h1 className="text-4xl font-bold mb-8">
                Usuários
            </h1>

            <div className="space-y-4">

                {users.map((user) => (

                    <div
                        key={user.id}
                        className="
                            flex
                            items-center
                            justify-between
                            border
                            border-zinc-800
                            rounded-xl
                            p-4
                        "
                    >

                        <div>

                            <h2
                                className="
                                    font-bold
                                "
                            >
                                {user.nome}
                            </h2>

                            <p
                                className="
                                    text-zinc-400
                                "
                            >
                                {user.email}
                            </p>

                        </div>

                        <DeleteUserButton
                            userId={user.id}
                        />

                    </div>

                ))}

            </div>

        </main>

    );

}