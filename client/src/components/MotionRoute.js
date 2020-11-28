import { Route } from 'react-router-dom';
import { motion } from 'framer-motion';

const pageVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    x: '-100vw',
    transition: { ease: 'easeInOut' },
  },
};

export const MotionRoute = ({ component, ...props }) => {
  const Component = component;

  return (
    <Route {...props}>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Component />
      </motion.div>
    </Route>
  );
};
