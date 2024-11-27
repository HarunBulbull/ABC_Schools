

import MainLayout from './MainLayout.jsx';
import StudentLayout from './StudentLayout.jsx';
import LoginLayout from './LoginLayout.jsx';
import ContactLayout from './ContactLayout.jsx';
localStorage.setItem("user", JSON.stringify({ID: "{54b2502c-3d6c-ef11-8147-bc97e1afd933}", profile: "Contact", sub: "56523323621"}))
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
export const Layout = user ? (user.profile.toLowerCase() === "student" ? StudentLayout : (
    user.profile.toLowerCase() === "contact" ? ContactLayout : MainLayout)
) : LoginLayout;