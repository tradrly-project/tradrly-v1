"use client";

import React, { useState, useRef } from "react";
import { MainButton } from "../button";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const mainMenu = [
    { title: "Beranda", href: "/" },
    { title: "Fitur", submenu: ["Fitur 1", "Fitur 2", "Fitur 3"], icon: ChevronDownIcon },
    { title: "Harga" },
    { title: "Tentang Kami" },
];

const LineGradient = ({ active }: { active: boolean }) => (
    <>
        <span
            className={`absolute inset-x-0 -bottom-px block h-px w-full 
        bg-gradient-to-r from-transparent via-cyan-500 to-transparent 
        transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0 group-hover/btn:opacity-100"
                }`}
        />
        <span
            className={`absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 
        bg-gradient-to-r from-transparent via-indigo-500 to-transparent 
        blur-sm transition-opacity duration-500 
        ${active ? "opacity-100" : "opacity-0 group-hover/btn:opacity-100"}`}
        />
    </>
);

export default function Header() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const closeTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (menuTitle: string) => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
        setOpenMenu(menuTitle);
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setOpenMenu(null);
        }, 150); // delay dalam ms agar user bisa pindah ke submenu
    };

    return (
        <div className="sticky top-0 z-50 w-full py-5 px-10 grid grid-cols-3 items-center bg-background">
            <div />
            <nav className="relative flex items-center justify-center bg-background border-2 border-zinc-900 rounded-full py-1.5 space-x-4.5">
                {mainMenu.map((menu) => {
                    const Icon = menu.icon;
                    const isOpen = openMenu === menu.title;
                    const hasSubmenu = !!menu.submenu;

                    return (
                        <div
                            key={menu.title}
                            className="relative"
                            onMouseEnter={() => hasSubmenu && handleMouseEnter(menu.title)}
                            onMouseLeave={() => hasSubmenu && handleMouseLeave()}
                        >
                            <div
                                className="cursor-pointer relative text-white antialiased font-medium px-2 py-1 group/btn transition-colors duration-200 ease-out hover:text-cyan-500 hover:-translate-y-[1px] transform-gpu will-change-transform flex items-center gap-2.5 text-sm"
                            >
                                {menu.title}
                                {Icon && (
                                    <Icon
                                        className={`w-4 h-4 transition-transform duration-75 ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                )}
                                <LineGradient active={isOpen} />
                            </div>

                            {hasSubmenu && isOpen && (
                                <div
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 text-sm"
                                    onMouseEnter={() => {
                                        if (closeTimeout.current) {
                                            clearTimeout(closeTimeout.current);
                                            closeTimeout.current = null;
                                        }
                                    }}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div
                                        className="bg-background text-foreground border-zinc-800 border py-4 px-3 
                      rounded-lg shadow-lg w-40 transition-all duration-300 ease-out"
                                    >
                                        <ul className="space-y-1.5">
                                            {menu.submenu.map((item) => (
                                                <li
                                                    key={item}
                                                    className="relative group/btn rounded-md px-2 py-1 cursor-pointer 
                            transition-colors duration-200 "
                                                >
                                                    {item}
                                                    <LineGradient active={false} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
            <div className="flex justify-end items-center">
                <Link href="/login">
                    <MainButton className="w-full px-7">Masuk</MainButton>
                </Link>
            </div>
        </div>
    );
}
