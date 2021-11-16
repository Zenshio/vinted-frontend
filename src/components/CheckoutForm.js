import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

import axios from "axios";

const CheckoutForm = ({ auth, amount, currency, product_name }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const promiseToast = toast.loading("Veuillez patienter...");
    try {
      const responseUser = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/user`,
        {},
        {
          headers: {
            authorization: `Bearer ${auth.user.token}`,
          },
        }
      );

      auth.user = responseUser.data;
      // On récupère ici les données bancaires que l'utilisateur rentre
      const cardElement = elements.getElement(CardElement);

      // Demande de création d'un token via l'API Stripe
      // On envoie les données bancaires dans la requête
      const stripeResponse = await stripe.createToken(cardElement, {
        name: auth.user._id,
      });

      const stripeToken = stripeResponse.token.id;
      // Une fois le token reçu depuis l'API Stripe
      // Requête vers notre serveur
      // On envoie le token reçu depuis l'API Stripe
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/order/payment`,
        {
          stripeToken,
          currency,
          amount,
          product_name,
        },
        {
          headers: {
            authorization: `Bearer ${auth.user.token}`,
          },
        }
      );
      console.log(response.data);
      // Si la réponse du serveur est favorable, la transaction a eu lieu
      if (response.data._id) {
        setCompleted(true);
        toast.update(promiseToast, {
          render: "Votre commande a été réalisée avec succès !",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
      } else {
        toast.update(promiseToast, {
          render:
            "Une erreur est survenue... Veuillez vérifier votre saisie ou réessayer plus tard.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);
      toast.update(promiseToast, {
        render:
          "Une erreur est survenue... Veuillez vérifier votre saisie ou réessayer plus tard.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      {!completed ? (
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit">Valider</button>
        </form>
      ) : (
        <span>Paiement effectué ! </span>
      )}
    </>
  );
};

export default CheckoutForm;
