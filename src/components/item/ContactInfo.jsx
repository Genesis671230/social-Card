import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { DarkModeContext } from '../../context/darkModeContext';

export default function ContactInfo({ title, downloadIcon, vcard }) {
  const { darkMode } = useContext(DarkModeContext);
  const location = useLocation();

  return (
    <div className={`w-full`}>
      <div className="text-xl ">
        <h3 class="text-4xl font-semibold leading-normal text-blueGray-700 mb-2">
          {vcard.name}
        </h3>
        <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
          <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
          {vcard.address}
        </div>
        <div>{vcard.email}</div>
      </div>
    </div>
  );
}
