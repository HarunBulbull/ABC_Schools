import { Layout } from './layouts/layout.jsx';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import trTR from 'antd/es/locale/tr_TR';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={trTR}>
    <BrowserRouter>
      <Layout>
        <App />
      </Layout>
    </BrowserRouter>
  </ConfigProvider>
)
