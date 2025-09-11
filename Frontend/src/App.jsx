import React from "react";
import Body from "./Components/Body";
import Blog from "./Components/Blog";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./Components/Applayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [
        { path: "/", element: <Body /> },
        { path: "/Blog", element: <Blog /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
