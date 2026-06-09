import React, { useState } from 'react';
import { Box, Container, Grid, Stack } from '@mui/material';
import Calculator from '../components/Calculator';
import AmortizationTable from '../components/AmortizationTable';
import LoanBreakdownChart from '../components/LoanBreakdownChart';
import LoanComparison from '../components/LoanComparison';
import OfferComparison from '../components/OfferComparison';
import LoanSummary from '../components/LoanSummary';

const Home = () => {
  const [data, setData] = useState(null);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 68px)',
        background:
          'linear-gradient(180deg, rgba(18,103,168,0.08) 0%, rgba(245,248,251,0) 320px)',
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} lg={data ? 4 : 7} sx={{ mx: data ? 0 : 'auto' }}>
            <Box sx={{ position: { lg: 'sticky' }, top: 92 }}>
              <Calculator onCalculate={setData} />
            </Box>
          </Grid>
          {data && (
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                <LoanSummary loan={data} />
                <OfferComparison loan={data} />
                <LoanBreakdownChart
                  principal={data.principal}
                  totalInterest={data.totalInterest}
                />
                <LoanComparison loan={data} />
                <AmortizationTable {...data} />
              </Stack>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
