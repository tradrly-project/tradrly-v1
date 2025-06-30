"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils" // pastikan import ini sesuai path kamu
import { ShineBorder } from "../magicui/shine-border"

const plans = [
    {
        name: "Basic",
        price: 0,
        originalPrice: "Free",
        discountPrice: "Free",
        highlight: false,
        duration: "30 Hari",
        features: [
            "Tambahkan hingga 10 jurnal trading / bulan",
            "Upload hingga 10 screenshot jurnal / bulan",
            "Tambahkan hingga 1 akun broker",
            "Buat hingga 1 setup trading",
            "❌ Statistik tidak tersedia",
            "Akses komunitas dengan Basic Role",
            "❌ News, Outlook, Signal tidak tersedia",
            "❌ Custom field tidak tersedia",
        ],
    },
    {
        name: "Plus",
        price: 10,
        originalPrice: 20,
        highlight: true,
        duration: "6 Bulan",
        features: [
            "Tambahkan hingga 25 jurnal trading / bulan",
            "Upload hingga 25 screenshot jurnal / bulan",
            "Tambahkan hingga 3 akun broker",
            "Buat hingga 3 setup trading",
            "Statistik dasar (jumlah entry, win/lose)",
            "Akses komunitas dengan Plus Role",
            "✅ News mingguan",
            "✅ Custom field (Pair, Psikologi, dll)",
            "❌ Outlook & Signal tidak tersedia",
        ],
    },
    {
        name: "Prime",
        price: 30,
        originalPrice: 25,
        highlight: false,
        duration: "Life Time",
        features: [
            "Tambahkan jurnal trading tanpa batas",
            "Upload screenshot jurnal tanpa batas",
            "Tambahkan hingga 10 akun broker",
            "Buat setup trading tanpa batas",
            "Statistik lanjutan (grafik, win rate, RRR, equity curve)",
            "Akses komunitas dengan Prime Role + Private Room Elite",
            "✅ News mingguan, Outlook, dan Sinyal trading",
            "✅ Custom field (Pair, Psikologi, dll)",
        ],
    },
]

export function PricingPlans() {
    const [planType, setPlanType] = useState<"monthly" | "yearly">("monthly")

    function getDiscountPercent(original: number | string, discounted: number) {
        const originalPrice = typeof original === "string" ? parseFloat(original.replace("$", "")) * 100 : original
        return Math.round(((originalPrice - discounted) / originalPrice) * 100)
      }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 text-white">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Plans & Pricing</h2>
                <p className="text-muted-foreground">We got the best offers for you!</p>
                <div className="mt-4 inline-flex bg-muted p-1 rounded-full">
                    <Button
                        variant={planType === "monthly" ? "default" : "ghost"}
                        onClick={() => setPlanType("monthly")}
                        className="rounded-full px-4"
                    >
                        Monthly
                    </Button>
                    <Button
                        variant={planType === "yearly" ? "default" : "ghost"}
                        onClick={() => setPlanType("yearly")}
                        className="rounded-full px-4"
                    >
                        Yearly
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                    <Card
                        key={i}
                        className={cn(
                            "relative overflow-hidden rounded-2xl shadow-xl text-white transition-all",
                            plan.highlight ? "border-0 bg-background" : "border-0 bg-foreground/3"
                        )}
                    >
                        {/* Hanya tampilkan ShineBorder untuk plan tengah (highlighted) */}
                        {plan.highlight && <ShineBorder shineColor="#0ea5e9" />}

                        <CardContent className="p-6 space-y-4 z-10 relative">
                            {plan.highlight && (
                                <div className="bg-sky-500 text-white text-sm px-3 py-1 rounded-full inline-block">
                                    Recommended
                                </div>
                            )}
                            <h3 className="text-xl font-semibold">{plan.name}</h3>

                            <div className="flex items-center justify-between">
                                {/* Left: Discount Price */}
                                <div className="text-3xl font-bold leading-tight flex items-baseline gap-1">
                                    <span className="text-4xl">${Math.floor(plan.price)}</span>
                                    <span className="text-lg">.{(plan.price % 1).toFixed(2).split(".")[1]}</span>
                                    <span className="text-sm text-muted-foreground ml-1">/ month</span>
                                </div>

                                {/* Right: Original price & badge */}
                                {plan.originalPrice && plan.price !== 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-base line-through text-muted-foreground">
                                            ${plan.originalPrice}
                                        </span>
                                        <div className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {getDiscountPercent(plan.originalPrice, plan.price)}% OFF
                                        </div>
                                    </div>
                                )}
                            </div>


                            <p className="text-sm text-muted-foreground">Umur Akun: {plan.duration}</p>
                            <Button className="w-full">{plan.price === 0 ? "Start for Free" : "Buy Now"}</Button>

                            <ul className="text-sm space-y-2 mt-4">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex gap-2 items-start">
                                        <span>•</span> <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                    </Card>
                  
                ))}
            </div>
        </div>
    )
}
