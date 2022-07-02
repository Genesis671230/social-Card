import React, { useContext, useEffect, useState } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { BsVimeo } from 'react-icons/bs';
import { SiCashapp, SiVenmo } from 'react-icons/si';

export default function ContactInfo({ title, payments }) {
  const [showpayments ,setShowpayments] = useState()
  const { darkMode } = useContext(DarkModeContext);

  useEffect(()=>{

    if (payments) {
      const soc = [];
      for (const value of Object.entries(payments)) {
        const arr = {};
        arr[value[0]] = value[1];
        soc.push(arr);
      }
      setShowpayments(soc) 
    }
    
  },[])


  return (

    <div className={` flex flex-row sm:flex-col space-x-2 sm:space-x-8`}>
    {showpayments && (
      <>
      <h1
        className={`font-serif text-xl sm:text-3xl ${
          darkMode ? 'text-cyan-500' : 'text-black'
        }`}
      >
        Payments:-
      </h1>
      
      {showpayments.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('venmo')){
        return(
            <>
          <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
        <span className="text-lg sm:text-2xl sm:font-bold flex ">
          <a
            href= {`https://venmo.com/${key[1]}`}
            target="_blank"
            className=" transition-all hover:scale-150"
          >
              <SiVenmo className="text-3xl text-blue-600 sm:mr-2" />
          </a>
          <div className="hidden sm:block">{key[1]}</div>
        </span>
      </div>{' '}

            </>
        )
      }})}

      {showpayments.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('cashapp')){

          
          
          return(
              <>
            <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
          <span className="text-lg sm:text-2xl sm:font-bold flex ">
            <a
              href= {`https://cash.app/${key[1]}`}
              target="_blank"
              className=" transition-all hover:scale-150"
            >
              <SiCashapp className="text-3xl text-green-600 sm:mr-2" />
            </a>
            <div className="hidden sm:block">{key[1]}</div>
          </span>
        </div>{' '}
  
              </>
          )
        } 
      })}

    

        </>
        )
      }
        </div>
  );
}
