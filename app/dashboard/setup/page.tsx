// app/dashboard/setup/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import SetupClient from "./setup-client";
import { SetupTradeWithPair } from "@/lib/types";

// Optional: konversi Decimal ke number agar aman dipakai di frontend
function serializeDecimals<T>(data: T): T {
    return JSON.parse(
        JSON.stringify(data, (key, value) =>
            typeof value === "object" && value !== null && value.constructor?.name === "Decimal"
                ? Number(value)
                : value
        )
    );
}

export default async function SetupTradePage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error("User tidak terautentikasi");
    }

    // Ambil SetupTrade lengkap dengan relasi ke pair lewat setupPairs
    const setupsRaw = await prisma.setupTrade.findMany({
        where: { userId },
        include: {
            setupPairs: {
                include: {
                    pair: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Transform relasi setupPairs menjadi array pairs
    const setups: SetupTradeWithPair[] = setupsRaw.map((setup) => ({
        ...setup,
        pairs: setup.setupPairs.map((sp) => sp.pair),
    }));

    // Ambil semua pair user untuk opsi dropdown dsb
    const pairs = await prisma.pair.findMany({
        where: { userId },
        select: {
            id: true,
            symbol: true,
        },
        orderBy: {
            symbol: "asc",
        },
    });

    // Optional: konversi Decimal jika perlu (kalau ada Decimal di pairs atau setups)
    const setupsWithSafeNumbers = serializeDecimals(setups);

    return <SetupClient setups={setupsWithSafeNumbers} pairs={pairs} />;
}
