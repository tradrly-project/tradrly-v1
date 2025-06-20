// /api/setup/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { SetupTradeSchema } from "@/lib/zod";

async function getUserId() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("User tidak terautentikasi");
    }
    return session.user.id;
}

// GET: Ambil SetupTrade berdasarkan ID
export async function GET(request: Request) {
    try {
        const userId = await getUserId();
        const id = request.url.split("/").pop();
        if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

        const setup = await prisma.setupTrade.findFirst({
            where: { id, userId },
            include: {
                setupPairs: { include: { pair: true } },
                checklistItems: true,
            },
        });

        if (!setup) return NextResponse.json({ error: "Setup tidak ditemukan" }, { status: 404 });

        return NextResponse.json({
            ...setup,
            pairs: setup.setupPairs.map((sp) => sp.pair),
        });
    } catch (error) {
        console.error("GET setup error:", error);
        return NextResponse.json({ error: "Gagal mengambil setup" }, { status: 500 });
    }
}

// PUT: Update SetupTrade
export async function PUT(request: Request) {
    try {
        const userId = await getUserId();
        const id = request.url.split("/").pop();
        if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

        const formData = await request.formData();
        const parsed = SetupTradeSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!parsed.success) {
            return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const data = parsed.data;

        await prisma.$transaction(async (tx) => {
            await tx.setupTrade.update({
                where: { id, userId },
                data: {
                    ...data,
                    pairId: data.appliesToAllPairs ? null : data.pairId,
                },
            });

            // Bersihkan dan update SetupTradePair jika spesifik pair
            if (!data.appliesToAllPairs && data.pairId) {
                await tx.setupTradePair.deleteMany({ where: { setupTradeId: id } });

                await tx.setupTradePair.create({
                    data: {
                        setupTradeId: id,
                        pairId: data.pairId,
                    },
                });
            }

            // (Opsional) update checklistItems kalau perlu di sini
        });

        revalidatePath("/api/setup");
        return NextResponse.json({ updated: true });
    } catch (error) {
        console.error("PUT setup error:", error);
        return NextResponse.json({ error: "Gagal mengupdate setup" }, { status: 500 });
    }
}

// DELETE: Hapus SetupTrade
export async function DELETE(request: Request) {
    try {
        const userId = await getUserId();
        const id = request.url.split("/").pop();
        if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });

        const existing = await prisma.setupTrade.findFirst({
            where: { id, userId },
        });
        if (!existing) return NextResponse.json({ error: "Data tidak ditemukan atau tidak diizinkan" }, { status: 403 });

        await prisma.$transaction(async (tx) => {
            await tx.setupTradePair.deleteMany({ where: { setupTradeId: id } });
            await tx.checklistItem.deleteMany({ where: { setupTradeId: id } });
            await tx.setupTrade.delete({ where: { id } });
        });

        revalidatePath("/api/setup");
        return NextResponse.json({ deleted: true });
    } catch (error) {
        console.error("DELETE setup error:", error);
        return NextResponse.json({ error: "Gagal menghapus setup" }, { status: 500 });
    }
}
