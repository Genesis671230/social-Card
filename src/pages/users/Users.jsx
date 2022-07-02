import React, { useContext, useEffect, useState } from 'react';
import { storage, auth, db } from '../../firebase';
import { Download } from '@mui/icons-material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';
import { AuthorizationContext } from '../../context/AuthContext';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import ContactInfo from '../../components/item/ContactInfo';
import SocialInfo from '../../components/item/SocialInfo';
import PaymentInfo from '../../components/item/PaymentInfo';
import { DarkModeContext } from '../../context/darkModeContext';
import { useParams } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai';
import { BiUpload } from 'react-icons/bi';
import  FileSaver  from 'file-saver'
import { saveAs } from 'file-saver';

export default function Users() {
  const [land, setLand] = useState('');
  const [file, setFile] = useState('');
  const [data, setData] = useState({});
  const [per, setPer] = useState(null);
  const [databaseData, setDatabaseData] = useState();
  const [imageList, setImagelist] = useState();
  const [landList, setLandlist] = useState();
  const [open, setOpen] = useState(false);

  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthorizationContext);

  const params = useParams();

  const style = {
    wrapper: `h-[200vh] min-w-screen ${
      darkMode ? 'bg-gray-900' : 'bg-white text-black'
    }`,
    container: `flex pt-5 px-5 justify-center`,
    innerContainer: `w-full sm:w-2/4 grid  place-items-center gap-5`,
    main: `w-full`,
    profileBanners: `relative flex justify-center  w-full h-52 sm:h-40`,
    bannerImg: `w-full h-full object-cover border-red-700 border-2 rounded-xl`,
    bannerInputDiv: `absolute w-full h-full z-10 `,
    bannerInput: ` opacity-0 w-full  h-full`,
    profileImg: `absolute -bottom-16 h-40 w-40 z-10 
    bg-cover bg-center  rounded-full object-cover border-2 border-red-800`,
    profileInputDiv: `absolute  -bottom-16 h-40 w-40 z-10 `,
    profileInput: ` opacity-0 w-full  h-full`,
  };



  useEffect(() => {
    const handleToggle = () => {
      setOpen(true);
      const run = async () => {
     
        
        const q = query(collection(db, "users"), where("username", "==", params.id));

          const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const banner = doc.data();
            setDatabaseData(doc.data());
            setImagelist(banner.profileImg);
            setLandlist(banner.bannerImg);
        });
      };
      run();
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    };
    handleToggle();
  }, []);


  const  handleClick = (e)=> {
  
    var file = new Blob(
      [
        `BEGIN:VCARD
          VERSION:3.0
          N:${databaseData.vcard.name};;;
          FN:${databaseData.vcard.name}
          TITLE:${databaseData.vcard.name};
          EMAIL;type=INTERNET;type=pref:${databaseData.vcard.email}
          TEL'type=MAIN:${databaseData.vcard.phone}
          TEL;type=CELL;type=VOICE;type=pref:${databaseData.vcard.phone}
          ADR;type=WORK;type=pref:;;;${databaseData.vcard.street};;;
          END:VCARD
          `
      ],
      { type: "text/vcard;charset=utf-8" }
    );
    FileSaver.saveAs(file,`${databaseData.vcard.name}.vcf`,true);
        
  }




  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} h-[220vh]`}>
      <Backdrop
        sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="">
        <img
          className="mx-auto w-full sm:w-[70vw] h-[40vh] rounded-lg border-4 border-black"
          src={landList ? landList : 'assets/no-cover-img.png'}
          alt=""
        />
        <div className="cursor-pointer absolute top-[6rem] flex flex-col items-baseline justify-start w-full h-[40vh] text-white">
          <div className="w-[70vw] lg:w-3/12 px-4 lg:order-2 flex justify-center mx-auto ">
            <div className="relative top-20">
              <img
                className="rounded-full h-[15rem] w-[15rem] border-4 border-black"
                src={
                  imageList ? imageList : 'assets/blank-profile-picture.webp'
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6">
        <section className="relative py-16 top-[20rem] bg-blueGray-200">
          <div className="relative container mx-auto px-4">
            <div
              className={`relative flex flex-col min-w-0 break-words ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } bg-white border-4 border-gray-200 w-full mb-6 shadow-2xl rounded-lg -mt-64`}
            >

        <div className=" cursor-pointer p-4 flex absolute top-[10rem] sm:top-[11rem] right-1 text-xl sm:text-2xl text-red-600 ">
        <div onClick={handleClick}>Download {<Download/>}</div>
      </div>
              <div className="px-6">
                {databaseData && (

                  <div
                  className={`${
                    darkMode ? 'text-white' : 'text-black'
                  } flex flex-col justify-center items-center`}
                >
                  {' '}
                  {databaseData.vard ? 
                  <>
                  <h1 className="font-extrabold text-3xl sm:text-4xl mt-4">
                    {databaseData.vcard.name}
                  </h1>
                  <p className="flex font-semibold text-lg sm:text-xl mt-4">
                    <AiOutlineMail className="text-2xl" />
                    {databaseData.vcard.email}
                  </p>
                  <p className="flex font-medium text-sm sm:text-lg mt-4">
                    {databaseData.vcard.address}
                  </p>
                  </>
                  : null}
                  {databaseData && (
                    <>
                    <div className="pt-5 text-lg font-bold">
                      Peach Card Holder: {databaseData.vcard.name}
                     
                    </div>
                    <div className="pt-5 text-lg font-bold">
                      Email: <a href={`mailto:${databaseData.vcard.email}`}>{databaseData.vcard.email}</a> 
                     
                    </div>
                    <div className="pt-5 text-lg font-bold">
                      Phone: <a href={`tel:${databaseData.vcard.phone}`}>{databaseData.vcard.phone}</a> 
                     
                    </div>
                    <div className="pt-5 text-lg font-bold">
                      City: {databaseData.vcard.city}
                     
                    </div>
                    <div className="pt-5 text-lg font-bold">
                      State: {databaseData.vcard.state}
                     
                    </div>
                    <div className="pt-5 text-lg font-bold">
                      Country: {databaseData.vcard.country}
                     
                    </div>
                    </>
                  )}
                </div>
                    )
                  }

                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    {databaseData && (
                      <div className="w-full lg:w-9/12 px-4">
                        <SocialInfo
                          title="Social Media"
                          social={databaseData.social}
                          downloadIcon={<Download />}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    {databaseData && (
                      <div className="w-full lg:w-9/12 px-4">
                        <PaymentInfo
                          title="Payments"
                          payments={databaseData.payments}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
