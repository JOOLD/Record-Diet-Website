import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import "./styles/Nav.css"
// import Footer from "./components/Footer";
// import HomePage from "./pages/HomePage";
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage";
import "./styles/all.css";
import LoginPage from "./pages/LoginPage";
import UserProfiles from "./pages/user/UserProfile";
import UserSelfies from "./pages/user/UserSelfies";
import UserDashboard from "./pages/user/UserDashboard";
import Articles from "./pages/admin/Article";
import Food from "./pages/user/Food";
import Blog from "./pages/blog";
import Calculator from "./pages/Calculator"

function App() {
  return (
    <div className="App">
      <Nav />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* user page */}
          <Route element={<UserDashboard />}>
            <Route path="/user/profile" element={<UserProfiles />} />
            <Route path="/user/selfies" element={<UserSelfies />} />
          </Route>
          <Route path="/articles" element={<Articles />} />
          <Route path="/food" element={<Food />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
