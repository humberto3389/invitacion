import { createBrowserRouter } from 'react-router-dom';
// SubdomainRouter removed from root routes to allow Landing page at '/'
import MasterAdmin from './pages/MasterAdmin';
import Admin from './pages/Admin';
import LandingPage from './pages/LandingPage';
import TestPanel from './components/TestPanel';
import DomainDebug from './components/DomainDebug';
import ClientLoginPage from './pages/ClientLoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/admin',
    element: <MasterAdmin />,
  },
  {
    path: '/master-admin',
    element: <MasterAdmin />,
  },
  {
    path: '/login',
    element: <ClientLoginPage />,
  },
  {
    path: '/panel',
    element: <Admin />,
  },
  {
    path: '/test',
    element: <TestPanel />,
  },
  {
    path: '/debug',
    element: <DomainDebug />,
  },
]);
