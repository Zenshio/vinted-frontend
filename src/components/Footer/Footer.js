import "./Footer.css";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="container footer-container">
        Created with React at
        <a
          href="http://lereacteur.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Le Reacteur
        </a>
        by
        <a
          href="http://ludovic-six.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ludovic Six
        </a>
      </div>
    </footer>
  );
};

export default Footer;
