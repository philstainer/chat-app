import { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { DynamicRoute } from './components/DynamicRoute';
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
          <DynamicRoute exact path="/" component={HomePage} authenticated />

          <DynamicRoute path="/login" component={LoginPage} guest />
          <DynamicRoute path="/register" component={RegisterPage} guest />
          <DynamicRoute path="/verify/:token" component={VerifyPage} />
          <DynamicRoute path="/forgot" component={ForgotPage} guest />
          <DynamicRoute path="/reset/:token" component={ResetPage} guest />
          <MotionRedirect from="*" to="/" />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};
