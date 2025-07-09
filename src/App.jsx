import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import VideoDownloader from './components/VideoDownloader';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<VideoDownloader />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;