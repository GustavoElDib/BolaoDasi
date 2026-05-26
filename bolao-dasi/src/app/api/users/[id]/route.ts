import { NextResponse }
    from "next/server";

import { prisma }
    from "@/lib/prisma";

export async function DELETE(
    req: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {

    const { id } =
        await context.params;

    await prisma.user.delete({
        where: {
            id,
        },
    });

    return NextResponse.json({
        success: true,
    });

}