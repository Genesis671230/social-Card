import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthorizationContext } from '../../context/AuthContext';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import userIcon from '../../Icons/General/user.svg';
import phoneIcon from '../../Icons/General/phone.svg';
import emailIcon from '../../Icons/General/email.svg';
import locationIcon from '../../Icons/General/location.svg';
import websiteIcon from '../../Icons/General/website.svg';
import calenderIcon from '../../Icons/General/calendar.svg';
import plusIcon from '../../Icons/General/plus.svg';
import minusIcon from '../../Icons/General/minus.svg';
import { DarkModeContext } from '../../context/darkModeContext';
import VCard from 'vcard-creator';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';
export default function Vcard() {
  const [data, setData] = useState({});
  const [phone, setPhone] = useState([]);
  const [email, setEmail] = useState([]);
  const [per, setPer] = useState(null);
  const [open, setOpen] = useState(false);

  const [vcardLink, setVCARDLink] = useState();
  const [disablebtn, setdisablebtn] = useState(false);
  const handlePhonePlus = (e) => {
    setPhone((prev) => [...prev, prev.length]);
  };

  const handlePhoneMinus = () => {
    setPhone([]);
  };

  const handleEmailPlus = (e) => {
    setEmail((prev) => [...prev, prev.length]);
  };

  const handleEmailMinus = () => {
    setEmail([]);
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
        vcard: data,
      });
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      navigate('/social');
    } catch (err) {
      setOpen(false);
      console.log(err);
    }
  };
  const handleDelete = async (e) => {
    setOpen(true);
    try {
      await deleteDoc(doc(db, 'users', currentUser.user));
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
    try {
      const user = auth.currentUser;
      await deleteUser(user);
      authDispatch({ type: 'LOGOUT' });
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      navigate('/');
    } catch (error) {
      setOpen(false);
      console.log(error);
    }

    navigate('/');
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setdisablebtn(false);
  //   }, 4000);
  // }, [disablebtn]);

  return (
    <div className={` ${darkMode ? 'bg-gray-900' : 'bg-white'}  h-[200vh]`}>
      <Backdrop
        sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-red-600 sm:text-3xl">
            Build up your V-Card!
          </h1>

          <p
            className={`${
              darkMode ? 'text-white' : 'text-black'
            } max-w-md mx-auto mt-4 text-center`}
          >
            Please provide here the necessary info about your V-Card.
          </p>

          <form
            onSubmit={handleSubmit}
            className="p-8 mt-6 mb-0 space-y-4 rounded-lg bg-gray-100 shadow-2xl"
          >
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  id="name"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your name."
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="tel"
                  id="phone"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your phone."
                  onChange={handleInputs}
                />
                <div className="flex space-x-2">
                  <div
                    onClick={handlePhonePlus}
                    className="flex cursor-pointer absolute right-8 top-[10px] w-8"
                  >
                    <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                  </div>
                  <div
                    onClick={handlePhoneMinus}
                    className="flex cursor-pointer absolute right-2 top-[10px] w-8 z-20"
                  >
                    <AiOutlineMinusSquare className="text-3xl hover:text-red-600" />
                  </div>
                </div>
              </div>
            </div>
            {phone.length !== 0 &&
              phone.map((phone) => {
                return (
                  <div key={phone}>
                    <input
                      onChange={handleInputs}
                      className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                      type="tel"
                      placeholder="Phone"
                      id={`phone${phone}`}
                    />
                  </div>
                );
              })}
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="email"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your email."
                  onChange={handleInputs}
                />
                <div className="flex space-x-2">
                  <div
                    onClick={handleEmailPlus}
                    className="flex cursor-pointer absolute right-8 top-[10px] w-8"
                  >
                    <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                  </div>
                  <div
                    onClick={handleEmailMinus}
                    className="flex cursor-pointer absolute right-2 top-[10px] w-8 z-20"
                  >
                    <AiOutlineMinusSquare className="text-3xl hover:text-red-600" />
                  </div>
                </div>
              </div>
            </div>
            {email.length !== 0 &&
              email.map((email) => {
                return (
                  <div key={email}>
                    <input
                      onChange={handleInputs}
                      className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                      type="text"
                      placeholder="Email"
                      id={`email${email}`}
                    />
                  </div>
                );
              })}

  
            <div>
              <label htmlFor="street" className="text-sm font-medium">
                street
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="street"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your street"
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div>
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="city"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your city name."
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div>
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="state"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your state name."
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div>
              <label htmlFor="zipcode" className="text-sm font-medium">
                Zip Code
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="zipcode"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your zip code."
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="country"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your country name."
                  onChange={handleInputs}
                />
              </div>
            </div>


            <div>
              <label htmlFor="website" className="text-sm font-medium">
                Website
              </label>

              <div className="relative mt-1">
                <input
                required
                  type="text"
                  id="website"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your website."
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div>
              <label htmlFor="birthdate" className="text-sm font-medium">
                Birthdate:
              </label>

              {disablebtn && (
                <>
                <p
                     className="block w-full  pt-3 text-sm font-medium text-red-600 rounded-lg "
                >User must be 13 years old to use this product</p>
                </>
              )}

              <div className="relative mt-1">
                <input
                required
                  type="date"
                  onInput= { (input) => {
                    var currentYear= new Date().getFullYear();
                    const sec= parseInt(input.target.value)
                    const res = currentYear - sec

                    if(res >= 13){
                      setdisablebtn(false);
                    }else{
                      setdisablebtn(true)
                    }
                  }}
                  id="birthdate"
                  className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                  placeholder="Enter your birthdate."
                  onChange={handleInputs}
                />
              </div>
             
            </div>

            <button
            disabled={disablebtn}
              type="submit"
              className={disablebtn ?  `cursor-not-allowed  block w-full px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg  hover:bg-green-500` :  `block w-full px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-500` }
            >
              Next
            </button>
            <button
              onClick={handleDelete}
              className="block w-full px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
