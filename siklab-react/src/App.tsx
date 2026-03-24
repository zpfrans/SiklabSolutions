import { useState } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Values from './components/Values.tsx';
import Solutions from './components/Solutions.tsx';
import CoFounders from './components/CoFounders.tsx';
import Footer from './components/Footer.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <Values />
          <Solutions />
          <CoFounders />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App
