import axios from "axios";
import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

const Signup = ({ auth, setUser }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    newsletter: false,
  });

  const handleChange = ({ target }) => {
    setData(Object.assign({ ...data }, { [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/user/signup`,
        data
      );

      const user = response.data;
      setUser(user);
      navigate("/");
      toast.success("Inscription réalisée avec succès !");
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 10000,
      });
      console.log(error);
    }
  };

  return auth.isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Vinted | Inscription</title>
        </Helmet>
      </HelmetProvider>
      <main className="Main">
        <div className="container signup-container">
          <h2>S'inscrire</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={data.username}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Adresse e-mail"
              value={data.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={data.password}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="N° de téléphone"
              value={data.phone}
              onChange={handleChange}
            />
            <div className="checkbox-container">
              <div>
                <input
                  type="checkbox"
                  name="newsletter"
                  value={data.newsletter}
                  onChange={handleChange}
                />
                <span>S'inscrire à notre newsletter</span>
              </div>
              <p>
                En m'inscrivant je confirme avoir lu et accepté les Termes &amp;
                Conditions et Politique de Confidentialité de Vinted. Je
                confirme avoir au moins 18 ans.
              </p>
            </div>
            <button type="submit">S'inscrire</button>
          </form>
          <Link to="/login">Tu as déjà un compte ? Connecte-toi !</Link>
        </div>
      </main>
    </>
  );
};

export default Signup;
