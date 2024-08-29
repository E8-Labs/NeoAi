'use client'
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';
import { Box, Button, Checkbox, CircularProgress, Grid, Modal, TextareaAutosize, TextField } from '@mui/material';
import Apis from '@/public/Apis/Apis';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const boxVariants = {


  //code for animation starts
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: (direction) => ({
    y: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  }),
};
//animation ends here

const AnimatedForm = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [appIdea, setAppIdea] = useState('');
  const [audienceName, setAudienceName] = useState('');
  const [appName, setAppName] = useState('');
  const [founders, setFounders] = useState([]);
  const [addFounder, setAddFounder] = useState(false);
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [role, setRole] = useState('');
  const [AddFounderError, setAddFounderError] = useState(false);
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState('');
  const [saveWorkLoader, setSaveWorkLoader] = useState(false);
  const [showSaveWorkError, setShowSaveWorkError] = useState(false);
  const [founderContinueLoader, setFounderContinueLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [rows, setRows] = useState(1);
  const [checked, setChecked] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [userEmailValidationErr, setUserEmailValidationErr] = useState(false);

  //validete to enter email only
  const validateEmail = ({ founderEmail }) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test({ founderEmail });
  };

  //Handle the checkbox change
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const LocalData = localStorage.getItem('User');
    if (LocalData) {
      const D = JSON.parse(LocalData);
      console.log("Data recieved for testing", D.data.user);
      if (founders.length === 0) {
        console.log("founders are 0");
        setFounderEmail(D.data.user.email);
        if (D.data.user.name) {
          setFounderName(D.data.user.name);
        } else {
          setFounderName("");
        }
      } else {
        setFounderEmail("");
      }
    }
  }, [])

  const handleSuggestionSelect = () => {
    setBackgroundColor('red');
  };



  //login directly
  // useEffect(() => {
  //   const Data = localStorage.getItem('User');
  //   if(Data){
  //     router.push('/chat')
  //   }
  // }, []);
  //code for inputheight
  const handleAudienceInputChange = (e) => {
    const textareaLineHeight = 24; // Adjust this value to match the line-height of your textarea
    const maxRows = 5;
    const previousRows = e.target.rows;
    e.target.rows = 1; // Reset number of rows in textarea 

    const currentRows = Math.min(Math.floor(e.target.scrollHeight / textareaLineHeight), maxRows);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    setAudienceName(e.target.value);
    setRows(currentRows);
  };

  //code for animation continue
  const handleContinue = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const styles = {
    backgroundColor: "#0F0C2D",
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    // border: "2px solid red"
  }
  //code for adding and deleting founder
  const handleAddFounder = () => {
    setAddFounder(true);
  }

  const handleSaveEmail = () => {
    if (founders.length > 0) {
      setUserEmail(founders[0].founderEmail)
    }

    console.log("function working");
  }

  // console.log("data in founders array is :", founders[0].founderEmail);

  const onClose = () => {
    setAddFounder(false);
    setShowSaveWorkError(false);
  }

  const handleSubmit = (e) => {
    if (emailValidationError === true) {
      return
    }
    if (founderName && founderEmail && role) {
      e.preventDefault();
      const newFounder = {
        id: founders.length + 1,
        founderName,
        founderEmail,
        role
      };
      setFounders([...founders, newFounder]);
      setAddFounder(false);
      setFounderName('');
      setFounderEmail('');
      setRole('');
    } else {
      setAddFounderError(true);
    }
  };

  const handleDelfounder = (itemId) => {
    setFounders(founders.filter(founders => founders.id !== itemId))
  }

  //modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // height: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
    backgroundColor: '#0F0C2D',
    color: '#ffffff'
  };

  //api call for save work
  const handleContinueClick = async () => {
    if (email.length !== 0 || password.length !== 0) {
      try {
        setSaveWorkLoader(true);
        const ApiPath = Apis.Login;
        const response = await fetch(ApiPath, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        console.log("response for checking status", response);
        if (response.ok) {
          const ApiResponse = await response.json();
          console.log('Response of login api is :', ApiResponse);
          localStorage.setItem('User', JSON.stringify(ApiResponse));
          if (ApiResponse.status === true) {

            const AuthToken = ApiResponse.data.token;
            console.log("Auth token for create project :", AuthToken);

            const response2 = await axios.post(Apis.CreateProject, {
              appIdea: appIdea,
              targettedAudience: audienceName,
              projectName: appName,
              founders: founders
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AuthToken
              }
            });
            if (response2.status === 200) {
              const Result = response2.data;
              localStorage.setItem('NewProject', JSON.stringify(Result));
              localStorage.setItem('projectDetails', JSON.stringify(Result.data));
              console.log('Response of create project API is:', Result);
              router.push('/chat');
            } else {
              console.log('Create project Response is not ok', response2);
            }
            // if (ApiResponse.message === "User registered") {
            //     router.push('/chat');
            //     localStorage.setItem('User', JSON.stringify(ApiResponse));
            // } else {
            //     console.log('User not registered');
            // }
          } else {
            console.log('Error in login api response', response);
          }
        } else if (!response.ok) {
          console.log("Response of login api is not ok :", response);
        }
      } catch (error) {
        console.error('Error occured in login api is :', error);
      } finally {
        setSaveWorkLoader(false)
      }
    } else {
      setShowSaveWorkError(true);
    }
  }

  //create project when user already logged in
  const handleFounderClick = () => {
    const data = localStorage.getItem('User')
    if (data) {
      handleContinueFounderClick();
    } else {
      handleContinue();
    }
  };

  const handleContinueFounderClick = async () => {
    const data = localStorage.getItem('User');
    // localStorage.removeItem('projectDetails')
    if (data) {
      const ParsedLocalData = JSON.parse(data);
      const AuthToken = ParsedLocalData.data.token;
      try {
        setFounderContinueLoader(true);
        const response2 = await axios.post(Apis.CreateProject, {
          appIdea: appIdea,
          targettedAudience: audienceName,
          projectName: appName,
          founders: founders
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthToken
          }
        });
        if (response2.status === 200) {
          const Result = response2.data;
          localStorage.setItem('NewProject', JSON.stringify(Result));
          localStorage.setItem('projectDetails', JSON.stringify(Result.data));
          console.log('Response of API is:', Result);
          router.push('/chat');
          // router.push('/onboarding/founders');
        } else {
          console.log('Response is not ok', response2);
        }
      } catch (error) {
        console.error("Error occured in api is:", error);
      } finally {
        setFounderContinueLoader(false);
      }
    } else {
      localStorage.setItem("createProject", JSON.stringify(CreateProject1));

      // router.push('/onboarding/savework');
    }
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }



  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence initial={false} custom={direction}>
        {currentIndex === 0 && (
          <div style={{ height: '40vh' }}>
            <motion.div
              key="box1"
              custom={direction}
              variants={boxVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1 }}
              style={styles}
            >
              <div style={{ width: "100%", paddingInline: 26, paddingTop: 18, paddingBottom: 18 }}>
                <p className="mt-2" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                  What's your app idea about
                </p>
                <div className="flex justify-center">
                  <textarea
                    rows={4}
                    value={appIdea}
                    onChange={(e) => setAppIdea(e.target.value)}
                    className="mt-4 w-11/12"
                    style={{
                      outline: 'none', border: 'none', backgroundColor: '#00000000',
                      fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                    }}
                    placeholder="Type here" />
                </div>
                <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                <div className='flex flex-row mt-6 items-center'>
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    sx={{
                      color: 'white', // Color of the checkbox when unchecked
                      '&.Mui-checked': {
                        color: 'white', // Color of the checkbox when checked
                      },
                      '&:hover': {
                        backgroundColor: 'transparent', // No background color on hover
                      },
                      '& .MuiSvgIcon-root': {
                        // border: '1px solid white', // White border
                        borderRadius: '4px', // Optional: to make the border look like a box
                      },
                    }}
                  />
                  <div style={{ fontWeight: '400', fontSize: 11, fontFamily: 'inter' }}>
                    By submitting, I consent to Hebbia's communications and acknowledge
                    my data will be handled per their Privacy Policy *
                  </div>
                </div>
                <div>
                  {
                    appIdea && checked ?
                      <Button
                        className="p-3 py-4"
                        style={{
                          height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                          backgroundColor: '#4011FA', fontFamily: 'inter', marginTop: 20
                        }}
                        onClick={handleContinue}>
                        Continue
                      </Button> :
                      <Button disabled
                        className="p-3 py-4"
                        style={{
                          height: '40px', color: '#ffffff50', fontWeight: 'medium', fontSize: 15,
                          backgroundColor: '#4011FA40', fontFamily: 'inter', marginTop: 20
                        }}
                        onClick={handleContinue}>
                        Continue
                      </Button>
                  }
                </div>
              </div>
              {/* end test */}
            </motion.div>
          </div>
        )}
        {currentIndex === 1 && (
          <div style={{ height: '50vh' }}>
            <motion.div
              key="box2"
              custom={direction}
              variants={boxVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1 }}
              style={styles}
            >
              <div style={{ width: "100%", paddingInline: 26, paddingTop: 18, paddingBottom: 18 }}>
                <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                  Who are the customers you're building this for?
                </p>
                <div className="flex justify-center mt-4">
                  {/* <textarea
                    rows={rows}
                    value={audienceName}
                    onChange={handleAudienceInputChange}
                    className="mt-4 w-11/12"
                    style={{
                      outline: 'none',
                      border: 'none',
                      backgroundColor: '#00000000',
                      fontWeight: '400', fontSize: 13,
                      resize: 'none', fontFamily: 'inter',
                      overflowY: rows >= 3 ? 'auto' : 'hidden',
                      maxHeight: `${5 * 24}px`, // Limit the height to 5 rows
                      scrollbarWidth: 'none', msOverflowStyle: 'none',
                    }}
                    placeholder="Ex: Real estate agents, fitness coaches," 
                  /> */}
                  {/* <textarea
                    rows={4}
                    className='w-full'
                    placeholder="Ex: Real estate agents, fitness coaches,"
                    value={audienceName}
                    onChange={handleAudienceInputChange}
                    style={{
                      backgroundColor: "transparent", resize: "none",
                      outline: "none", border: "none", fontWeight: '400', fontSize: 13,
                      fontFamily: "inter"
                    }}
                  /> */}
                  <TextareaAutosize
                    className='w-full'
                    minRows={4}
                    maxRows={6}
                    placeholder="Ex: Real estate agents, fitness coaches,"
                    value={audienceName}
                    onChange={handleAudienceInputChange}
                    // size="sm"
                    variant="plain"
                    style={{
                      resize: "none", backgroundColor: "transparent", border: "none", outline: "none",
                      fontWeight: '400', fontSize: 13, fontFamily: "inter",
                      scrollbarWidth: 'none', msOverflowStyle: 'none',
                    }}
                  />
                </div>
                <div className="flex flex-col gap-y-24">
                  <div style={{ height: '1px', backgroundColor: '#ffffff', }} />
                  <div className="mt-12 flex flex-row gap-8">

                    {/* add continue btn here */}
                    <Button onClick={handleBack}
                      className="p-3 py-4"
                      style={{
                        height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                        backgroundColor: '', fontFamily: 'inter'
                      }}>
                      Back
                    </Button>

                    {
                      audienceName ?
                        <Button
                          className="p-3 py-4"
                          style={{
                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                            backgroundColor: '#4011FA', fontFamily: 'inter'
                          }}
                          onClick={handleContinue}>
                          Continue
                        </Button> :
                        <Button
                          disabled
                          className="p-3 py-4"
                          style={{
                            height: '40px', color: '#ffffff50', fontWeight: 'medium', fontSize: 15,
                            backgroundColor: '#4011FA50', fontFamily: 'inter'
                          }}
                          onClick={handleContinue}>
                          Continue
                        </Button>
                    }


                  </div>
                </div>
                {/* end test */}
              </div>
            </motion.div>
          </div>
        )}
        {currentIndex === 2 && (
          <div style={{ height: '40vh' }}>
            <motion.div
              key="box3"
              custom={direction}
              variants={boxVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1 }}
              style={styles}
            >
              <div style={{ width: "100%", paddingInline: 26, paddingTop: 18, paddingBottom: 18 }}>
                <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                  What is your app name
                </p>
                <div className="flex justify-center">
                  <input
                    // rows={1}
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="mt-4 w-11/12"
                    style={{
                      outline: 'none', border: 'none', backgroundColor: '#00000000',
                      fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                    }}
                    placeholder="App name" />
                </div>
                <div className="flex flex-col gap-y-24">
                  <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                  <div className="mt-6 flex flex-row gap-8">

                    {/* add continue btn here */}
                    <Button onClick={handleBack}
                      className="p-3 py-4"
                      style={{
                        height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                        backgroundColor: '', fontFamily: 'inter'
                      }}>
                      Back
                    </Button>

                    {
                      appName ?
                        <Button
                          className="p-3 py-4"
                          style={{
                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                            backgroundColor: '#4011FA', fontFamily: 'inter'
                          }}
                          onClick={handleContinue}>
                          Continue
                        </Button> :
                        <Button
                          disabled
                          className="p-3 py-4"
                          style={{
                            height: '40px', color: '#ffffff50', fontWeight: 'medium', fontSize: 15,
                            backgroundColor: '#4011FA50', fontFamily: 'inter'
                          }}
                          onClick={handleContinue}>
                          Continue
                        </Button>
                    }


                  </div>
                </div>
                {/* end test */}
              </div>
            </motion.div>
          </div>
        )}
        {currentIndex === 3 && (
          <div style={{ height: founders.length > 6 ? "65vh" : "60vh" }}>
            <motion.div
              key="box4"
              custom={direction}
              variants={boxVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1 }}
              style={styles}
            >
              <div className="w-full"
                style={{ paddingInline: 26, paddingTop: 18, paddingBottom: 18, backgroundColor: '#0F0C2D' }}>
                <div className="mt-4 w-full flex flex-row">
                  <p className='w-8/12' style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                    Who are the founders involved?
                  </p>

                </div>
                {
                  founders.length ?
                    <div className="mt-4 flex flex-col gap-8  w-full" style={{ height: '35vh', overflow: 'auto', paddingBottom: 10, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <div className='w-full'>
                        <Grid container>
                          {
                            founders.map((item) => (
                              <div key={item.id} className="flex justify-center w-6/12 mt-4 gap-2">
                                <div className="w-full px-4 w-11/12 py-4 ms-2" style={{ border: '2px solid #ffffff35' }}>
                                  <div className="flex flex-row justify-between">
                                    <div className="flex flex-row gap-2 items-center">
                                      <p
                                        style={{
                                          fontWeight: '600', fontFamily: 'inter',
                                          fontSize: '15px'
                                        }}>
                                        {item.founderName} ,
                                      </p>
                                      <p style={{
                                        fontWeight: '400', fontFamily: 'inter',
                                        fontSize: '13px', color: '#ffffff60'
                                      }}>
                                        {item.role}
                                      </p>
                                    </div>
                                    <button onClick={() => handleDelfounder(item.id)}>
                                      <img src="/assets/deleteIcon.png" alt="delbtn" style={{ height: 'auto', width: '100%', maxWidth: '15px', resize: 'cover' }} />
                                    </button>
                                  </div>
                                  <p style={{
                                    fontWeight: '400', fontFamily: 'inter',
                                    fontSize: '13px', color: '#ffffff60'
                                  }}>
                                    {item.founderEmail}
                                  </p>
                                </div>
                              </div>
                            ))
                          }
                        </Grid>
                      </div>
                      <div className='flex justify-start items-start'>
                        {
                          founders.length > 0 && (
                            <button onClick={handleAddFounder} className="px-2 py-2"
                              style={{
                                // backgroundColor: '#4011FA',
                                borderRadius: 4, fontSize: 12,
                                fontWeight: '500', fontFamily: "inter"
                              }}>
                              {/* <img src="/assets/addIcon.png" alt="Add" style={{ height: 'auto', width: '100%', maxWidth: '12px' }} /> */}
                              <u>
                                Add Founder
                              </u>
                            </button>
                          )
                        }
                      </div>
                    </div> :
                    <div className="mt-6" style={{ height: '24vh', fontSize: 10, fontWeight: '500', color: '#ffffff' }}>
                      <button onClick={handleAddFounder}>
                        <div className="flex justify-center items-center px-4 py-2" style={{ backgroundColor: '#4011FA', borderRadius: 4 }}>
                          {/* <img src="/assets/addIcon.png" alt="Add" style={{ height: 'auto', width: '100%', maxWidth: '12px' }} /> */}
                          Add Founder
                        </div>
                      </button>
                    </div>
                }
                <div className="mt-8 flex flex-row gap-8">
                  <Button
                    onClick={handleBack}
                    className="p-3 py-4"
                    style={{
                      height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                      backgroundColor: '', fontFamily: 'inter'
                    }}>
                    Back
                  </Button>
                  {founders.length === 0 ?
                    <Button
                      // variant="disabled"
                      disabled
                      onClick={() => {
                        handleSaveEmail();
                        handleFounderClick();
                        // handleContinue();
                        // handleContinueFounderClick();
                      }}
                      className="p-3 py-4"
                      style={{
                        height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                        backgroundColor: '#4011FA', fontFamily: 'inter'
                      }}>
                      {
                        founderContinueLoader ?
                          <CircularProgress size={30} /> :
                          "Continue"
                      }
                    </Button> :
                    <Button
                      // variant="disabled"
                      onClick={() => {
                        handleSaveEmail();
                        handleFounderClick();
                        // handleContinue();
                        // handleContinueFounderClick();
                      }}
                      className="p-3 py-4"
                      style={{
                        height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                        backgroundColor: '#4011FA', fontFamily: 'inter'
                      }}>
                      {
                        founderContinueLoader ?
                          <CircularProgress size={30} /> :
                          "Continue"
                      }
                    </Button>
                  }
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {currentIndex === 4 && (
          <div style={{ height: '60vh' }}>
            <motion.div
              key="box5"
              custom={direction}
              variants={boxVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1 }}
              style={styles}
            >
              <div className='w-full'>
                <div className="w-full"
                  style={{ padding: 22, backgroundColor: '#0F0C2D' }}>
                  <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                    Save your work
                  </p>
                  <div className="flex flex-col justify-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                      }}
                      className="mt-8 w-11/12"
                      style={{
                        outline: 'none', border: 'none', backgroundColor: '#00000000',
                        fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                      }}
                      placeholder="Email Address" />
                    <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                  </div>
                  <div className='flex flex-row gap-4 items-end'>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-12 w-11/12"
                      style={{
                        outline: 'none', border: 'none', backgroundColor: '#00000000',
                        fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                      }}
                      placeholder="Password" />
                    <div>
                      <button onClick={togglePassword} className='text-white'>
                        {
                          showPassword ?
                            <img src='/assets/hidePass.png' alt='show' style={{ height: '30px', width: '30px', resize: 'cover', objectFit: '' }} /> :
                            <img src='/assets/showPass.png' alt='show' style={{ height: '27px', width: '27px', resize: 'cover', objectFit: '' }} />
                        }
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-20">
                    <div style={{ height: '1px', backgroundColor: '#ffffff', marginTop: 15 }} />
                    <div className="mt-6 flex flex-row gap-8">
                      <Button
                        onClick={handleBack}
                        className="p-3 py-4"
                        style={{
                          height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                          backgroundColor: '', fontFamily: 'inter'
                        }}>
                        Back
                      </Button>
                      {email && password ? <Button
                        onClick={handleContinueClick}
                        className="p-3 py-4"
                        style={{
                          height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                          backgroundColor: '#4011FA', fontFamily: 'inter'
                        }}>
                        {
                          saveWorkLoader ?
                            <CircularProgress size={30} /> : "Continue"
                        }
                      </Button> :
                        <Button variant="disabled"
                          className="p-3 py-4"
                          style={{
                            height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                            backgroundColor: '#4011FA50', fontFamily: 'inter'
                          }}>
                          Continue
                        </Button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Code for popup */}

      <Modal
        open={addFounder}
        onClose={onClose}
      >
        <Box sx={style}>
          <div className="w-full">
            <div className='w-full flex flex-row justify-end pe-2'>
              <button onClick={onClose}>
                <img src='/assets/cross2.png' alt='cross' style={{ height: '10px', width: '10px', resize: 'cover' }} />
              </button>
            </div>
            <div style={{ fontSize: 24, fontWeight: '500', fontFamily: 'inter' }}>
              New Founder
            </div>
            <div className="w-10/12 mt-6" style={{
              fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60'
            }}>

              {
                founders.length === 0 ?
                  <div className="w-10/12 mt-6" style={{
                    fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60'
                  }}>
                    It starts with you. Fill your personal information as a Founder
                  </div> :
                  <div className="w-10/12 mt-6" style={{
                    fontSize: 12, fontWeight: '400', fontFamily: 'inter', color: '#ffffff60'
                  }}>
                    Add additional founders to your project
                  </div>
              }

            </div>
            <div className="mt-6">
              <TextField id="standard-basic" label="Full Name" variant="standard"
                placeholder="Enter Full Name"
                value={founderName}
                onChange={(e) => {
                  setFounderName(e.target.value);
                  setAddFounderError(false);
                }}
                InputLabelProps={{
                  backgroundColor: "red"
                }}
                sx={{
                  width: '100%', // Change the width here
                  '& .MuiInputBase-root': {
                    color: 'white', // Change the text color here
                    fontWeight: '400',
                    fontSize: 13, fontFamily: 'inter'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color here
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color on hover here
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60', // Change the label color here
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff', // Change the label color when focused
                  },
                  // marginTop: 0
                }}
              />
              {
                userEmailValidationErr &&
                <div className='text-sm mt-4' style={{ fontWeight: "400", fontFamily: "inter", color: "red" }}>
                  Email not valid
                </div>
              }
              {/* <TextField
                id="standard-basic"
                label="Full Name"
                variant="standard"
                placeholder="Enter Full Name"
                value={founderName}
                onChange={(e) => {
                  setFounderName(e.target.value);
                  setAddFounderError(false);
                }}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    color: 'white',
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter',
                    backgroundColor: '#ffffff00', // Ensure background is transparent
                  },
                  '& .MuiInputBase-input': {
                    backgroundColor: '#ffffff00', // Input area background transparent
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff60',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff',
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60',
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff',
                  },
                  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input': {
                    padding: 0,
                    backgroundColor: '#ffffff00', // Transparent when autocomplete is focused
                  },
                }}
              /> */}

              {/* <TextField
                id="standard-basic"
                label="Full Name"
                variant="standard"
                placeholder="Enter Full Name"
                value={founderName}
                onChange={(e) => {
                  setFounderName(e.target.value);
                  setAddFounderError(false);
                }}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    color: 'white',
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter',
                    backgroundColor: 'transparent', // Ensure background is transparent
                  },
                  '& .MuiInputBase-input': {
                    backgroundColor: 'transparent', // Input area background transparent
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff60',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff',
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60',
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff',
                  },
                  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input': {
                    padding: 0,
                    backgroundColor: 'transparent', // Transparent when autocomplete is focused
                  },
                  '& .MuiAutocomplete-popupIndicator': {
                    color: 'white', // Ensure the popup indicator stays consistent
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    color: 'white', // Ensure the clear indicator stays consistent
                  },
                  '& .MuiAutocomplete-endAdornment': {
                    top: 'calc(50% - 12px)', // Adjust end adornment position if needed
                  },
                  '& .MuiAutocomplete-option[data-focus="true"]': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent background on focus
                  },
                  '& .MuiAutocomplete-option[aria-selected="true"]': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent background when selected
                  },
                }}
              /> */}


              <TextField id="standard-basic" label="Role" variant="standard"
                placeholder="Enter Founder Role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setAddFounderError(false);
                }}
                sx={{
                  width: '100%', // Change the width here
                  '& .MuiInputBase-root': {
                    color: 'white', // Change the text color here
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color here
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color on hover here
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60', // Change the label color here
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff', // Change the label color when focused
                  },
                  marginTop: 2
                }}
              />
              <TextField id="standard-basic" label="Email" variant="standard"
                placeholder="Enter Email"
                value={founderEmail}
                onChange={(e) => {
                  setFounderEmail(e.target.value);
                  setAddFounderError(false);
                  // setEmailValidationError(false);
                  const value = e.target.value;
                  setEmailValidationError(!validateEmail(value));
                  // if (validateEmail(e)) {
                  //   setEmailValidationError(true);
                  // } else {
                  //   setEmailValidationError(false);
                  // }
                }}
                sx={{
                  width: '100%', // Change the width here
                  '& .MuiInputBase-root': {
                    color: 'white', // Change the text color here
                    fontWeight: '400',
                    fontSize: 13,
                    fontFamily: 'inter'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color here
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#ffffff60', // Change the underline color on hover here
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#ffffff', // Change the underline color on hover here
                  },
                  '& .MuiFormLabel-root': {
                    color: '#ffffff60', // Change the label color here
                  },
                  '& .MuiFormLabel-root.Mui-focused': {
                    color: '#ffffff', // Change the label color when focused
                  },
                  marginTop: 2
                }}
              />
            </div>

            {
              emailValidationError &&
              <div className='text-sm mt-4' style={{ fontWeight: "400", fontFamily: "inter", color: "red" }}>
                Email not valid
              </div>
            }

            {
              AddFounderError &&
              <div className="mt-4" style={{ color: 'red', fontWeight: "400", fontFamily: "inter", fontSize: 13 }}>
                Email required
              </div>
            }
            <div>
              <Button onClick={handleSubmit}
                style={{ color: '#ffffff', fontWeight: '500', fontSize: 15, backgroundColor: '#4011FA', marginTop: 50 }}>
                Save Founder
              </Button>
            </div>
          </div>
        </Box>
      </Modal>


      {/* Errors */}
      <div>
        <Snackbar
          open={showSaveWorkError}
          autoHideDuration={3000}
          onClose={onClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          TransitionComponent={Slide}
          TransitionProps={{
            direction: 'left'
          }}
        >
          <Alert
            onClose={onClose} severity="error"
            sx={{ width: '30vw', fontWeight: '700', fontFamily: 'inter', fontSize: '22' }}>
            Enter all Credientials.
          </Alert>
        </Snackbar>
      </div>

    </div>
  );
};

export default AnimatedForm;
