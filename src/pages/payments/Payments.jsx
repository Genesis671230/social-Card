import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthorizationContext } from '../../context/AuthContext';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import venmoIcon from '../../Icons/Payment/venmo.svg';
import cashIcon from '../../Icons/Payment/cashApp.svg';
import minusIcon from '../../Icons/General/minus.svg';
import plusIcon from '../../Icons/General/plus.svg';
import { DarkModeContext } from '../../context/darkModeContext';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { SiVenmo, SiCashapp } from 'react-icons/si';

import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
export default function Payments() {
  const [data, setData] = useState({});
  const [ven, setVen] = useState([]);
  const [cash, setCash] = useState([]);
  const [open, setOpen] = useState(false);

  const handleVenPlus = (e) => {
    setVen((prev) => [...prev, prev.length]);
  };

  const handleVenMinus = () => {
    setVen([]);
  };
  const handleCashPlus = (e) => {
    setCash((prev) => [...prev, prev.length]);
  };

  const handleCashMinus = () => {
    setCash([]);
  };

  const handleInputs = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const { currentUser, authDispatch } = useContext(AuthorizationContext);
  const { darkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setOpen(true);
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', currentUser.user), {
        payments: data,
      });
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      navigate('/login');
    } catch (err) {
      setOpen(false);
      console.log(err);
    }
  };

  const handleDelete = async (e) => {
    setOpen(true);
    try {
      await deleteDoc(doc(db, 'users', currentUser.email));
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
    try {
      const user = auth.currentUser;
      await deleteUser(user);
      authDispatch({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setOpen(false);
    }, 3000);
    authDispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <div className={` ${darkMode ? 'bg-slate-900' : 'bg-white'}  h-screen`}>
      <Backdrop
        sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="px-4 py-16  sm:px-6 lg:px-8">
        <div className="flex items-center justify-center w-[95vw] flex-col">
          <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
            Payment Accounts
          </h1>

          <p
            className={`max-w-md mx-auto mt-4 text-center ${
              darkMode ? 'text-white' : 'text-gray-500'
            }`}
          >
            If you want to accept mobile payments, enter that information here! This step is
            completely optional!
          </p>

          <form
            onSubmit={handleSubmit}
            className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl bg-white w-[100vw] sm:w-[60vw]"
          >
            {/* Venmo */}

            <div>
              <label
                htmlfor="venmo"
                className="text-lg font-medium flex p-2 items-center"
              >
                <SiVenmo className="text-3xl text-blue-500 mr-1" /> Venmo
              </label>

              <div className="relative mt-1">
                <input
                 defaultValue="https://account.venmo.com/u/username"
                 type="text"
                 id="venmo"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="https://www.venmo.com/username"
                  onChange={handleInputs}
                />
                <div className="flex space-x-2">
                  <div
                    onClick={handleVenPlus}
                    className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                  >
                    <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                  </div>
                </div>

                {}

                {ven.length !== 0 &&
                  ven.map((ven) => {
                    return (
                      <div
                        className="relative flex items-center gap-3 flex-col"
                        key={ven}
                      >
                        <input
                          type="text"
                          defaultValue="https://account.venmo.com/u/username"
                          
                          className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                          placeholder="https://www.venmo.com/username"
                          onChange={handleInputs}
                          id={`venmo${ven}`}
                        />
                        <div className="flex space-x-2">
                          <div
                            onClick={handleVenMinus}
                            className="flex cursor-pointer absolute right-4 top-[17px] w-8"
                          >
                            <AiOutlineMinusSquare className="text-3xl hover:text-red-600" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* CashApp */}
            <div>
              <label
                htmlfor="cashapp"
                className="text-lg font-medium flex p-2 items-center"
              >
                <SiCashapp className="text-xl text-black mr-1" /> CashApp
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  defaultValue=" https://cash.app/$username"
                  id="cashapp"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="https://www.cashapp.com/username"
                  onChange={handleInputs}
                />
                <div className="flex space-x-2">
                  <div
                    onClick={handleCashPlus}
                    className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                  >
                    <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                  </div>
                </div>

                {cash.length !== 0 &&
                  cash.map((cash) => {
                    return (
                      <div
                        className="relative flex items-center gap-3 flex-col"
                        key={cash}
                      >
                        <input
                          type="text"
                          defaultValue=" https://cash.app/$username"
                          className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                          placeholder="https://www.cashapp.com/username"
                          onChange={handleInputs}
                          id={`cashapp${cash}`}
                        />
                        <div className="flex space-x-2">
                          <div
                            onClick={handleCashMinus}
                            className="flex cursor-pointer absolute right-4 top-[17px] w-8"
                          >
                            <AiOutlineMinusSquare className="text-3xl hover:text-red-600" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <button
              type="submit"
              className="block w-full px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg border border-black hover:bg-green-500"
            >
              FINISH
            </button>
            <button
              type="submit"
              onClick={handleDelete}
              className="block w-full px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg border border-black hover:bg-red-500"
            >
              CANCEL
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
