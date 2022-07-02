import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { AuthorizationContext } from '../../context/AuthContext';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DarkModeContext } from '../../context/darkModeContext';

export default function Signup() {
  const [data, setData] = useState({});
  const [error, setError] = useState();
  const [open, setOpen] = useState(false);
  const { darkMode, dispatch } = useContext(DarkModeContext);

  useEffect(() => {
    const handleToggle = () => {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 500);
    };
    handleToggle();
  }, []);

  const navigate = useNavigate();
  const { currentUser, authDispatch } = useContext(AuthorizationContext);

  const handleInputs = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    
    setData({ ...data, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setOpen(true);
    try {
     
      
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await setDoc(doc(db, 'users', data.email), {
        ...data,
        timeStamp: serverTimestamp(),
      });

      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          const user = userCredential.user;
          const data = { user: user.email, uid: user.uid };
          authDispatch({ type: 'LOGIN', payload: data });
          setTimeout(() => {
                  setOpen(false);
                }, 3000);
          navigate('/vcard');
        })
        .catch((error) => {
          setOpen(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);

          console.log("we have error code ", errorCode ,"we have error meddage",errorMessage)
        });

    } catch (err) {
      setOpen(false);
      const errorSTR = {...err}
      console.log("this is error",errorSTR.code);
      setError(errorSTR.code);
    }
  };



  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);




  
  return (
    <div className={`${darkMode ? 'bg-black' : 'bg-gray-200'}  h-screen`}>
      <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && (
        <div className="absolute top-15 right-3">
          <Alert severity="error">
            <AlertTitle>Registration Error</AlertTitle>
           {error === "auth/weak-password" && (
              <>
              <div>WEAK PASSWORD</div>
            {" "} <br />
            <strong>Password must be minimum 6 charactors .</strong>
              </> 
           )}
           {error === "auth/email-already-in-use" && (
               <>
               <div>USERNAME/EMAIL ALREADY IN USE</div>
             {" "} <br />
             <strong>Please use another Username/email for registration.</strong>
               </> 
           )}

          </Alert>
        </div>
      )}

      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-red-600 sm:text-3xl">
            Get started today.
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
            <p className="text-lg font-medium">Register an account on Peach.</p>

            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="username"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your username."
                  onChange={handleInputs}
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
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>

              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your email address."
                  onChange={handleInputs}
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
                  placeholder="Create a strong password."
                  onChange={handleInputs}
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
              REGISTER
            </button>

            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link to='/login' className="link underline" >
                &nbsp;Sign In.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
