import { Redirect } from 'react-router-dom';
import { motion } from 'framer-motion';

export const MotionRedirect = ({ ...props }) => (
  <motion.div exit="undefined">
    <Redirect {...props} />
  </motion.div>
);
