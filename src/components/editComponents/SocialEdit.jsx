import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';

export default function ContactEdit({ title, social }) {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`w-full  border-2 p-5 ${
        darkMode ? 'text-white border-white' : 'text-black border-black'
      }  rounded-lg border-white`}
    >
      <div className=" flex justify-between ">
        <div className="text-xl  font-bold mb-2">{title}</div>
      </div>

      <div>{social.facebook}</div>
      <div>{social.instagram}</div>
      <div>{social.youtube}</div>
      <div>{social.twitter}</div>
      <div>{social.tiktok}</div>
    </div>
  );
}
