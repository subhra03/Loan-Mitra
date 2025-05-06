import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import useEmiCalculator from '../hooks/useEmiCalculator';

const Calculator = ({ onCalculate }) => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const emi = useEmiCalculator(principal, rate, months);

  const handleSubmit = () => {
    onCalculate({ principal, rate, months, emi });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Loan Calculator</Typography>
      <TextField label="Principal" type="number" fullWidth margin="normal" value={principal} onChange={(e) => setPrincipal(+e.target.value)} />
      <TextField label="Annual Interest Rate (%)" type="number" fullWidth margin="normal" value={rate} onChange={(e) => setRate(+e.target.value)} />
      <TextField label="Tenure (months)" type="number" fullWidth margin="normal" value={months} onChange={(e) => setMonths(+e.target.value)} />
      <Button variant="contained" onClick={handleSubmit}>Calculate</Button>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>EMI: {emi.toFixed(2)}</Typography>
    </Box>
  );
};

export default Calculator;
