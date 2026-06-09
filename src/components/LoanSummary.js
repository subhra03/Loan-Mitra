import React from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CalendarMonth as CalendarIcon,
  CurrencyRupee as RupeeIcon,
  Paid as PaidIcon,
  Savings as SavingsIcon,
} from '@mui/icons-material';
import { formatCurrency, formatMonths } from '../utils/formatters';

const summaryItems = [
  { key: 'principal', label: 'Loan amount', format: formatCurrency, icon: WalletIcon },
  { key: 'emi', label: 'Monthly EMI', format: formatCurrency, icon: RupeeIcon },
  { key: 'totalInterest', label: 'Total interest', format: formatCurrency, icon: SavingsIcon },
  { key: 'totalPayment', label: 'Total payment', format: formatCurrency, icon: PaidIcon },
  { key: 'payoffMonths', label: 'Payoff time', format: formatMonths, icon: CalendarIcon },
];

const LoanSummary = ({ loan }) => {
  const vehicleLabel = loan.vehicleType === 'bike' ? 'Bike' : 'Car';

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Loan Summary
      </Typography>
      {loan.loanPurpose === 'vehicle' && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 1,
            mb: 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {vehicleLabel} loan
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {vehicleLabel} price {formatCurrency(loan.vehiclePrice)} with{' '}
            {formatCurrency(loan.downPayment)} down payment
          </Typography>
        </Paper>
      )}
      <Grid container spacing={2}>
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
          <Grid item xs={12} sm={6} md={item.key === 'principal' ? 4 : 2} key={item.key}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                height: '100%',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.main',
                    bgcolor: 'background.default',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {item.format(loan[item.key])}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default React.memo(LoanSummary);
