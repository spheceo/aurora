export const currency = "R";

const extractAmount = (price: string) => price.match(/[\d.]+/)?.[0] || "0";

export const formatProductPrice = (price: string) =>
  `${currency}${extractAmount(price)}`;

export const getProductPriceAmount = (price: string) =>
  Number.parseFloat(extractAmount(price));
