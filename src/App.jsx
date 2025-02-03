import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar'
import MessageComposer from './components/MessageComposer/MessageComposer'
import Features from './components/Features/Features'
import FAQ from './components/FAQ/FAQ'
import Login from './components/Login/Login'
import UserProfile from './components/UserProfile/UserProfile'
import Dashboard from './components/Dashboard/Dashboard'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import MessageSection from './components/MessageSection'
import SuccessPage from './components/MessageComposer/SuccessPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <>
              <Navbar />
              <UserProfile />
            </>
          } />
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } />
          <Route path="/" element={
            <div className="min-h-screen bg-gray-900">
              <Navbar />
              <div className="pt-40">
                <MessageComposer />
                <MessageSection/>
                <Features />
                <FAQ />
              </div>
            </div>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<>
              <Navbar />
              <SuccessPage />
            </>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
