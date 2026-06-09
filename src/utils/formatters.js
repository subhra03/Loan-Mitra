const currencyFormatters = new Map();

const getCurrencyFormatter = (currency) => {
  if (!currencyFormatters.has(currency)) {
    currencyFormatters.set(
      currency,
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      })
    );
  }

  return currencyFormatters.get(currency);
};

export const formatCurrency = (value, currency = 'INR') =>
  getCurrencyFormatter(currency).format(Number(value) || 0);

export const formatMonths = (months) => {
  const totalMonths = Number(months) || 0;
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (years === 0) {
    return `${remainingMonths} mo`;
  }

  if (remainingMonths === 0) {
    return `${years} yr`;
  }

  return `${years} yr ${remainingMonths} mo`;
};
