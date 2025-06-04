import { Particles } from "@/components/magicui/particles";
import Header from "@/components/asset/header-landingpage";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Particles
        className="absolute inset-0 z-0"
        quantity={80}
        ease={20}
        refresh
        size={0.6}
        vx={0.2}
        vy={0.1}
      />

      <Header />

      {/* Kontainer konten, termasuk login/register */}
      <div className="relative z-10 flex items-center justify-center px-4">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
