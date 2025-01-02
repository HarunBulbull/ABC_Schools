

import MainLayout from './MainLayout.jsx';
import StudentLayout from './StudentLayout.jsx';
import LoginLayout from './LoginLayout.jsx';
import ContactLayout from './ContactLayout.jsx';
localStorage.setItem("user", JSON.stringify({ID: "{1658e25b-c70e-eb11-b7f6-a210d3859216}", profile: "studentcontact", sub: "bdaa7e36"}))
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
export const Layout = user ? (user.profile.toLowerCase() === "student" ? StudentLayout : (
    user.profile.toLowerCase() === "studentcontact" ? ContactLayout : MainLayout)
) : LoginLayout;