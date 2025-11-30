import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <HelmetProvider>
      <div className="bg-light dark:bg-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300 font-sans">
        <Helmet>
          <title>Lalith Kishore V S | Machine Learning Engineer & AI Developer</title>
          <meta name="description" content="Portfolio of Lalith Kishore V S, a Machine Learning Engineer and AI Developer specializing in intelligent systems, automation, and scalable AI solutions." />
          <meta name="keywords" content="Machine Learning, AI, Python, TensorFlow, Computer Vision, Automation, Portfolio" />
          <html lang="en" />
        </Helmet>

        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Certifications />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
