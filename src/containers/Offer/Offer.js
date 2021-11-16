import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";

import "./Offer.css";
import lib from "../../lib/lib";

const Offer = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/offer/${id}`
        );
        setOffer(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 10000,
        });
      }
    };

    fetchData();
  }, [id]);

  return (
    <main className="Main bcg-gray">
      <HelmetProvider>
        <Helmet>
          <title>{`Vinted | ${offer.product_name ?? "Annonce"}`}</title>
        </Helmet>
      </HelmetProvider>
      <div className="Offer">
        <div className="container">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="offer-pictures">
                <img
                  src={offer.product_image.secure_url}
                  className="offer-picture"
                  alt={offer.title}
                />
              </div>
              <div className="offer-details">
                <div>
                  <span className="offer-price">
                    {lib.formatPrice(offer.product_price)}
                  </span>
                  <ul className="offer-details-list">
                    {offer.product_details.map((product_detail, index) => {
                      const keys = Object.keys(product_detail);
                      const details = keys.map((key, index) => {
                        return (
                          <li key={index}>
                            <span>{key}</span>
                            <span>{product_detail[key]}</span>
                          </li>
                        );
                      });
                      return details;
                    })}
                  </ul>
                </div>
                <div className="divider"></div>
                <div className="offer-content">
                  <p className="name">{offer.product_name}</p>
                  <p className="description">{offer.product_description}</p>
                  <div className="offer-avatar-username">
                    <span>{offer.owner?.account?.username}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate("/payment", { state: { offerId: id } })
                  }
                >
                  Acheter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Offer;
