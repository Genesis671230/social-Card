import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthorizationContext } from '../../context/AuthContext';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import facIcon from '../../Icons/social/facebook.svg';
import instaIcon from '../../Icons/social/instagram.svg';
import youIcon from '../../Icons/social/youtube.svg';
import twiIcon from '../../Icons/social/twitter.svg';
import tikIcon from '../../Icons/social/tiktok.svg';
import minusIcon from '../../Icons/General/minus.svg';
import plusIcon from '../../Icons/General/plus.svg';
import calenderIcon from '../../Icons/General/calendar.svg';
import { DarkModeContext } from '../../context/darkModeContext';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  AiFillFacebook,
  AiOutlineInstagram,
  AiFillMinusSquare,
  AiOutlineMinusSquare,
  AiOutlinePlusSquare,
  AiFillYoutube,
} from 'react-icons/ai';
import { BsTwitter } from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa';
export default function Social() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [facB, setFacB] = useState([]);
  const [instaG, setInstaG] = useState([]);
  const [youT, setYouT] = useState([]);
  const [twiT, setTwiT] = useState([]);
  const [tikT, setTikT] = useState([]);

  console.log(facB);

  const handleFacPlus = (e) => {
    if (e === 'facebook') {
      setFacB((prev) => [...prev, prev.length]);
    } else if (e === 'instagram') {
      setInstaG((prev) => [...prev, prev.length]);
    } else if (e === 'youtube') {
      setYouT((prev) => [...prev, prev.length]);
    } else if (e === 'twitter') {
      setTwiT((prev) => [...prev, prev.length]);
    } else if (e === 'tiktok') {
      setTikT((prev) => [...prev, prev.length]);
    }
  };

  const handleFacMinus = (e, type) => {
    if (type === 'facebook') {
      const arr = facB.filter((key) => key !== e);
      console.log(arr);
      setFacB(arr);
    } else if (type === 'instagram') {
      const arr = instaG.filter((key) => key !== e);
      setInstaG(arr);
    } else if (type === 'youtube') {
      const arr = youT.filter((key) => key !== e);
      setYouT(arr);
    } else if (type === 'twitter') {
      const arr = twiT.filter((key) => key !== e);
      setTwiT(arr);
    } else if (type === 'tiktok') {
      const arr = tikT.filter((key) => key !== e);
      setTikT(arr);
    }
  };

  const handleInputs = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const { currentUser, authDispatch } = useContext(AuthorizationContext);
  const { darkMode } = useContext(DarkModeContext);

  const handleSubmit = async (e) => {
    setOpen(true);
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', currentUser.user), {
        social: data,
      });
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      navigate('/payments');
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
      navigate('/');
    } catch (error) {
      setOpen(false);
      console.log(error);
    }
    setTimeout(() => {
      setOpen(false);
    }, 3000);
    authDispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  console.log(data)

  return (
    <div className={` ${darkMode ? 'bg-gray-900' : 'bg-white'}  h-[200vh]`}>
      <div className="flex justify-center ">
        <Backdrop
          sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className="px-4 py-16  sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-col w-[95vw]">
            <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
              Social Accounts
            </h1>

            <p
              className={`max-w-md mx-auto mt-4 text-center ${
                darkMode ? 'text-white' : 'text-gray-500'
              }`}
            >
              Enter your social media accounts, if you do not want so, please
              click next.
            </p>

            <form
              onSubmit={handleSubmit}
              className="p-8 mt-6 mb-0 space-y-4 rounded-lg shadow-2xl bg-white w-[100vw] sm:w-[60vw]"
            >
              {/* Facebook */}

              <div>
                <label
                  htmlfor="facebook"
                  className="text-lg font-medium flex p-2 items-center"
                >
                  <AiFillFacebook className="text-xl text-blue-500 mr-1" />{' '}
                  Facebook
                </label>

                <div className="relative mt-1">
                  <input
                    type="text"
                    id="facebook"
                    defaultValue= "https://www.facebook.com/username"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="https://www.facebook.com/username"
                    onChange={handleInputs}
                  />
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleFacPlus('facebook')}
                      className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                    >
                      <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                    </div>
                  </div>


                  {facB.length !== 0 &&
                    facB.map((facB) => {
                      return (
                        <div
                          className="relative flex items-center gap-3 flex-col"
                          key={facB}
                        >
                          <input
                            type="text"
                            className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                            placeholder="https://www.facebook.com/username"
                            onChange={handleInputs}
                            defaultValue=" https://www.facebook.com/username"
                            id={`facebook${facB}`}
                          />
                          
                          <div className="flex space-x-2">
                            <div
                              onClick={() => handleFacMinus(facB, 'facebook')}
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

              {/* Instagram */}
              <div>
                <label
                  htmlfor="instagram"
                  className="text-lg font-medium flex p-2 items-center"
                >
                  <AiOutlineInstagram className="text-xl text-black mr-1" />{' '}
                  Instagram
                </label>

                <div className="relative mt-1">
                  <input
                   defaultValue=" https://www.instagram.com/username"
                    type="text"
                    id="instagram"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="https://www.instagram.com/username"
                    onChange={handleInputs}
                  />
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleFacPlus('instagram')}
                      className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                    >
                      <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                    </div>
                  </div>

                  {instaG.length !== 0 &&
                    instaG.map((instaG) => {
                      return (
                        <div
                          className="relative flex items-center gap-3 flex-col"
                          key={instaG}
                        >
                          <input
                          defaultValue=" https://www.instagram.com/username"
                            type="text"
                            className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                            placeholder="https://www.instagram.com/username"
                            onChange={handleInputs}
                            id={`instagram${instaG}`}
                          />
                          <div className="flex space-x-2">
                            <div
                              onClick={() =>
                                handleFacMinus(instaG, 'instagram')
                              }
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

              {/* Youtube */}
              <div>
                <label
                  htmlfor="youtube"
                  className="text-lg font-medium flex p-2 items-center"
                >
                  <AiFillYoutube className="text-xl text-red-600 mr-1" />{' '}
                  Youtube
                </label>

                <div className="relative mt-1">
                  <input
                  defaultValue= "https://www.youtube.com/channelID "  
                    type="text"
                    id="youtube"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="https://www.youtube.com/username"
                    onChange={handleInputs}
                  />
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleFacPlus('youtube')}
                      className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                    >
                      <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                    </div>
                  </div>

                  {}

                  {youT.length !== 0 &&
                    youT.map((youT) => {
                      return (
                        <div
                          className="relative flex items-center gap-3 flex-col"
                          key={youT}
                        >
                          <input
                            type="text"
                            defaultValue= "https://www.youtube.com/channelID"  
                            className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                            placeholder="https://www.youtube.com/username"
                            onChange={handleInputs}
                            id={`youtube${youT}`}
                          />
                          <div className="flex space-x-2">
                            <div
                              onClick={() => handleFacMinus(youT, 'youtube')}
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
              {/* Twitter  */}
              <div>
                <label
                  htmlfor="twitter"
                  className="text-lg font-medium flex p-2 items-center"
                >
                  <BsTwitter className="text-xl text-blue-600 mr-1" /> Twitter
                </label>

                <div className="relative mt-1">
                  <input
                    type="text"
                    defaultValue=" https://www.twitter.com/username"
                    id="twitter"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="https://www.twitter.com/username"
                    onChange={handleInputs}
                  />
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleFacPlus('twitter')}
                      className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                    >
                      <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                    </div>
                  </div>

                  {}

                  {twiT.length !== 0 &&
                    twiT.map((twiT) => {
                      return (
                        <div
                          className="relative flex items-center gap-3 flex-col"
                          key={twiT}
                        >
                          <input
                            defaultValue=" https://www.twitter.com/username"
                            type="text"
                            className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                            placeholder="https://www.twitter.com/username"
                            onChange={handleInputs}
                            id={`twitter${twiT}`}
                          />
                          <div className="flex space-x-2">
                            <div
                              onClick={() => handleFacMinus(twiT, 'twitter')}
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
              {/* Tiktok  */}
              <div>
                <label
                  htmlfor="tiktok"
                  className="text-lg font-medium flex p-2 items-center"
                >
                  <FaTiktok className="text-xl text-black mr-1" /> TikTok
                </label>

                <div className="relative mt-1">
                  <input
                    defaultValue=" https://www.tiktok.com/@username"
                    type="text"
                    id="tiktok"
                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                    placeholder="https://www.tiktok.com/username"
                    onChange={handleInputs}
                  />
                  <div className="flex space-x-2">
                    <div
                      onClick={() => handleFacPlus('tiktok')}
                      className="flex cursor-pointer absolute right-4 top-[10px] w-8"
                    >
                      <AiOutlinePlusSquare className="text-3xl hover:text-green-600" />
                    </div>
                  </div>

                  {}

                  {tikT.length !== 0 &&
                    tikT.map((tikT) => {
                      return (
                        <div
                          className="relative flex items-center gap-3 flex-col"
                          key={tikT}
                          >
                          <input
                          defaultValue=" https://www.tiktok.com/@username"
                            type="text"
                            className="w-full p-4 pr-12 text-sm border-gray-200 mt-2 rounded-lg shadow-sm"
                            placeholder="https://www.tiktok.com/username"
                            onChange={handleInputs}
                            id={`tikTok${tikT}`}
                          />
                          <div className="flex space-x-2">
                            <div
                              onClick={() => handleFacMinus(tikT, 'tiktok')}
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
                NEXT
              </button>
              <button
                onClick={handleDelete}
                className="block w-full px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg border border-black hover:bg-red-500"
              >
                CANCEL
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
