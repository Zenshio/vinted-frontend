import { Helmet, HelmetProvider } from "react-helmet-async";

const E404 = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>Vinted | 404</Helmet>
      </HelmetProvider>
      <div>404</div>
    </>
  );
};

export default E404;
