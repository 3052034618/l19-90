import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import ClueEntryPage from '@/pages/ClueEntryPage'
import PropagationPage from '@/pages/PropagationPage'
import BriefingPage from '@/pages/BriefingPage'

export default function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/clue-entry" replace />} />
        <Route path="/clue-entry" element={<ClueEntryPage />} />
        <Route path="/propagation" element={<PropagationPage />} />
        <Route path="/briefing" element={<BriefingPage />} />
      </Routes>
    </Router>
  )
}
