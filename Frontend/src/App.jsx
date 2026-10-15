import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import Tracking from './pages/Tracking'
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Blog from './pages/Blog'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App