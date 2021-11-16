import "./App.css";
import "./Responsive.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./containers/Home";
import Signup from "./containers/Signup";
import Login from "./containers/Login";
import Offer from "./containers/Offer/Offer";
import Publish from "./containers/Publish";
import Payment from "./containers/Payment/Payment";
import E404 from "./containers/E404";

const App = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: Cookies.get("userToken") ? true : false,
    user: Cookies.get("userToken") ? { token: Cookies.get("userToken") } : {},
  });
  const [offerFilters, setOfferFilters] = useState({
    title: "",
    sort: "price-asc",
    priceMin: 0,
    priceMax: 200,
  });

  const setUser = async (credentials) => {
    if (credentials && typeof credentials === "object" && credentials.token) {
      Cookies.set("userToken", credentials.token, { expires: 7 });
      setAuth({ isAuthenticated: true, user: credentials });
    } else if (typeof credentials === "string") {
      // Récupérer l'utilisateur avec son token en cookie ? :(
    } else {
      Cookies.remove("userToken");
      setAuth({ isAuthenticated: false, user: {} });
    }
  };

  return (
    <Router>
      <Header
        auth={auth}
        setUser={setUser}
        offerFilters={offerFilters}
        setOfferFilters={setOfferFilters}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              auth={auth}
              offerFilters={offerFilters}
              setOfferFilters={setOfferFilters}
            />
          }
        />
        <Route
          path="/signup"
          element={<Signup auth={auth} setUser={setUser} />}
        />
        <Route
          path="/login"
          element={<Login auth={auth} setUser={setUser} />}
        />
        <Route path="/offer/:id" element={<Offer />} />
        <Route path="/publish" element={<Publish auth={auth} />} />
        <Route path="/payment" element={<Payment auth={auth} />} />
        <Route path="*" element={<E404 />} />
      </Routes>
      <Footer />
      <ToastContainer theme="colored" />
    </Router>
  );
};

export default App;
