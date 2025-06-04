"use client";

import { Particles } from "@/components/magicui/particles";
import Header from "@/components/asset/header-landingpage";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Particles
                className="absolute inset-0 z-10"
                quantity={80}
                ease={20}
                refresh
                size={0.6}
                vx={0.2}
                vy={0.1}
            />
            <Header />
            <div className="relative z-20 min-h-svh -mt-22">{children}</div>
        </>
    );
}
