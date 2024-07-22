import React, { useState, createContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./navbar/Homes";
import Login from "./navbar/Login";
import Register from "./navbar/Register";
import RootLayout from "./navbar/RootLayout";
import ErrorPage from "./special-setups/ErrorPage";
import VideoUpload from "./navbar/VideoUpload";
import DataProtection from "./footer/DataProtection";
import Profile from "./navbar/Profile";
import UserProfileSearchResults from "./components/UserProfileSearchResults";
import VideoAlter from "./navbar/VideoAlter";
import Videos from "./navbar/Videos";
import SendMessageDialog from "./components/SendMessageDialog";
import PasswordReset from "./components/PasswordReset";
import Inspire from "./navbar/Inspire";
import InspireDisplay from "./navbar/InspireDisplay";
import InspireAlter from "./navbar/InspireAlter";
import Feed from "./navbar/Feed";
import Foundations from "./footer/Foundations";

import ChildCancer from './footer/ChildCancer';
import Research from './footer/Research';
import CancerHospitals from './footer/CancerHospitals';
import ChildrenCancerHomes from './footer/ChildrenCancerHomes';
import Resources from './footer/Resources';
import CancerBlogs from './footer/CancerBlogs';
import Spinner from "./navbar/Spinner";



// Create the PostContext
export const PostContext = createContext();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "video-upload", element: <VideoUpload /> },
      { path: "data-protection", element: <DataProtection /> },
      { path: "profile", element: <Profile /> },
      { path: "search", element: <UserProfileSearchResults /> },
      { path: "profile/:profileId", element: <Profile /> },
      { path: "video-alter", element: <VideoAlter /> },
      { path: "videos", element: <Videos /> },
      { path: "/send-message/:profileId", element: <SendMessageDialog /> },
      { path: "reset-password", element: <PasswordReset /> },
      { path: "inspire", element: <Inspire /> },
      { path: "inspire-display", element: <InspireDisplay /> },
      { path: "inspire-alter", element: <InspireAlter /> },
      { path: "feed", element: <Feed /> },
      { path: "foundations", element: <Foundations /> },

      { path: "child-cancer", element: <ChildCancer /> },
      { path: "research", element: <Research /> },
      { path: "cancer-hospitals", element: <CancerHospitals /> },
      { path: "children-cancer-homes", element: <ChildrenCancerHomes /> },
      { path: "resources", element: <Resources /> },
      { path: "cancer-blogs", element: <CancerBlogs /> },
      { path: "spinner", element: <Spinner /> },
    ],
  },
]);

function App() {
  const [sharedPosts, setSharedPosts] = useState([]);

  return (
    <PostContext.Provider value={{ sharedPosts, setSharedPosts }}>
      <RouterProvider router={router} />
    </PostContext.Provider>
  );
}

export default App;
