import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Dash from './pages/dash/Dash';
import Navbar from './components/navbar/Navbar';
import { AuthorizationContext } from './context/AuthContext';
import { useContext } from 'react';
import Vcard from './pages/vcard/Vcard';
import { RequireAuth } from './utils/utility';
import { DarkModeContext } from './context/darkModeContext';
import Social from './pages/social/Social';
import Payments from './pages/payments/Payments';
import Edit from './pages/edit/Edit';
import Users from './pages/users/Users';

function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dash />
              </RequireAuth>
            }
          />
          <Route path="/:id" element={<Users />} />

          <Route
            path="/vcard"
            element={
              <RequireAuth>
                <Vcard />
              </RequireAuth>
            }
          />
          <Route
            path="/social"
            element={
              <RequireAuth>
                <Social />
              </RequireAuth>
            }
          />
          <Route
            path="/payments"
            element={
              <RequireAuth>
                <Payments />
              </RequireAuth>
            }
          />
          <Route
            path="/edit"
            element={
              <RequireAuth>
                <Edit />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
