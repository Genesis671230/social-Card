import React, { useContext, useEffect, useState } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { TbSocial } from 'react-icons/tb';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';
import { FiFacebook, FiYoutube, FiTwitter } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import  FileSaver  from 'file-saver'
import VCard from 'vcard-creator'


export default function ContactInfo({ title, social,contactInfo, downloadIcon }) {
  const [showsocial ,setShowsocial] = useState()
  const { darkMode } = useContext(DarkModeContext);

  useEffect(()=>{

    if (social) {
      const soc = [];
      for (const value of Object.entries(social)) {
        const arr = {};
        arr[value[0]] = value[1];
        soc.push(arr);
      }
      setShowsocial(soc) 
    }
    
  },[])


   
  const  handleClick = (e)=> {
  
    var file = new Blob(
      [
        `BEGIN:VCARD
          VERSION:3.0
          N:${contactInfo.name};;;
          FN:${contactInfo.name}
          TITLE:${contactInfo.name};
          EMAIL;type=INTERNET;type=pref:${contactInfo.email}
          TEL'type=MAIN:${contactInfo.phone}
          TEL;type=CELL;type=VOICE;type=pref:${contactInfo.phone}
          ADR;type=WORK;type=pref:;;;${contactInfo.address};;;
          END:VCARD
          `
      ],
      { type: "text/vcard;charset=utf-8" }
    );
    FileSaver.saveAs(file,`${contactInfo.name}.vcf`,true);
        
  }



  return (
    <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-8">
      {showsocial && (<>
      <h1
        className={`font-serif text-xl sm:text-3xl ${
          darkMode ? 'text-cyan-500' : 'text-black'
        }`}
      >
        Socials:-
      </h1>

      {showsocial.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('facebook')){
        return(
            <>
          <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
        <span className="text-lg sm:text-2xl sm:font-bold flex ">
          <a
            href= {`${key[1]}`}
            target="_blank"
            className=" transition-all hover:scale-150"
          >
              <FiFacebook className="text-3xl text-blue-600 sm:mr-2" />
          </a>
          <div className="hidden sm:block">{key[1]}</div>
        </span>
      </div>{' '}

            </>
        )
      } 
    })}

      {showsocial.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('instagram')){

          
          
          return(
              <>
            <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
          <span className="text-lg sm:text-2xl sm:font-bold flex ">
            <a
              href= {`${key[1]}`}
              target="_blank"
              className=" transition-all hover:scale-150"
            >
              <BsInstagram className="text-3xl text-black sm:mr-2" />
            </a>
            <div className="hidden sm:block">{key[1]}</div>
          </span>
        </div>{' '}
  
              </>
          )
        }  
    })}
      {showsocial.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('youtube')){

          
          
          return(
              <>
            <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
          <span className="text-lg sm:text-2xl sm:font-bold flex ">
            <a
              href= {`${key[1]}`}
              target="_blank"
              className=" transition-all hover:scale-150"
            >
              <FiYoutube className="text-3xl text-red-600 sm:mr-2" />
            </a>
            <div className="hidden sm:block">{key[1]}</div>
          </span>
        </div>{' '}
  
              </>
          )
        } 
    })}
      {showsocial.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('twitter')){

          
          
          return(
              <>
            <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
          <span className="text-lg sm:text-2xl sm:font-bold flex ">
            <a
              href= {`${key[1]}`}
              target="_blank"
              className=" transition-all hover:scale-150"
            >
               <FiTwitter className="text-3xl text-blue-600 sm:mr-2" />
            </a>
            <div className="hidden sm:block">{key[1]}</div>
          </span>
        </div>{' '}
  
              </>
          )
        } 
    })}
      {showsocial.map((item) => {
        const [key,value] = Object.entries(item)
        if( key[0].startsWith('tiktok')){

          
          return(
              <>
            <div key={item} className="block sm:bg-gray-200 sm:p-4 rounded-lg sm:m-1">
          <span className="text-lg sm:text-2xl sm:font-bold flex ">
            <a
              href= {`${key[1]}`}
              target="_blank"
              className=" transition-all hover:scale-150"
            >
               <FaTiktok className="text-3xl text-blue-600 sm:mr-2" />
            </a>
            <div className="hidden sm:block">{key[1]}</div>
          </span>
        </div>{' '}
  
              </>
          )
        } 
    })}

    

   
      <div className=" cursor-pointer p-4 flex absolute top-[10rem] sm:top-[11rem] right-1 text-xl sm:text-2xl text-red-600 ">
        <div onClick={handleClick}>Download {downloadIcon}</div>
      </div>
      </>
      )}
    </div>
  );
}













