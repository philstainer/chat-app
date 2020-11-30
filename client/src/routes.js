import { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { PrivateRoute } from './components/PrivateRoute';
import { MotionRoute } from './components/MotionRoute';

const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const VerifyPage = lazy(() => import('./pages/Verify'));

export const Routes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch location={location} key={location.key}>
          <PrivateRoute exact path="/" component={HomePage} />

          <MotionRoute path="/login" component={LoginPage} />
          <MotionRoute path="/register" component={RegisterPage} />
          <MotionRoute path="/verify/:token" component={VerifyPage} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};
