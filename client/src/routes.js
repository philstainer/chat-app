import { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { PrivateRoute } from './components/PrivateRoute';
import { MotionRoute } from './components/MotionRoute';
import { MotionRedirect } from './components/MotionRedirect';

const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const VerifyPage = lazy(() => import('./pages/Verify'));
const ForgotPage = lazy(() => import('./pages/Forgot'));
const ResetPage = lazy(() => import('./pages/Reset'));

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
          <MotionRoute path="/forgot" component={ForgotPage} />
          <MotionRoute path="/reset/:token" component={ResetPage} />
          <MotionRedirect from="*" to="/" />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};
