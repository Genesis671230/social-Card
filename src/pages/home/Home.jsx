import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import peach from '../../components/navbar/peach.svg';
import {
  AiFillDashboard,
  AiFillIdcard,
  AiOutlineLogin,
  AiOutlineRocket,
} from 'react-icons/ai';
import { BiUserPlus } from 'react-icons/bi';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthorizationContext } from '../../context/AuthContext';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthorizationContext);

  useEffect(() => {
    const handleToggle = () => {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    };
    handleToggle();
  }, []);

  return (
    <section>
      <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className={`${
          darkMode ? 'bg-black' : ''
        } absolute top-[4rem] flex justify-center items-center w-[100vw] h-[100vh]`}
      >
        <div className="max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex ">
          <div className="max-w-xl mx-auto text-center">
            <h1
              className={`text-2xl font-extrabold sm:text-5xl ${
                darkMode ? 'text-white' : 'text-black'
              } `}
            >
              Time To Network,
              <strong className="flex font-extrabold text-red-700 sm:block">
                Upgrade Your &nbsp;
                <div className="flex h-16">
                  Business Card
                  <AiFillIdcard className=" ml-1 hidden sm:block" />
                </div>
              </strong>
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {!currentUser && (
                <Link to="/login"
                  className="link flex w-full px-14 py-4 text-sm font-bold text-white bg-red-600 rounded shadow sm:w-auto active:bg-red-500 border-2 hover:bg-red-700 focus:outline-none focus:ring"
       
                >
                  Login
                  <AiOutlineLogin className="ml-2 h-6 w-6 text-white" />
                </Link>
              )}
              {currentUser && (
                <Link to="/dashboard"
                  className="link flex w-full px-14 py-4 text-sm font-bold text-white bg-red-600 rounded shadow sm:w-auto active:bg-red-500 border-2 hover:bg-red-700 focus:outline-none focus:ring"
                  
                >
                  Dashboard
                  <AiFillDashboard className="ml-2 h-6 w-6 text-white" />
                </Link>
              )}

              {!currentUser && (
                <Link to="/signup"
                  className="link flex w-full px-14 py-4 text-sm font-bold bg-gray-300 shadow-xl text-black rounded sm:w-auto hover:bg-gray-200 border-2 border-white active:text-red-500 focus:outline-none focus:ring"
       
                >
                  Register
                  <BiUserPlus className="ml-2 h-6 w-6 text-black" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
