import React, { useContext, useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { Download } from '@mui/icons-material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthorizationContext } from '../../context/AuthContext';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import ContactInfo from '../../components/item/ContactInfo';
import SocialInfo from '../../components/item/SocialInfo';
import PaymentInfo from '../../components/item/PaymentInfo';
import { DarkModeContext } from '../../context/darkModeContext';
import { BiUpload } from 'react-icons/bi';
import { AiOutlineMail } from 'react-icons/ai';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from 'firebase/auth';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Dash() {
  const [land, setLand] = useState('');
  const [file, setFile] = useState('');
  const [data, setData] = useState({});
  const [per, setPer] = useState(null);
  const [databaseData, setDatabaseData] = useState();
  const [imageList, setImagelist] = useState();
  const [errorIMG, setErrorIMG] = useState();

  const [landList, setLandlist] = useState();
  const [open, setOpen] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser, authDispatch } = useContext(AuthorizationContext);
  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = async () => {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      ) {
        setOpenProgress(true);

        const storageRef = ref(
          storage,
          `${currentUser.user ? currentUser.user : currentUser.email}/file/${
            file.name
          }`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            setPer(progress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                setData((prev) => ({ ...prev, img: downloadURL }));
                setImagelist(downloadURL);

                await updateDoc(doc(db, 'users', currentUser.email), {
                  profileImg: downloadURL,
                });
              }
            );
          }
        );
        setTimeout(() => {
          setOpenProgress(false);
        }, 3000);
      } else {
        setErrorIMG(true);
        setTimeout(() => {
          setErrorIMG(false);
        }, 3000);
      }
    };
    file && uploadFile();
  }, [file]);

  useEffect(() => {
    const uploadFile = async () => {
      if (
        land.type === 'image/jpeg' ||
        land.type === 'image/jpg' ||
        land.type === 'image/png'
      ) {
        setOpenProgress(true);
        const storageRef = ref(
          storage,
          `${currentUser.user ? currentUser.user : currentUser.email}/land/${
            land.name
          }`
        );
        const uploadTask = uploadBytesResumable(storageRef, land);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setPer(progress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                setData((prev) => ({ ...prev, img: downloadURL }));
                setLandlist(downloadURL);
                await updateDoc(doc(db, 'users', currentUser.email), {
                  bannerImg: downloadURL,
                });
              }
            );
          }
        );
        setTimeout(() => {
          setOpenProgress(false);
        }, 3000);
      } else {
        setErrorIMG(true);
        setTimeout(() => {
          setErrorIMG(false);
        }, 3000);
      }
    };
    land && uploadFile();
  }, [land]);

  useEffect(() => {
    const run = async () => {
      setOpen(true);
      try {
        const docRef = doc(db, 'users', currentUser.email);

        const query = await getDoc(docRef);
        if (query.exists()) {
          const banner = query.data();
          setDatabaseData(query.data());
          setImagelist(banner.profileImg);
          setLandlist(banner.bannerImg);
        } else {
          const user = auth.currentUser;
          await deleteDoc(doc(db, 'users', currentUser.email));
          await deleteUser(user);
          authDispatch({ type: 'LOGOUT' });
          navigate('/');
        }

        setTimeout(() => {
          setOpen(false);
        }, 500);
      } catch (error) {
        setOpen(false);
        console.log(error);
      }
    };
    run();
  }, []);

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} h-[200vh]`}>
      <Backdrop
        sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop
        sx={{
          color: 'black',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={openProgress}
      >
        <CircularProgress variant="determinate" value={per} />
      </Backdrop>

      {errorIMG && (
        <div className="absolute top-15 right-3">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Invalid Image Type.
            <br />
            <strong>Please Upload Image only in jpg or png or jpeg.</strong>
          </Alert>
        </div>
      )}

      <img
        className="mx-auto w-full sm:w-[70vw] h-[40vh] rounded-lg border-4 border-black"
        src={landList ? landList : 'assets/no-cover-img.png'}
        alt=""
      />
      <div className="cursor-pointer absolute top-[4rem] flex flex-col items-baseline justify-start w-full h-[40vh] text-white">
        <label
          htmlFor="BannerImg"
          className="flex m-2 p-2 bg-gray-600 rounded-lg cursor-pointer "
        >
          <BiUpload className="mr-1 text-xl text-white cursor-pointer " />{' '}
          Upload Cover Image
        </label>
        <input
          className="hidden"
          type="file"
          onChange={(e) => setLand(e.target.files[0])}
          id="BannerImg"
          accept="image/*"
        />
        <div className="w-[70vw] lg:w-3/12 px-4 lg:order-2 flex justify-center mx-auto ">
          <div className="relative top-20">
            <img
              className="rounded-full h-[15rem] w-[15rem] border-4 border-black"
              src={imageList ? imageList : 'assets/blank-profile-picture.webp'}
              alt=""
            />
            <div className="cursor-pointer absolute top-[2rem] w-[150px] h-[30vh] text-white">
              <label
                htmlFor="profile_img"
                className="flex m-4 p-2 bg-gray-600 rounded-lg cursor-pointer text-xs"
              >
                <BiUpload className="mr-1 text-xl text-white cursor-pointer " />{' '}
                Upload Profile
              </label>
              <input
                className="hidden"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                id="profile_img"
                accept="image/*"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="relative py-16 top-[20rem] bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div
            className={`relative flex flex-col min-w-0 break-words ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } bg-white border-4 border-gray-200 w-full mb-6 shadow-2xl rounded-lg -mt-64`}
          >
            <div className="px-6">
            {databaseData ? (
              <>
              {databaseData.vcard ? (
                <div
                  className={`${
                    darkMode ? 'text-white' : 'text-black'
                  } flex flex-col justify-center items-center`}
                >
                  {databaseData.vcard.name ? (
                    <h1 className="font-extrabold text-3xl sm:text-4xl mt-4">
                      {databaseData.vcard.name}
                    </h1>
                  ) : null}
                  {databaseData.vcard.email ? (
                    <p className="flex font-semibold text-lg sm:text-xl mt-4">
                      <AiOutlineMail className="text-2xl" />
                      <a href={"mailto:"+databaseData.vcard.email}>{databaseData.vcard.email}</a>
                      
                    </p>
                  ) : null}
                  {databaseData.vcard.city ? (
                    <p className="flex font-medium text-sm sm:text-lg mt-4">
                      City: {databaseData.vcard.city} 
                       State: {databaseData.vcard.state}
                    </p>
                  ) : null}
                </div>
              ) : null }
              </>
              ) : null }

              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  {databaseData && (
                    <div className="w-full lg:w-9/12 px-4">
                      <SocialInfo
                        title="Social Media"
                        social={databaseData.social}
                        contactInfo={databaseData.vcard}
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
  );
}
