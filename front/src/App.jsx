import { Routes, Route } from 'react-router-dom';
import Discover from './components/discover/Discover';
import List from './components/list/List';

function App() {

  return (
    <Routes>
      <Route path="/kesfet" element={<Discover/>} />
      <Route path="/ogrenci-listesi" element={<List/>} />
    </Routes>
  )
}

export default App
