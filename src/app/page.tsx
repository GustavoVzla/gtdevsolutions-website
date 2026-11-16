import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Location from "@/components/Location";

export default function Home() {
  return (
    <main className="relative">
      {/* Fixed video background — visible through dark sections */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      <Hero />
      <Services />
      <Projects />
      <About />
      <Contact />
      <Location />
    </main>
  );
}
