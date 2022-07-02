import React, { useContext, useEffect, useState } from 'react';
import { storage, auth, db } from '../../firebase';
import { Upload } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
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
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { DarkModeContext } from '../../context/darkModeContext';
import { deleteUser, updatePassword } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { BiUpload } from 'react-icons/bi';
import { AiOutlineArrowRight } from 'react-icons/ai';
import ContactInfo from '../../components/item/ContactInfo';
import SocialInfo from '../../components/item/SocialInfo';
import PaymentInfo from '../../components/item/PaymentInfo';
import { Download, UploadFileOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import venmoIcon from '../../Icons/Payment/venmo.svg';
import cashIcon from '../../Icons/Payment/cashApp.svg';
import AlertTitle from '@mui/material/AlertTitle';
import minusIcon from "../../Icons/General/minus.svg"
import plusIcon from "../../Icons/General/plus.svg"
import facIcon from "../../Icons/social/facebook.svg"
import instaIcon from "../../Icons/social/instagram.svg"
import youIcon from "../../Icons/social/youtube.svg"
import twiIcon from "../../Icons/social/twitter.svg"
import tikIcon from "../../Icons/social/tiktok.svg"
import TextField from '@mui/material/TextField';
import { signInWithEmailAndPassword } from 'firebase/auth';




export default function Edit() {
  const [land, setLand] = useState('');
  const [file, setFile] = useState('');
  const [data, setData] = useState({});
  const [per, setPer] = useState(null);
  const [openProgress,setOpenProgress] = useState(false);
  const [databaseData, setDatabaseData] = useState();
  const [imageList, setImagelist] = useState();
  const [landList, setLandlist] = useState();
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser, authDispatch } = useContext(AuthorizationContext);
  const [dataContact, setDataContact] = useState();
  const [arrContact, setContactArr] = useState({});
  const [dataSocial, setDataSocial] = useState();
  const [arrSocial, setSocialArr] = useState({});
  const [dataPayments, setDataPayments] = useState();
  const [errorIMG, setErrorIMG] = useState();
  const [arrPayment, setPaymentArr] = useState({});
  const [open, setOpen] = useState(false);
  const [arr, setArr] = useState({});
  const [openDG, setOpenDG] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const location = useLocation();
  const navigate = useNavigate();

  const style = {
    wrapper: `h-auto ${
      darkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'
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
    const uploadFile = async () => {
      if(file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" ){
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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL)
            setData((prev) => ({ ...prev, img: downloadURL }));
            setImagelist(downloadURL);

            await updateDoc(doc(db, 'users', currentUser.email), {
              profileImg: downloadURL,
            });
          });
        }
      );
      setTimeout(() => {
        setOpenProgress(false);
      }, 3000);
    }else{
      setErrorIMG(true)
      setTimeout(() => {
        setErrorIMG(false);
      }, 3000);
    }
    };
    file && uploadFile();
  }, [file]);

  useEffect(() => {
    const uploadFile = async () => {
      if(land.type === "image/jpeg" || land.type === "image/jpg" || land.type === "image/png" ){
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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
            setLandlist(downloadURL);
            await updateDoc(doc(db, 'users', currentUser.email), {
              bannerImg: downloadURL,
            });
          });
        }
      );
      setTimeout(() => {
        setOpenProgress(false);
      }, 3000);
    }else{
      setErrorIMG(true)
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
      const docRef = doc(db, 'users', currentUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const banner = docSnap.data();
        setDatabaseData(docSnap.data());
        setImagelist(banner.profileImg);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      } else {
        console.log('No such document!');
        setOpen(false);
      }
    };
    run();
  }, []);

  const handleContactInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContactArr({ ...arrContact, [name]: value });
    setArr({ ...arr, vcard: arrContact });
  };
  const handleSocialInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSocialArr({ ...arrSocial, [name]: value });
    setArr({ ...arr, social: arrSocial });
  };
  const handlePaymentInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPaymentArr({ ...arrPayment, [name]: value });
  };

  useEffect(() => {
    setArr({
      ...arr,
      vcard: arrContact,
      social: arrSocial,
      payments: arrPayment,
    });
  }, [arrContact, arrSocial, arrPayment]);


  



  useEffect(() => {
    setOpen(true);
    if (databaseData) {
      if(databaseData.vcard ? databaseData.vcard.name : null){

        
        const dis = [];
        for (const value of Object.entries(databaseData.vcard)) {
        const arr = {};

        arr[value[0]] = value[1];
        dis.push(arr);
      }
      
      setDataContact(dis);
      console.log(dis)
      console.log(databaseData.vcard)
      
      setContactArr(databaseData.vcard);
    }
    else{
      const datARRAY = [{name:""},{ehone:""},{email:""},{street:""},{city:""},{state:""},{zipcode:""},{country:""},{website:""},{birthdate:""}]
      const dat = {name:"",ehone:"",email:"",street:"",city:"",state:"",zipcode:"",country:"",website:"",birthdate:""}
      
      setDataContact(datARRAY);
      setContactArr(dat);
    }
    
    }


    if (databaseData) {
      if(databaseData.social ? databaseData.social.facebook || databaseData.social.instagram || databaseData.social.youtube ||
        databaseData.social.twitter || databaseData.social.tiktok : null){

        const soc = [];
        for (const value of Object.entries(databaseData.social)) {
        const arr = {};
        arr[value[0]] = value[1];
        soc.push(arr);
      }
      setDataSocial(soc);
      setSocialArr(databaseData.social);
    }
    else{
        const payArrayElseFirst = [
          {facebook:""},
          
          {instagram:""},
          {youtube:""},
          {twitter:""},
          {tiktok:""}
         
        ]
        const payArrElse = {facebook:"",instagram:"",
        youtube:"",twitter:"",
        tiktok:""}
  
                    setDataSocial(payArrayElseFirst);
                    setSocialArr(payArrElse);
  
      }
    }
    

    if (databaseData) {
      if(databaseData.payments ? databaseData.payments.venmo || databaseData.payments.cashapp : null ){

        const pay = [];
        for (const value of Object.entries(databaseData.payments)) {
        const arr = {};
        arr[value[0]] = value[1];
        pay.push(arr);
      }
      setDataPayments(pay);
      setPaymentArr(databaseData.payments);
    }
    else{
      const payArrayElseFirst = [
        {venmo:""},
        {cashapp:""}
      ]
      const payArrElse = {venmo:"",
                  cashapp:""}

      setDataPayments(payArrayElseFirst);
      setPaymentArr(payArrElse);

    }
    }
    
    setArr(databaseData);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }, [databaseData]);

  const handleSubmit = async (e) => {};

  const handleSubmitSave = async (e) => {
    setOpen(true);
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', currentUser.email), {
        profileImg: imageList ? imageList : null,
        vcard: arrContact,
        payments: arrPayment,
        social: arrSocial,
      });
      setTimeout(() => {
        setOpen(false);
      }, 3000);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (e) => {
    setOpen(true);
    try {
      await deleteDoc(doc(db, 'users', currentUser.email));
      const user = auth.currentUser;
      await deleteUser(user);
      authDispatch({ type: 'LOGOUT' });
      setTimeout(() => {
        setOpen(false);
        navigate('/');
      }, 3000);


    } catch (error) {
      setOpen(false);
      console.log(error);
    }
  
  
    navigate('/');
  };

  useEffect(() => {
    const handleToggle = () => {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    };
    handleToggle();
  }, []);



  const handleClickOpen = () => {
    setOpenDG(true);
  };

  const handleClose = () => {
    setOpenDG(false);
  }


  const  [newpassEnter,setNewPassEnter] = useState()

  const handleCloseChangePass = () => {
    updatePassword(auth.currentUser, newpassEnter).then(() => {
      // Update successful.
      console.log("changed password")
    }).catch((error) => {
      // An error ocurred
      // ...
    });
    
    setOpenDG(false);
  }

  const handlenewPassword  = (e) => {
    setNewPassEnter(e.target.value)
  };



  
  const handleInputs = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value })
  }


  const [facB, setFacB] = useState([]);
  const [instaG, setInstaG] = useState([]);
  const [youT, setYouT] = useState([]);
  const [twiT, setTwiT] = useState([]);
  const [tikT,setTikT] = useState([]);
  const [venmo,setVenmo] = useState([]);
  const [cashapp,setCashapp] = useState([]);




  const handleFacPlus = (e) =>{
    if(e === "facebook"){
      setFacB(prev => [...prev, prev.length]);
    }else if(e === "instagram"){
      setInstaG(prev => [...prev, prev.length]);
    }else if(e === "youtube"){
      setYouT(prev => [...prev, prev.length]);
    }else if(e === "twitter"){
      setTwiT(prev => [...prev, prev.length]);
    }else if(e === "tiktok"){
      setTikT(prev => [...prev, prev.length]);
    }else if(e === "venmo"){
      setVenmo(prev => [...prev, prev.length]);
    }else if(e === "cashapp"){
      setCashapp(prev => [...prev, prev.length]);

    }
  }

const handleFacMinus = (e,type) =>{
  if(type === "facebook"){
    const arr = facB.filter((key)=> key !== e )
    setFacB(arr)
  }else if(type === "instagram"){
    const arr = instaG.filter((key)=> key !== e )
    setInstaG(arr)
  }else if(type === "youtube"){
    const arr = youT.filter((key)=> key !== e )
    setYouT(arr)
  }else if(type === "twitter"){
    const arr = twiT.filter((key)=> key !== e )
    setTwiT(arr)
  }else if(type === "tiktok"){
    const arr = tikT.filter((key)=> key !== e )
    setTikT(arr)
  }else if(type === "venmo"){
    const arr = venmo.filter((key)=> key !== e )
    setVenmo(arr)
  }else if(type === "cashapp"){
    const arr = cashapp.filter((key)=> key !== e )
    setCashapp(arr)
  }
  
}


const [socialInfoDeletePrompt,setsocialInfoDeletePrompt] = useState(false)
const [paymentInfoDeletePrompt,setpaymentInfoDeletePrompt] = useState(false)

const deletePayment = async() => { 
  const paymentsRef = doc(db,"users", currentUser.email);
  try{

    await updateDoc(paymentsRef, {
      payments:deleteField()
    });
    setpaymentInfoDeletePrompt(true)
  }catch(err){
    console.log(err)
  }
}

const deleteSocialMedia = async() => { 
  try{
  const paymentsRef = doc(db,"users", currentUser.email);
await updateDoc(paymentsRef, {
       social:deleteField()
  });
  setsocialInfoDeletePrompt(true)

}catch(err){
  console.log(err)
}
}

const [modelConfirmOpen,setModelConfirmOpen] = useState(false)
const [errorConfirmDeletion,seterrorConfirmDeletion] = useState(false)

const handleAccountDeleteConfirmationOpen = () => {
  setModelConfirmOpen(true);
};

const handleAccountDeleteConfirmationClose = () => {
  setModelConfirmOpen(false);
};
// const handleCloseLogout = () => {
//   handleDelete()
//   setOpenDG(false);
// };


const [deletion,setDeletion] = useState({})

const  handleVerification = async(e) => {
  const name = e.target.id
  const value = e.target.value
  setDeletion({...deletion, [name] : value})
}
 
const submitCredentionalsForDeletion = () => {

  signInWithEmailAndPassword(auth, deletion.email, deletion.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
      handleDelete()
      setModelConfirmOpen(false);
      console.log("we are passing", deletion)
      // ...
    })
    .catch((error) => {
      console.log("we are not passing", deletion)
      seterrorConfirmDeletion(true)
      setModelConfirmOpen(false);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    
  }
  useEffect(()=>{
    setTimeout(() => {
    seterrorConfirmDeletion(false)

  }, 4000);

},[errorConfirmDeletion])


  useEffect(()=>{
    setTimeout(() => {
      setsocialInfoDeletePrompt(false)

  }, 4000);

},[socialInfoDeletePrompt])
  useEffect(()=>{
    setTimeout(() => {
      setpaymentInfoDeletePrompt(false)

  }, 4000);

},[paymentInfoDeletePrompt])








  return (
    <div className={darkMode ? 'bg-gray-900' : ''}>
      
      <Backdrop
        sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="">
        <div className="">
          <Backdrop
            sx={{
              color: 'black',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
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



{/* 
          <Dialog
        fullScreen={fullScreen}
        open={openDG}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Logout confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
   
           Are you sure want to permanantely delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
          <Button onClick={submitCredentionalsForDeletion} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog> */}





          <Dialog
        fullScreen={fullScreen}
        open={openDG}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Change Password"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
   
           Please enter new password
          </DialogContentText>
          <TextField
                      autoFocus
                      className='outline-none select-none border-none '
                      margin="dense"
                      id="password"
                      label="Password"
                      onChange={handlenewPassword}
                      type="password"
                      fullWidth
                      variant="standard"
                    />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            cancel
          </Button>
          <Button onClick={handleCloseChangePass} autoFocus>
            change
          </Button>
        </DialogActions>
      </Dialog>


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
           {socialInfoDeletePrompt && (
        <div className="fixed top-5 right-3">
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            
            <br />
            <strong>Social media account details have been successsfully deleted </strong>
          </Alert>
        </div>
      )}
           {paymentInfoDeletePrompt && (
        <div className="fixed top-5 right-3">
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            
            <br />
            <strong>Payment account details have been successsfully deleted </strong>
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
                  src={
                    imageList ? imageList : 'assets/blank-profile-picture.webp'
                  }
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

          {databaseData && (
            <>
              <div
                className={`w-full mt-10 px-20 sm:px-40 py-16 ${
                  darkMode ? 'text-white border-white' : 'text-black '
                } rounded-lg border-white`}
              >
                <div className=" flex justify-between ">
                  <div
                    className={`${
                      darkMode ? 'text-cyan-500' : 'text-black'
                    } text-2xl font-bold mb-6 underline`}
                  >
                    Contact Info
                  </div>
                     <div
                   onClick={handleClickOpen}
                    className={`${
                      darkMode ? 'text-white' : 'text-black'
                    } 
                    rounded-lg
                    p-3
                    cursor-pointer
                    bg-red-600
                    text-lg font-bold mb-6 `}
                  >
                  Change Password
                  </div>
                </div>
                {dataContact && (
                  <div>
                    {dataContact.map((item,index) => {
                      const [value] = Object.entries(item);
                      return (
                        <div key={index}>
                          <form onSubmit={handleSubmit}>
                            <label className="flex text-xl text-center ml-2 font-mono">
                              <AiOutlineArrowRight className={`mr-1`} />{' '}
                              {value[0].toUpperCase()}:
                            </label>
                            <input
                              className={` ${
                                darkMode
                                  ? 'text-black'
                                  : 'text-black border-black'
                              } border-2 border-black p-2  m-2 w-full font-mono`}
                              id={value[0]}
                              name={value[0]}
                              defaultValue={value[1]}
                              onChange={handleContactInputs}
                            />
                          </form>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div
                className={`w-full px-20 sm:px-40  py-16 ${
                  darkMode
                    ? 'text-white border-white'
                    : 'text-black border-black'
                }  rounded-lg border-white`}
              >
                <div className=" flex justify-between ">
                  <div
                    className={`${
                      darkMode ? 'text-cyan-500' : 'text-black'
                    } text-2xl font-bold mb-6 underline`}
                  >
                    Social Media
                  </div>
                  <div
                   onClick={deleteSocialMedia}
                    className={`${
                      darkMode ? 'text-white' : 'text-black'
                    } 
                    rounded-lg
                    p-3
                    cursor-pointer
                    bg-red-600
                    text-lg font-bold mb-6 `}
                  >
                   Delete Social Media
                  </div>
                </div>
                {dataSocial && (
                  <div>
                    {dataSocial.map((item,index) => {
                      const [value] = Object.entries(item);
                      return (
                        <div className='relative' key={index}>
                          <form  onSubmit={handleSubmit}>
                            <label className="flex text-xl text-center ml-2 font-mono">
                              <AiOutlineArrowRight className={`mr-1`} />{' '}
                              {value[0].toUpperCase()}:
                            </label>
                            <input
                              className={` ${
                                darkMode
                                  ? 'text-black'
                                  : 'text-black border-black'
                              } border-2 border-black p-2  m-2 w-full font-mono`}
                              id={value[0]}
                              name={value[0]}
                              defaultValue={value[1]}
                              onChange={handleSocialInputs}
                            />
                              <div  onClick={()=>handleFacPlus(value[0])}  className='absolute cursor-pointer top-10 -right-10 w-8'><img  src={plusIcon} alt="" /></div>

                          { value[0] === "facebook"  && facB.length !== 0 &&
                          facB.map((phone)=>{
                            
                          return(
                            <div className='relative flex items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={facIcon} alt="" /></div>
                          <input onChange={handleSocialInputs}
                            className='border-2 outline-none w-full p-2 rounded-lg' type="text" placeholder='https://www.facebook.com/username' name={`facebook${phone}`} />
                            {facB.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'><img  src={minusIcon} alt="" /></div>
                            )}
                            </div>)})}


                          { value[0] === "instagram"  && instaG.length !== 0 &&
                          instaG.map((phone)=>{
                          return(
                            <div className='relative flex items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={instaIcon} alt="" /></div>
                          <input onChange={handleSocialInputs}
                            className='border-2 outline-none w-full p-2 rounded-lg' 
                            type="text"placeholder='https://www.instagram.com/username' name={`instagram${phone}`} />
                            {instaG.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'>
                              <img  src={minusIcon} alt="" /></div>
                            )}
                            </div>
                            )})
                            }
                          { value[0] === "youtube"  && youT.length !== 0 &&
                          youT.map((phone)=>{
                            
                          return(
                            <div className='relative flex items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={youIcon} alt="" /></div>
                          <input onChange={handleSocialInputs}
                            className='border-2 outline-none w-full p-2 rounded-lg' 
                            type="text"placeholder='https://www.youtube.com/username' name={`youtube${phone}`} />
                            {youT.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'>
                                <img  src={minusIcon} alt="" /></div>
                            )}
                            </div>
                            )}
                            
                            )
                          }
                          { value[0] === "twitter"  && twiT.length !== 0 &&
                          twiT.map((phone)=>{
                            
                          return(
                            <div className='relative flex items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={twiIcon} alt="" /></div>
                          <input onChange={handleSocialInputs}
                            className='border-2 outline-none w-full p-2 rounded-lg' 
                            type="text"placeholder='https://www.twitter.com/username' name={`twitter${phone}`} />
                            {twiT.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'>
                                <img  src={minusIcon} alt="" /></div>
                            )}
                            </div>
                            )}
                            
                            )
                          }
                          { value[0] === "tiktok"  && tikT.length !== 0 &&
                          tikT.map((phone)=>{
                            
                          return(
                            <div className='relative flex items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={tikIcon} alt="" /></div>
                          <input onChange={handleSocialInputs}
                            className='border-2 outline-none w-full p-2 rounded-lg' type="text"placeholder='https://www.tiktok.com/username' name={`tiktok${phone}`} />
                            {tikT.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'><img  src={minusIcon} alt="" /></div>
                            )}
                            </div>
                            )}
                            
                            )
                          }
                          </form>
                     
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>





              <div
                className={`w-full px-20 sm:px-40  pt-16 ${
                  darkMode
                    ? 'text-white border-white'
                    : 'text-black border-black'
                }  rounded-lg border-white`}
              >
                <div className=" flex justify-between ">
                  <div
                    className={`${
                      darkMode ? 'text-cyan-500' : 'text-black'
                    } text-2xl font-bold mb-6 underline`}
                  >
                    Payment Methods
                  </div>
                  
                  <button
                  onClick={deletePayment}
                  className={`${
                    darkMode ? 'text-white' : 'text-black'
                  } 
                  rounded-lg
                  p-3
                  cursor-pointer
                  bg-red-600
                  text-lg font-bold mb-6 `}
                >
                    Delete payment information
                  </button>
                  
                </div>
                {dataPayments && (
                  <div>
                    {dataPayments.map((item,index) => {
                      const [value] = Object.entries(item);
                      return (
                        <div className='relative' key={index}>
                          <form onSubmit={handleSubmit}>
                            <label className="flex text-xl text-center ml-2 font-mono">
                              <AiOutlineArrowRight className={`mr-1`} />{' '}
                              {value[0].toUpperCase()}:
                            </label>
                            <input
                              className={` ${
                                darkMode
                                  ? 'text-black'
                                  : 'text-black border-black'
                              } border-2 border-black p-2  m-2 w-full font-mono`}
                              id={value[0]}
                              name={value[0]}
                              defaultValue={value[1]}
                              onChange={handlePaymentInputs}
                            />
                           <div  onClick={()=>handleFacPlus(value[0])}  className='absolute cursor-pointer top-10 -right-10 w-8'><img  src={plusIcon} alt="" /></div>

                        { value[0] === "cashapp"  && cashapp.length !== 0 &&
                          cashapp.map((phone)=>{
                            
                          return(
                            <div className='relative flex  items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={cashIcon} alt="" /></div>
                          <input onChange={handlePaymentInputs}
                            className='border-2 outline-none m-5 w-full p-2 rounded-lg' type="text"placeholder='https://www.cashapp.com/username' name={`cashapp${phone}`} />
                            {cashapp.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'><img  src={minusIcon} alt="" /></div>
                            )}
                            </div>
                            )}
                            
                            )
                          }
                        { value[0] === "venmo"  && venmo.length !== 0 &&
                          venmo.map((phone)=>{
                            
                          return(
                            <div className='relative flex  items-center gap-3 ' key={phone}>
                          <div className='w-10'><img src={venmoIcon} alt="" /></div>
                          <input onChange={handlePaymentInputs}
                            className='border-2 outline-none m-5 w-full p-2 rounded-lg'  type="text"placeholder='https://www.venmo.com/username' name={`venmo${phone}`} />
                            {venmo.length - 1 === phone && (
                              <div onClick={()=>handleFacMinus(phone,value[0])} className='absolute cursor-pointer -right-10 w-8'><img  src={minusIcon} alt="" /></div>
                            )}
                            </div>
                            )}
                            
                            )
                          }


                          </form>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                className={`w-full flex items-center justify-center p-5 ${
                  darkMode ? 'text-white ' : 'text-black '
                }  `}
              >
                <div>
                  <a
                    onClick={handleSubmitSave}
                    className={`${
                      darkMode ? 'border-white' : 'border-black'
                    } cursor-pointer flex w-full px-14 py-4 m-2 text-sm font-bold text-white
                     bg-green-600 rounded shadow sm:w-auto active:bg-green-800 border-2 hover:bg-green-500 focus:outline-none focus:ring`}
                  >
                    Save Changes
                  </a>
                  <a
                    onClick={handleAccountDeleteConfirmationOpen}
                    className={`${
                      darkMode ? 'border-white' : 'border-black'
                    } cursor-pointer flex w-full px-14 py-4 m-2 text-sm font-bold text-white 
                    bg-red-600 rounded shadow sm:w-auto active:bg-red-800 border-2 hover:bg-red-500 focus:outline-none focus:ring`}
                  >
                    Delete Account
                  </a>

                  <Dialog open={modelConfirmOpen} onClose={handleAccountDeleteConfirmationClose}>
                  <DialogTitle>Confirm Account Deletion</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To permanantely delete your account, please enter your email address and password here.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      className='outline-none select-none border-none '
                      margin="dense"
                      id="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      onChange={handleVerification}
                      variant="standard"
                      />
                    <TextField
                      autoFocus
                      className='outline-none select-none border-none '
                      margin="dense"
                      id="password"
                      label="Password"
                      onChange={handleVerification}
                      type="password"
                      fullWidth
                      variant="standard"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleAccountDeleteConfirmationClose}>Cancel</Button>
                    <Button onClick={submitCredentionalsForDeletion}>Delete</Button>
                  </DialogActions>
                </Dialog>
                      {errorConfirmDeletion && (
              <div className="fixed top-5 right-3">
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Invalid credentials.
                  <br />
                  <strong>Please enter correct credentials in order to delete your account.</strong>
                </Alert>
              </div>
            )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
