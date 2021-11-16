import { useNavigate } from "react-router-dom";
import lib from "../lib/lib";

const Offers = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="Offers">
      {data.offers.map((offer) => {
        const brand = offer.product_details.find(
          (product_detail) => product_detail.MARQUE
        )?.MARQUE;
        const size = offer.product_details.find(
          (product_detail) => product_detail.TAILLE
        )?.TAILLE;

        return (
          <div
            key={offer._id}
            className="offer"
            onClick={() => navigate(`/offer/${offer._id}`)}
          >
            <div className="offer-card">
              <div className="offer-user"></div>
              <div className="offer-product">
                <img
                  src={offer.product_image.secure_url ?? ""}
                  alt={offer.product_name}
                />
                <div className="offer-product-details">
                  <span>{lib.formatPrice(offer.product_price)}</span>
                  <span>{size}</span>
                  <span>{brand}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Offers;
