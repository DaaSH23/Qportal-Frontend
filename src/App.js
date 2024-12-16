import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './pages/login';
import Singup from './pages/SignUp';
import MultiLevelSidebar from './components/Sidebar.js';
import Home from './pages/Home.js';

import { StickyNavbar } from './components/Navbar.js';
import { Breadcrumb } from './components/BreadCrumbs.js';
import { AppProvider } from './utils/context.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Router>
      <AppProvider>
        <Routes>
          <Route path='/Login' element={<Login />} />
          <Route path='/Signup' element={<Singup />} />
          <Route path='/home/*' element={<Home />}/>
        </Routes>
        </AppProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
