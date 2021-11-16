import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Loader from "../components/Loader";
import Offers from "../components/Offers";

import tearImg from "../assets/img/tear.svg";

const Home = ({ auth, offerFilters, setOfferFilters }) => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const queryString = Object.keys(offerFilters)
        .map((key) => offerFilters && key + "=" + offerFilters[key])
        .join("&");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/offers/?${queryString}`
      );
      setOffers(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, [offerFilters]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Vinted | Achète, vends ou échange les vêtements, chaussures ou ...
          </title>
        </Helmet>
      </HelmetProvider>
      <main className="Main">
        <div className="home-hero">
          <img
            src={tearImg}
            alt="tear-style"
            className="home-hero-tear-style"
          />
          <div className="container">
            <div className="home-hero-text">
              Prêts à faire du tri dans vos placards ?
              <button onClick={() => navigate("/publish")}>
                Commencer à vendre
              </button>
            </div>
          </div>
        </div>
        <div className="container">
          {isLoading ? <Loader /> : <Offers data={offers} />}
        </div>
      </main>
    </>
  );
};

export default Home;
