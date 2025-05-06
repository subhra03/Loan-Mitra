import React, { useContext } from 'react';
import { Box, Typography, MenuItem, Select } from '@mui/material';
import useExchangeRates from '../hooks/useExchangeRates';
import { AppContext } from '../context/AppContext';

const CurrencyConverter = ({ emi }) => {
  const { currency, setCurrency } = useContext(AppContext);
  const { rates, loading } = useExchangeRates('USD');

  if (loading) return <Typography>Loading exchange rates...</Typography>;

  const converted = (emi * (rates[currency] || 1)).toFixed(2);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Currency Conversion</Typography>
      <Select value={currency} onChange={(e) => setCurrency(e.target.value)} sx={{ my: 2 }}>
        {Object.keys(rates).map((cur) => (
          <MenuItem key={cur} value={cur}>{cur}</MenuItem>
        ))}
      </Select>
      <Typography>EMI in {currency}: {converted}</Typography>
    </Box>
  );
};

export default CurrencyConverter;
