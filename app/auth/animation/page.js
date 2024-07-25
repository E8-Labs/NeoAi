'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
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
            style={{ position: 'absolute', marginTop: "20%", marginLeft: "30%", width: '30%', height: '20%', background: 'lightblue', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div>
              <h2>Box 1</h2>
              <button onClick={handleContinue}>Continue</button>
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
            style={{ position: 'absolute', marginTop: "20%", marginLeft: "30%", width: '30%', height: '20%', background: 'lightgreen', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            style={{ position: 'absolute', marginTop: "20%", marginLeft: "30%", width: '30%', height: '20%', background: 'lightcoral', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            style={{ position: 'absolute', marginTop: "20%", marginLeft: "30%", width: '30%', height: '20%', background: 'lightyellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            style={{ position: 'absolute', marginTop: "20%", marginLeft: "30%", width: '30%', height: '20%', background: 'lightpink', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
