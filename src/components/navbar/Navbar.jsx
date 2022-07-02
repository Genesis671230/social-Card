import { Switch } from '@mui/material';
import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthorizationContext } from '../../context/AuthContext';
import { DarkModeContext } from '../../context/darkModeContext';
import peach from './peach.svg';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AiFillDashboard, AiFillHome, AiOutlineLogin } from 'react-icons/ai';
import { FiSun } from 'react-icons/fi';
import { BiLogOut, BiPen, BiUser, BiUserPlus } from 'react-icons/bi';

export default function Navbar() {
  const [openDG, setOpenDG] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { darkMode, dispatch } = useContext(DarkModeContext);
  const { currentUser, authDispatch } = useContext(AuthorizationContext);
  const sideBarRef = useRef();
  const toggleSideBar = () => {
    if (sideBarRef.current.classList.contains('translate-x-96')) {
      sideBarRef.current.classList.remove('translate-x-96');
      sideBarRef.current.classList.add('translate-x-0');
    } else if (sideBarRef.current.classList.contains('translate-x-0')) {
      sideBarRef.current.classList.remove('translate-x-0');
      sideBarRef.current.classList.add('translate-x-96');
    }
  };

  const ClickCloseSideNav = () => {
    sideBarRef.current.classList.remove('translate-x-0');
    sideBarRef.current.classList.add('translate-x-96');
  };

  const handleClickOpen = () => {
    setOpenDG(true);
  };

  const handleClose = () => {
    setOpenDG(false);
  };
  const handleCloseLogout = () => {
    authDispatch({ type: 'LOGOUT' });
    navigate('/');
    setOpenDG(false);
  };

  const navigate = useNavigate();
  const LogoutUser = () => {
    handleClickOpen();
  };
  return (
    <div>
      <header className="bg-gray-700 w-[100vw]">
        <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
          <Dialog
            fullScreen={fullScreen}
            open={openDG}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {'Logout confirmation'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure want to logout?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                No
              </Button>
              <Button onClick={handleCloseLogout} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>

          <div className="flex items-center justify-between h-16">
            <div className="md:flex md:items-center md:gap-12">
              <Link to="/" className="link block text-teal-300">
                <span className="sr-only">Home</span>
                <img className="w-20 object-contain" src={peach} alt="" />
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-labelledby="header-navigation">
                <h2 className="sr-only" id="header-navigation">
                  Header navigation
                </h2>

                <ul className="flex items-center gap-6 text-sm">
                  {currentUser && (
                    <li>
                      <Link
                        to="/dashboard"
                        className="text-white text-xl transition hover:text-white/75 flex"
                      >
                        <AiFillDashboard className="h-6 w-6 text-white mr-1 " />{' '}
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {currentUser && (
                    <li>
                      <Link
                        to="/edit"
                        className="link text-white text-xl transition hover:text-white/75 flex"
                      >
                        <BiPen className="h-6 w-6 text-white mr-1 " /> Edit
                        Profile
                      </Link>
                    </li>
                  )}

                  <li>
                    {currentUser && (
                      <div
                        className="link text-white text-xl transition hover:text-white/75 flex cursor-pointer"
                        onClick={LogoutUser}
                      >
                        <BiLogOut className="h-6 w-6 text-white mr-1 " /> LogOut
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:gap-4 sm:flex">
                {!currentUser && (
                  <Link
                    to="/login"
                    className="link flex px-10 py-2.5 text-lg font-semibold text-white bg-red-600 rounded-md shadow hover:bg-red-500"
                  >
                    LOGIN <AiOutlineLogin className="ml-2 h-6 w-6 text-white" />
                  </Link>
                )}

                {!currentUser && (
                  <div className="hidden sm:flex">
                    <Link
                      to="/signup"
                      className="flex px-10 py-2.5 text-lg font-semibold text-black bg-white rounded-md shadow hover:bg-gray-200"
                    >
                      REGISTER
                      <BiUserPlus className="ml-2 h-6 w-6 text-black" />
                    </Link>
                  </div>
                )}
              </div>
              <div className="hidden sm:flex ml-8">
                <FiSun className="h-8 w-6 text-white" />
                <Switch
                  checked={darkMode}
                  sx={{ color: 'cyan' }}
                  onChange={() => dispatch({ type: 'TOGGLE' })}
                />
              </div>

              <div className="block md:hidden">
                <button
                  className="p-2 text-white transition bg-gray-800 rounded hover:text-white/75"
                  onClick={toggleSideBar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>

              <section
                className="fixed inset-y-0 right-0 z-50 flex translate-x-96 transition-all"
                ref={sideBarRef}
              >
                <div className="w-screen max-w-sm">
                  <div className="flex flex-col h-full divide-y divide-gray-200 bg-gray-800">
                    <div className="overflow-y-scroll">
                      <header className="flex items-center justify-between h-16 pl-6">
                        <span className="text-sm font-medium tracking-widest uppercase">
                          <img
                            className="w-20 object-contain"
                            src={peach}
                            alt=""
                          />
                        </span>

                        <button
                          aria-label="Close menu"
                          className="w-16 h-16 border-l border-gray-200"
                          type="button"
                          onClick={toggleSideBar}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 mx-auto text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </header>

                      <nav className="flex flex-col text-sm font-medium text-gray-500 border-t border-b border-gray-200 divide-y divide-gray-200">
                        <Link
                          to="/"
                          className="px-6 py-3 flex hover:bg-gray-400 text-white"
                          onClick={ClickCloseSideNav}
                        >
                          <AiFillHome className="w-5 h-5 mr-3 " /> Home
                        </Link>
                        {!currentUser && (
                          <Link
                            to="/login"
                            className="px-6 py-3 flex hover:bg-gray-400 text-white"
                            onClick={ClickCloseSideNav}
                          >
                            <AiOutlineLogin className="w-5 h-5 mr-3" /> Login
                          </Link>
                        )}
                        {!currentUser && (
                          <Link
                            to="/signup"
                            className="px-6 py-3 flex hover:bg-gray-400 text-white"
                            onClick={ClickCloseSideNav}
                          >
                            <BiUserPlus className="w-5 h-5 mr-3" /> Register
                          </Link>
                        )}
                        {currentUser && (
                          <Link
                            className="px-6 py-3 flex hover:bg-gray-400 hover:text-white"
                            to="/dashboard"
                            onClick={ClickCloseSideNav}
                          >
                            <AiFillDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                          </Link>
                        )}
                        {currentUser && (
                          <a
                            className="px-6 py-3 flex hover:bg-gray-400 hover:text-white"
                            href=""
                            onClick={LogoutUser}
                          >
                            <BiUserPlus className="w-5 h-5 mr-3" /> LogOut
                          </a>
                        )}

                        {currentUser && (
                          <Link
                            className="px-6 py-3 flex hover:bg-gray-400 hover:text-white"
                            to="/edit"
                            onClick={ClickCloseSideNav}
                          >
                            <BiPen className="w-5 h-5 mr-3" /> Edit Profile
                          </Link>
                        )}

                        <div className="flex px-6 py-3">
                          <FiSun className="h-8 w-6 text-white animate-spin" />
                          <Switch
                            checked={darkMode}
                            onChange={() => dispatch({ type: 'TOGGLE' })}
                          />
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
