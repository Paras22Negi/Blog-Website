import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
function Header() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [showDropdown, setShowDropdown] = React.useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user?.name : "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <div className="header">
      <ul className="nav-list mid flex justify-between">
        <div className="flex space-x-5">
        <li onClick={() => navigate("/")}>Home</li>
        {isLoggedIn && (
          <li onClick={() => navigate("/Blog")}>Blog</li>
        )}
        </div>
      </ul>
      {isLoggedIn ? (
        <div className="dashboard-wrapper">
          <span className="username">{username}</span>
          <li
            className="dashboard-btn"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            Dashboard{" "}
            <span>
              <MdArrowDropDown />
            </span>
          </li>
          {showDropdown && (
            <ul className="dropdown">
              <li onClick={handleLogout}>Logout</li>
              <li onClick={() => navigate("/profile")}>Profile</li>
              <li onClick={() => navigate("/settings")}>Settings</li>
            </ul>
          )}
        </div>
      ): (
          <ul className="flex space-x-5">
            <li onClick={() => navigate("/signup")}>Signup</li>
            <li onClick={() => navigate("/login")}>Login</li>
          </ul>
        )}
    </div>
  );
}

export default Header;
