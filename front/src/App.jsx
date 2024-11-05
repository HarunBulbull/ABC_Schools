import { Routes, Route } from 'react-router-dom';
import Discover from './components/discover/Discover';

function App() {

  return (
    <Routes>
      <Route path="/kesfet" element={<Discover/>} />
    </Routes>
  )
}

export default App
