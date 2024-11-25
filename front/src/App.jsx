import { Routes, Route } from 'react-router-dom';
import Discover from './components/discover/Discover';
import List from './components/list/List';
import BigCalendar from './components/bigcalendar/BigCalendar';
import StudentDetail from './components/studentdetail/StudentDetail';
import TeacherList from './components/teachers/List';
import TeacherDetail from './components/teacherdetail/TeacherDetail';
import Lessons from './components/studentdetail/lessons/Lessons';
import Payment from './components/payment/Payment';
import Profile from './components/student/profile/profile';
import Program from './components/student/program/Program';
import Notes from './components/student/notes/Notes';

function App() {

  return (
    <Routes>
      <Route path="/profil" element={<Profile/>} />
      <Route path="/notlarim" element={<Notes/>} />
      <Route path="/ders-programim" element={<Program/>} />
      <Route path="/kesfet" element={<Discover/>} />
      <Route path="/ogrenci-listesi" element={<List/>} />
      <Route path="/ogretmen-listesi" element={<TeacherList/>} />
      <Route path="/planlamalarim" element={<BigCalendar/>} />
      <Route path="/ogrenci/:id" element={<StudentDetail/>} />
      <Route path="/ogrenci/:id/dersler" element={<Lessons/>} />
      <Route path="/ogretmen/:id" element={<TeacherDetail/>} />
      <Route path="/odemeyap" element={<Payment/>} />
    </Routes>
  )
}

export default App
