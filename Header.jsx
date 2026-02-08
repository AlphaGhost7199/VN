import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-header shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-foreground">AM</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="nav-link text-sm font-medium transition-colors hover:text-[#B8986E]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="nav-link text-sm font-medium transition-colors hover:text-[#B8986E]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="nav-link text-sm font-medium transition-colors hover:text-[#B8986E]"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="nav-link text-sm font-medium transition-colors hover:text-[#B8986E]"
            >
              Services
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="glass-button border-[#B8986E]/30 hover:bg-[#B8986E]/10 hover:border-[#B8986E]"
            >
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 glass-card rounded-lg p-4 space-y-3">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-[#B8986E] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-[#B8986E] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-[#B8986E] transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left py-2 text-sm font-medium hover:text-[#B8986E] transition-colors"
            >
              Services
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="w-full glass-button border-[#B8986E]/30 hover:bg-[#B8986E]/10"
            >
              Contact
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
