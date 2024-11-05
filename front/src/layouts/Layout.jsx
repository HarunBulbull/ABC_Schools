

import MainLayout from './MainLayout.jsx';
import LoginLayout from './LoginLayout.jsx';
const hrf = window.location.href

export const Layout = hrf.includes('/login') ? LoginLayout : MainLayout;