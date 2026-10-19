import './App.css'

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import Services from './pages/Services'
import Tracking from './pages/Tracking'
import About from './pages/About'
import Blog from './pages/Blog'
import Login from './pages/Login'

import CustomerDashboard
  from './pages/CustomerDashboard'

import LogisticsAdminDashboard
  from './pages/LogisticsAdminDashboard'


function AppContent() {
  const location = useLocation()

  const isCustomerDashboard =
    location.pathname.startsWith(
      '/dashboard'
    )

  const isAdminDashboard =
    location.pathname.startsWith(
      '/admin'
    )

  const isInternalDashboard =
    isCustomerDashboard ||
    isAdminDashboard


  return (
    <>
      {!isInternalDashboard && (
        <Header />
      )}


      <main>

        <Routes>

          {/* ==============================
              PUBLIC WEBSITE
          ============================== */}

          <Route
            path="/"
            element={<Home />}
          />


          <Route
            path="/services"
            element={<Services />}
          />


          <Route
            path="/tracking"
            element={<Tracking />}
          />


          <Route
            path="/about"
            element={<About />}
          />


          <Route
            path="/blog"
            element={<Blog />}
          />


          <Route
            path="/login"
            element={<Login />}
          />


          {/* ==============================
              CUSTOMER DASHBOARD
          ============================== */}

          <Route
            path="/dashboard/*"
            element={
              <CustomerDashboard />
            }
          />


          {/* ==============================
              LOGISTICS ADMIN
          ============================== */}

          <Route
            path="/admin/*"
            element={
              <LogisticsAdminDashboard />
            }
          />

        </Routes>

      </main>


      {!isInternalDashboard && (
        <Footer />
      )}
    </>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}


export default App