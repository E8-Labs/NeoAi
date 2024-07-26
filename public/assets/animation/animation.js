'use client'
import { useState } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';
import { Box, Button, Modal, TextField } from '@mui/material';

const boxVariants = {


  //code for animation starts
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    y: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const AnimatedForm = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

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

  //code for animation ends

  const [appIdea, setAppIdea] = useState('');
  const [audienceName, setAudienceName] = useState('');
  const [appName, setAppName] = useState('');
  const [founders, setFounders] = useState([]);
  const [addFounder, setAddFounder] = useState(false);
  const [founderName, setFounderName] = useState('');
  const [founderEmail, setFounderEmail] = useState('');
  const [role, setRole] = useState('');
  const [AddFounderError, setAddFounderError] = useState(false);

  //code for adding and deleting founder
  const handleAddFounder = () => {
    setAddFounder(true);
  }

  const onClose = () => {
    setAddFounder(false);
  }

  const handleSubmit = (e) => {
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

  return (
    <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
      <AnimatePresence initial={false} custom={direction}>
        {currentIndex === 0 && (
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
              {/* test */}
              <p className="font-semibold" style={{ color: '#2548FD', fontSize: 10, fontFamily: 'inter', width: "100%" }}>
                ONBOARDING
              </p>
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
              <div className='mt-2' style={{ fontWeight: '400', fontSize: 11, fontFamily: 'inter' }}>
                By submitting, I consent to Hebbia's communications and acknowledge
                my data will be handled per their Privacy Policy.
              </div>
              <div>
                {
                  appIdea ?
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
        )}
        {currentIndex === 1 && (
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
              {/* test */}
              <p className="font-semibold" style={{ color: '#2548FD', fontSize: 10, fontFamily: 'inter', width: "100%" }}>
                ONBOARDING
              </p>
              <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                Who are the customers you're building this for?
              </p>
              <div className="flex justify-center">
                <textarea
                  rows={1}
                  value={audienceName}
                  onChange={(e) => setAudienceName(e.target.value)}
                  className="mt-4 w-11/12"
                  style={{
                    outline: 'none', border: 'none', backgroundColor: '#00000000',
                    fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                  }}
                  placeholder="Ex: Real estate agents, fitness coaches," />
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
        )}
        {currentIndex === 2 && (
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
              {/* test */}
              <p className="font-semibold" style={{ color: '#2548FD', fontSize: 10, fontFamily: 'inter', width: "100%" }}>
                ONBOARDING
              </p>
              <p className="mt-4" style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                What is your app name
              </p>
              <div className="flex justify-center">
                <textarea
                  rows={4}
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="mt-4 w-11/12"
                  style={{
                    outline: 'none', border: 'none', backgroundColor: '#00000000',
                    fontWeight: '400', fontSize: 13, resize: 'none', fontFamily: 'inter'
                  }}
                  placeholder="Type here" />
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
        )}
        {currentIndex === 3 && (
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
              <p className="font-semibold" style={{ color: '#2548FD', fontSize: 10, fontFamily: 'inter' }}>
                ONBOARDING
              </p>
              <div className="mt-4 flex flex-row justify-between">
                <p style={{ fontSize: 24, fontWeight: '600', fontFamily: 'inter' }}>
                  Who are the founders involved?
                </p>
                <button onClick={handleAddFounder}>
                  <div className="flex justify-center items-center" style={{ height: '40px', width: '40px', backgroundColor: '#4011FA', borderRadius: '50%' }}>
                    <img src="/assets/addIcon.png" alt="Add" style={{ height: 'auto', width: '100%', maxWidth: '12px' }} />
                  </div>
                </button>
              </div>
              {
                founders ?
                  <div className="mt-4" style={{ height: '24vh', overflow: 'auto', paddingBottom: 10, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {
                      founders.map((item) => (
                        <div key={item.id} className="flex justify-center mt-4">
                          <div className="w-full px-4 py-6" style={{ border: '2px solid #ffffff35' }}>
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
                  </div> :
                  <div className="mt-6" style={{ fontSize: 24, fontWeight: '600', color: '#ffffff' }}>
                    No Founders
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
                {founders ? <Button
                  // variant="disabled"
                  onClick={handleContinue}
                  className="p-3 py-4"
                  style={{
                    height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                    backgroundColor: '#4011FA', fontFamily: 'inter'
                  }}>
                  Continue
                </Button> :
                  <Button variant="disabled"
                    onClick={handleContinue}
                    className="p-3 py-4"
                    style={{
                      height: '40px', color: 'white', fontWeight: 'medium', fontSize: 15,
                      backgroundColor: '#4011FA50', fontFamily: 'inter'
                    }}>
                    {
                      loader ?
                        <CircularProgress size={30} /> : "Continue"
                    }
                  </Button>
                }
              </div>
            </div>
          </motion.div>
        )}
        {currentIndex === 4 && (
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
            <div>
              <h2>Box 5</h2>
              <button onClick={handleBack}>Back</button>
            </div>
          </motion.div>
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
              AddFounderError &&
              <div className="text-xs mt-4" style={{ color: 'red' }}>
                Enter all Credientials
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


    </div>
  );
};

export default AnimatedForm;
