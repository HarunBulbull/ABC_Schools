import { Routes, Route } from 'react-router-dom';
import Discover from './components/discover/Discover';
import List from './components/list/List';
import BigCalendar from './components/bigcalendar/BigCalendar';
import StudentDetail from './components/studentdetail/StudentDetail';
import TeacherList from './components/teachers/List';
import TeacherDetail from './components/teacherdetail/TeacherDetail';
import Lessons from './components/studentdetail/lessons/Lessons';
import Payment from './components/contact/payment/Payment';
import Profile from './components/student/profile/profile';
import ContactProfile from './components/contact/profile/Profile';
import Program from './components/student/program/Program';
import Notes from './components/student/notes/Notes';
import Educations from './components/student/educations/Educations';
import History from './components/contact/history/History';
import Guide from './components/contact/guide/Guide';
import StudentNotes from './components/contact/studentnotes/studentnotes';
import Success from './components/contact/status/Success';
import Fail from './components/contact/status/Fail';

function App() {

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  return (
    <Routes>
      <Route path="/profil" element={user.profile.toLowerCase() === "student" ? <Profile/> : <ContactProfile/>} />
      <Route path="/notlarim" element={<Notes/>} />
      <Route path="/rehberlik" element={user.profile.toLowerCase() === "student" ? <Educations/> : <Guide/>}  />
      <Route path="/ders-programim" element={<Program/>} />
      <Route path="/kesfet" element={<Discover/>} />
      <Route path="/ogrenci-listesi" element={<List/>} />
      <Route path="/ogretmen-listesi" element={<TeacherList/>} />
      <Route path="/planlamalarim" element={<BigCalendar/>} />
      <Route path="/ogrenci/:id" element={<StudentDetail/>} />
      <Route path="/ogrenci/:id/dersler" element={<Lessons/>} />
      <Route path="/ogretmen/:id" element={<TeacherDetail/>} />
      <Route path="/not-goruntule/:id" element={user.profile.toLowerCase() === "studentcontact" && <StudentNotes/>} />
      <Route path="/odemeyap/:id" element={user.profile.toLowerCase() === "studentcontact" && <Payment/>} />
      <Route path="/odeme-gecmisi" element={user.profile.toLowerCase() === "studentcontact" && <History/>} />
      <Route path="/odeme-basarili" element={user.profile.toLowerCase() === "studentcontact" && <Success/>} />
      <Route path="/odeme-basarisiz" element={user.profile.toLowerCase() === "studentcontact" && <Fail/>} />
    </Routes>
  )
}

export default App
