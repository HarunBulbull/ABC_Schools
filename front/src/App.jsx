import { Routes, Route } from 'react-router-dom';
import Discover from './components/discover/Discover';
import List from './components/list/List';
import BigCalendar from './components/bigcalendar/BigCalendar';
import StudentDetail from './components/studentdetail/StudentDetail';

function App() {

  return (
    <Routes>
      <Route path="/kesfet" element={<Discover/>} />
      <Route path="/ogrenci-listesi" element={<List/>} />
      <Route path="/planlamalarim" element={<BigCalendar/>} />
      <Route path="/ogrenci/:id" element={<StudentDetail/>} />
    </Routes>
  )
}

export default App
