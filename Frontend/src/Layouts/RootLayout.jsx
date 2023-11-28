import React from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';  
import Navbar from '../components/navbarComponent';

function RootLayout() {
  const location = useLocation();

  // Define the paths where you want to hide the Navbar
  const pathsToHideNavbar = ['/editor'];

  // Check if the current location matches any of the paths to hide the Navbar
  const hideNavbar = pathsToHideNavbar.includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}

export default RootLayout;