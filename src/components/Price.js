const formatPrice = (num, decimals = 2) => {
  return (
    parseFloat(num).toLocaleString("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + " €"
  );
};

const Price = ({ num }) => {
  return <>{formatPrice(num)}</>;
};

export default Price;
