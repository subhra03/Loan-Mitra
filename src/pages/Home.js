import React, { useState } from 'react';
import { Container } from '@mui/material';
import Calculator from '../components/Calculator';
import AmortizationTable from '../components/AmortizationTable';
import CurrencyConverter from '../components/CurrencyConverter';

const Home = () => {
  const [data, setData] = useState(null);

  return (
    <Container>
      <Calculator onCalculate={setData} />
      {data && (
        <>
          
          <CurrencyConverter emi={data.emi} />
          <AmortizationTable {...data} />
          
        </>
      )}
    </Container>
  );
};

export default Home;
