import axios from "axios";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Publish = ({ auth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({
    title: "",
    description: "",
    brand: "",
    size: "",
    color: "",
    condition: "",
    city: "",
    price: 0,
    exchange: false,
    picture: {},
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      handleChange({
        target: {
          name: "picture",
          value: Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0]),
          }),
        },
      });
    },
  });

  const handleChange = ({ target }) => {
    setData(Object.assign({ ...data }, { [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const getFormData = (object) =>
      Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key]);
        return formData;
      }, new FormData());

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/offer/publish`,
        getFormData(data),
        {
          headers: {
            authorization: `Bearer ${auth.user.token}`,
          },
        }
      );

      navigate(`/offer/${response.data._id}`);
      toast.success("Annonce publiée avec succès !");
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 10000,
      });
      console.log(error);
    }
  };

  useEffect(
    () => () => {
      URL.revokeObjectURL(data.picture.preview);
    },
    [data.picture]
  );

  return !auth.isAuthenticated ? (
    <Navigate to="/login" state={{ from: location.pathname }} />
  ) : (
    <main className="Main bcg-gray">
      <HelmetProvider>
        <Helmet>
          <title>{`Vinted | Publiez une annonce`}</title>
        </Helmet>
      </HelmetProvider>
      <div className="Publish">
        <div className="container">
          <h2>Vends ton article</h2>
          <form onSubmit={handleSubmit}>
            <div className="file-select">
              {Object.keys(data.picture).length === 0 ? (
                <div className="dashed-border empty">
                  <div
                    {...getRootProps({
                      className: "input-design-default dropzone",
                    })}
                  >
                    <label htmlFor="file" className="label-file">
                      <span className="input-sign">+</span>
                      <span>Ajoute une photo</span>
                    </label>
                    <input {...getInputProps()} multiple={false} id="id" />
                  </div>
                </div>
              ) : (
                <div className="dashed-border filled">
                  <div key={data.picture.name} className="image-preview">
                    <img
                      src={data.picture.preview}
                      alt={`pré-visualisation ${data.picture.name}`}
                    />
                    <div
                      className="remove-img-button"
                      onClick={() => {
                        setData(Object.assign({ ...data }, { picture: {} }));
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-input-section">
              <div className="text-input">
                <h4>Titre</h4>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="ex: Chemise Sézane verte"
                  value={data.title}
                  onChange={handleChange}
                />
              </div>
              <div className="text-input">
                <h4>Décris ton article</h4>
                <textarea
                  name="description"
                  id="description"
                  rows="5"
                  placeholder="ex: porté quelquefois, taille correctement"
                  value={data.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="text-input-section">
              <div className="text-input">
                <h4>Marque</h4>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  placeholder="ex: Zara"
                  value={data.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="text-input">
                <h4>Taille</h4>
                <input
                  type="text"
                  id="size"
                  name="size"
                  placeholder="ex: L / 40 / 12"
                  value={data.size}
                  onChange={handleChange}
                />
              </div>
              <div className="text-input">
                <h4>Couleur</h4>
                <input
                  type="text"
                  id="color"
                  name="color"
                  placeholder="ex: Fushia"
                  value={data.color}
                  onChange={handleChange}
                />
              </div>
              <div className="text-input">
                <h4>Etat</h4>
                <input
                  type="text"
                  name="condition"
                  id="condition"
                  placeholder="Neuf avec étiquette"
                  value={data.condition}
                  onChange={handleChange}
                />
              </div>
              <div className="text-input">
                <h4>Lieu</h4>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="ex: Paris"
                  value={data.city}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="text-input-section">
              <div className="text-input">
                <h4>Prix</h4>
                <div className="checkbox-section">
                  <input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="0,00 €"
                    value={data.price}
                    onChange={handleChange}
                  />
                  <div className="checkbox-input checked">
                    <label
                      htmlFor="exchange"
                      className={
                        data.exchange
                          ? "checkbox-design checked"
                          : "checkbox-design"
                      }
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </label>
                    <input
                      type="checkbox"
                      name="exchange"
                      id="exchange"
                      value="exchange"
                      onChange={(event) =>
                        handleChange({
                          target: {
                            name: "exchange",
                            value: event.target.checked,
                          },
                        })
                      }
                    />
                    <span>Je suis intéressé(e) par les échanges</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-button-div">
              <button type="submit" className="form-validation">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Publish;
