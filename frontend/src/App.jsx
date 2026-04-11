import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateMessage from './pages/CreateMessage'
import MessageHistory from './pages/MessageHistory'
import RecipientMessage from './pages/RecipientMessage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-message" element={<CreateMessage />} />
        <Route path="/messages" element={<MessageHistory />} />
        <Route path="/m/:link" element={<RecipientMessage />} />
      </Routes>
    </Router>
  )
}

export default App
