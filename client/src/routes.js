import { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';

const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/Login'));

export const Routes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch location={location} key={location.key}>
          <PrivateRoute exact path="/" component={HomePage} />

          <PublicRoute path="/login" component={LoginPage} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
};
