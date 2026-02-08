import React from "react";
import { ArrowDown } from "lucide-react";
import { architectData } from "../mock";

const Hero = () => {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1462774603919-1d8087e62cad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMGV4dGVyaW9yfGVufDB8fHx8MTc3MDU1MDQxM3ww&ixlib=rb-4.1.0&q=85')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight animate-fade-in">
            {architectData.name}
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide opacity-90">
            {architectData.title}
          </p>
          <p className="text-base md:text-lg font-light opacity-75 max-w-2xl mx-auto">
            {architectData.tagline}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mt-12 pt-8">
            <div className="glass-stat">
              <div className="text-4xl font-bold text-[#B8986E]">{architectData.experience}</div>
              <div className="text-sm font-light mt-1">Experience</div>
            </div>
            <div className="glass-stat">
              <div className="text-4xl font-bold text-[#B8986E]">{architectData.projectsCompleted}</div>
              <div className="text-sm font-light mt-1">Projects</div>
            </div>
            <div className="glass-stat">
              <div className="text-4xl font-bold text-[#B8986E]">{architectData.awards}</div>
              <div className="text-sm font-light mt-1">Awards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer"
      >
        <ArrowDown className="text-white/70 hover:text-white transition-colors" size={32} />
      </button>
    </section>
  );
};

export default Hero;
