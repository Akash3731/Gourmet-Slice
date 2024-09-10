import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import HeroSection from "./components/Home";
import AboutSection from "./components/About";
import ContactSection from "./components/Contact";
import NavigationBar from "./components/Navbar";

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ContactSection />
      </main>
      <footer className="text-center py-4">
        <p>© 2024 Gourmet Slice. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
