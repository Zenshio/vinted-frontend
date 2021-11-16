import axios from "axios";
import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { toast } from "react-toastify";

const Login = ({ auth, setUser }) => {
  const location = useLocation();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target }) => {
    setData(Object.assign({ ...data }, { [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/user/login`,
        data
      );

      const user = response.data;
      setUser(user);
      toast.success("Vous êtes connecté !");
    } catch (error) {
      toast.error(error.response.data.message, {
        autoClose: 10000,
      });
      console.log(error);
    }
  };

  return auth.isAuthenticated ? (
    <Navigate to={location.state?.from || "/"} />
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Vinted | Connexion</title>
        </Helmet>
      </HelmetProvider>
      <main className="Main">
        <div className="container login-container">
          <h2>Se connecter</h2>
          <form className="login-form" onSubmit={handleSubmit}>
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
            <button type="submit">Se connecter</button>
          </form>
          <Link to="/signup">Pas encore de compte ? Inscris-toi !</Link>
        </div>
      </main>
    </>
  );
};

export default Login;
