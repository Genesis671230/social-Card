import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthorizationContext } from '../../context/AuthContext';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DarkModeContext } from '../../context/darkModeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);
  const { darkMode, dispatch } = useContext(DarkModeContext);



  const { authDispatch } = useContext(AuthorizationContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setOpen(true);
    e.preventDefault();
    try {

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const res = userCredential.user;
      await authDispatch({ type: 'LOGIN', payload: res });
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      navigate('/dashboard');
    } catch (error) {
      setOpen(false);
      setError(true);
    }
  };


  useEffect(() => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 500);
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);


 

  return (
    <div className={`${darkMode ? 'bg-black' : 'bg-gray-200'}  h-screen` }>
      <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {error && (
        <div className="absolute top-15 right-3">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Invalid credentials.
            <br />
            <strong>Please enter correct credentials.</strong>
          </Alert>
        </div>
      )}
      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-red-600 sm:text-3xl">
            Welcome Back!
          </h1>

          <p
            className={`${
              darkMode ? 'text-white' : 'text-black'
            } max-w-md mx-auto mt-4 text-center`}
          >
            Peach - Upgrade Your Business Card.
          </p>

          <form
            onSubmit={handleSubmit}
            className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl bg-white"
          >
            <p className="text-lg font-medium">Sign in to your account.</p>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="email"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <span className="absolute inset-y-0 inline-flex items-center right-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  type="password"
                  id="password"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span className="absolute inset-y-0 inline-flex items-center right-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="block w-full px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500"
            >
              SIGN IN
            </button>

            <p className="text-sm text-center text-gray-500">
              No account?{" "}
              <Link to='/signup' className="link underline" >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
