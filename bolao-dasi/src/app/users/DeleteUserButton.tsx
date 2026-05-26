"use client";

import { useRouter }
    from "next/navigation";

type Props = {
    userId: string;
};

export default function DeleteUserButton({
    userId,
}: Props) {

    const router = useRouter();

    async function deleteUser() {

        const confirmDelete =
            confirm(
                "Deseja excluir esse usuário?"
            );

        if (!confirmDelete) return;

        const response = await fetch(
            `/api/users/${userId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {

            alert(
                "Usuário excluído!"
            );

            router.refresh();

        } else {

            alert(
                "Erro ao excluir"
            );

        }

    }

    return (

        <button
            onClick={deleteUser}
            className=" bg-red-500 px-4 py-2 rounded-lg "
        >
            Excluir
        </button>

    );

}