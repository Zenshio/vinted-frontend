import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Range, getTrackBackground } from "react-range";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/img/logo.png";

const Header = ({ auth, setUser, offerFilters, setOfferFilters }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    goHome();
    toast.success("Vous êtes désormais déconnecté.");
  };

  const handleChange = ({ target }) => {
    const newOfferFilters = { ...offerFilters };
    if (target.name === "sort") {
      newOfferFilters[target.name] = target.checked
        ? "price-desc"
        : "price-asc";
    } else {
      newOfferFilters[target.name] = target.value;
    }
    setOfferFilters(newOfferFilters);
  };

  const handlePriceRangeChange = ([priceMin, priceMax]) => {
    const newOfferFilters = { ...offerFilters };
    newOfferFilters.priceMin = priceMin;
    newOfferFilters.priceMax = priceMax;
    setOfferFilters(newOfferFilters);
  };

  return (
    <header className="Header">
      <div className="container header-container">
        <div onClick={goHome}>
          <img className="header-logo" src={logo} alt="ls-vinted" />
        </div>
        <div className="search-container">
          <input
            type="text"
            name="title"
            className="search-input"
            placeholder="Recherche des articles"
            value={offerFilters.title}
            onChange={handleChange}
          />
          <FontAwesomeIcon icon={faSearch} className="search-input-icon" />
          <div>
            {location.pathname === "/" && (
              <div className="search-price-params">
                <span>Trier par prix : </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="sort"
                    checked={offerFilters.sort === "price-desc"}
                    onChange={handleChange}
                  />
                  <span className="slider round"></span>
                </label>
                <span>Prix entre :</span>
                <div className="search-price-range">
                  <Range
                    step={5}
                    min={0}
                    max={500}
                    values={[offerFilters.priceMin, offerFilters.priceMax]}
                    onChange={(values) => handlePriceRangeChange(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "5px",
                          width: "100%",
                          borderRadius: "4px",
                          alignSelf: "center",
                          background: getTrackBackground({
                            values: [
                              offerFilters.priceMin,
                              offerFilters.priceMax,
                            ],
                            colors: ["#ccc", "#2cb1ba", "#ccc"],
                            min: 0,
                            max: 500,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, isDragged }) => (
                      <div
                        className="search-price-range-thumb"
                        {...props}
                        style={{
                          ...props.style,
                          height: "15px",
                          width: "15px",
                          borderRadius: "50%",
                          backgroundColor: "#2cb1ba",
                          outline: "none",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: isDragged
                            ? "1px solid #2cb1ba"
                            : "1px solid white",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-28px",
                            color: "white",
                            fontSize: "12px",
                            fontFamily: "Maison Neue",
                            padding: "4px",
                            borderRadius: "4px",
                            backgroundColor: "#2cb1ba",
                            borderTop: isDragged
                              ? "1px solid #2cb1ba"
                              : "1px solid white",
                          }}
                        >
                          {props["aria-valuenow"]}&nbsp;€
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {!auth.isAuthenticated ? (
          <div>
            <button
              className="header-button signup-button"
              onClick={() => navigate("/signup")}
            >
              S'inscrire
            </button>
            <button
              className="header-button login-button"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
          </div>
        ) : (
          <div>
            <button className="header-button logout-button" onClick={logout}>
              Se déconnecter
            </button>
          </div>
        )}

        <button
          className="header-button button-sold"
          onClick={() => navigate("/publish")}
        >
          Vends tes articles
        </button>
      </div>
    </header>
  );
};

export default Header;
