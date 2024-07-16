import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './navbar/Homes';
import Login from './navbar/Login';
import Register from './navbar/Register';
import RootLayout from './navbar/RootLayout';
import ErrorPage from './special-setups/ErrorPage';
import VideoUpload from './navbar/VideoUpload';
import DataProtection from './footer/DataProtection';
import Profile from './navbar/Profile';
import UserProfileSearchResults from './components/UserProfileSearchResults';
import VideoAlter from './navbar/VideoAlter';
import Videos from './navbar/Videos';
import SendMessageDialog from './components/SendMessageDialog';
import PasswordReset from './components/PasswordReset';
import Inspire from './navbar/Inspire';
import InspireDisplay from './navbar/InspireDisplay';
import InspireAlter from './navbar/InspireAlter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'video-upload', element: <VideoUpload /> },
      { path: 'data-protection', element: <DataProtection /> },
      { path: 'profile', element: <Profile /> },
      { path: 'search', element: <UserProfileSearchResults /> },
      { path: 'profile/:profileId', element: <Profile /> },
      { path: 'video-alter', element: <VideoAlter /> },
      { path: 'videos', element: <Videos /> },
      { path: '/send-message/:profileId', element: <SendMessageDialog /> },
      { path: 'reset-password', element: <PasswordReset /> },
      { path: 'inspire', element: <Inspire /> },
      { path: 'inspire-display', element: <InspireDisplay /> },
      { path: 'inspire-alter', element: <InspireAlter /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
