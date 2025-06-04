import { BackgroundLanding } from "@/components/bg/landing-page";
import { Particles } from "@/components/magicui/particles";

export default function Home() {
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
      <BackgroundLanding />
    </>
  );
}
