import React from 'react';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 border-t border-blue-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-gray-700 flex items-center justify-center md:justify-start font-medium">
              © {currentYear} Abdul Hadi Nabil.
            </p>
          </div>

          <div className="flex space-x-4">
            <a 
              href="https://github.com/abdulhadinabbil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 glass-blue rounded-xl text-gray-600 hover:text-blue-600 hover-glow transition-all duration-300"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/abdulhadinabil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 glass-blue rounded-xl text-gray-600 hover:text-blue-600 hover-glow transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:contact@abdulhadinabil.com" 
              className="p-3 glass-blue rounded-xl text-gray-600 hover:text-blue-600 hover-glow transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;