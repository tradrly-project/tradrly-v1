import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userTimeframes = await prisma.userTimeframe.findMany({
            where: {
                userId,
                hidden: false,
            },
            include: {
                timeframe: true,
            },
            orderBy: {
                timeframe: {
                    code: "asc",
                },
            },
        });

        const timeframes = userTimeframes.map((tf) => ({
            id: tf.id, // << PENTING: kirim userTimeframe.id
            label: tf.customCode || tf.timeframe.code,
            value: tf.id, // value harus cocok dengan ID yang kamu `connect` di actions
        }));

        return NextResponse.json({ timeframes }, {
            headers: {
                "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
            },
        });
    } catch (error) {
        console.error("Error fetching timeframes:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data timeframe" },
            { status: 500 }
        );
    }
}
