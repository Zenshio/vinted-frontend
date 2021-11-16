import axios from "axios";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutForm from "../../components/CheckoutForm";

import Loader from "../../components/Loader";
import lib from "../../lib/lib";

import "./Payment.css";

const stripePromise = loadStripe(
  "pk_test_51JwPzZDZhVjHE80IEpKFkuZ1lEtor3seWGQGCOTXTYiG5SZop8sLqAg6vslYHuPeexMdeWJs0iWlsCy2GV64pgAS00khwRnyt2"
);

const Payment = ({ auth }) => {
  const location = useLocation();
  const offerId = location.state?.offerId;
  const [offer, setOffer] = useState({});
  const [orderAmount, setOrderAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const protectionFeeAmount = (amount) => amount / 10;
  const deliveryFeeAmount = (amount) => amount / 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/offer/${offerId}`
        );
        setOffer(response.data);
        setOrderAmount(
          response.data.product_price +
            protectionFeeAmount(response.data.product_price) +
            deliveryFeeAmount(response.data.product_price)
        );
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 10000,
        });
        console.log(error);
      }
    };

    fetchData();
  }, [offerId]);

  return !offerId || !auth.isAuthenticated ? (
    <Navigate to={!offerId ? "/" : "/login"} />
  ) : isLoading ? (
    <Loader />
  ) : (
    <main className="Main bcg-gray">
      <div className="Payment">
        <div className="container">
          <div className="payment-card summary">
            <div className="title">Résumé de la commande</div>
            <div className="content">
              <ul>
                <li>
                  Commande <span>{lib.formatPrice(offer.product_price)}</span>
                </li>
                <li>
                  Frais protection acheteurs{" "}
                  <span>
                    {lib.formatPrice(protectionFeeAmount(offer.product_price))}
                  </span>
                </li>
                <li>
                  Frais de port{" "}
                  <span>
                    {lib.formatPrice(deliveryFeeAmount(offer.product_price))}
                  </span>
                </li>
              </ul>
            </div>
            <div className="divider"></div>
            <div className="content">
              <ul>
                <li className="bold">
                  Total <span>{lib.formatPrice(orderAmount)}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="payment-card">
            <div className="content">
              Il ne vous reste plus qu'un étape pour vous offrir
              <span className="bold"> {offer.product_name} </span>. Vous allez
              payer{" "}
              <span className="bold"> {lib.formatPrice(orderAmount)} </span>
              (frais de protection et frais de port inclus).
              <div className="divider"></div>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  auth={auth}
                  amount={orderAmount}
                  currency="eur"
                  product_name={offer.product_name}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Payment;