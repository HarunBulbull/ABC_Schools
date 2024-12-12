

import MainLayout from './MainLayout.jsx';
import StudentLayout from './StudentLayout.jsx';
import LoginLayout from './LoginLayout.jsx';
import ContactLayout from './ContactLayout.jsx';
localStorage.setItem("user", JSON.stringify({ID: "{ce7d9103-49ae-ef11-8147-bc97e1afd933}", profile: "StudentContact", sub: "bdaa7e36"}))
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
export const Layout = user ? (user.profile.toLowerCase() === "student" ? StudentLayout : (
    user.profile.toLowerCase() === "studentcontact" ? ContactLayout : MainLayout)
) : LoginLayout;