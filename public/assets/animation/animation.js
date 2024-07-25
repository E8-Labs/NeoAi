'use client'
import { useState } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';
import { Button } from '@mui/material';

const boxVariants = {
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

  return (
    <div style={{ position: 'relative', height: '50vh', border: '2px solid green', overflow: 'hidden' }}>
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
            <div style={{ border: '2px solid red', width: "100%" }}>
              <h2>Box 1</h2>
              <button onClick={handleContinue}>Continue</button>
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
                  // value={appName}
                  // onChange={(e) => setAppName(e.target.value)}
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

                </div>
              </div>
              {/* end test */}
            </div>
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
            <div>
              <h2>Box 2</h2>
              <button onClick={handleBack}>Back</button>
              <button onClick={handleContinue}>Continue</button>
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
            <div>
              <h2>Box 3</h2>
              <button onClick={handleBack}>Back</button>
              <button onClick={handleContinue}>Continue</button>
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
            <div>
              <h2>Box 4</h2>
              <button onClick={handleBack}>Back</button>
              <button onClick={handleContinue}>Continue</button>
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
    </div>
  );
};

export default AnimatedForm;
