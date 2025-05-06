import { useEffect, useState } from 'react';
import axios from 'axios';

const useExchangeRates = (baseCurrency) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(`https://v6.exchangerate-api.com/v6/39e45f4e9d6ff3a5bac0df4b/latest/${baseCurrency}`);
        setRates(res.data.conversion_rates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  return { rates, loading };
};

export default useExchangeRates;
