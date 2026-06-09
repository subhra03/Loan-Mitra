import React from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { formatCurrency, formatMonths } from '../utils/formatters';

const LoanComparison = ({ loan }) => {
  const comparisonRows = [
    {
      label: 'Monthly EMI',
      baseline: formatCurrency(loan.emi),
      withExtra: formatCurrency(loan.emi),
    },
    {
      label: 'Extra monthly payment',
      baseline: formatCurrency(0),
      withExtra: formatCurrency(loan.extraPayment),
    },
    {
      label: 'Payoff time',
      baseline: formatMonths(loan.baseline.payoffMonths),
      withExtra: formatMonths(loan.payoffMonths),
    },
    {
      label: 'Total interest',
      baseline: formatCurrency(loan.baseline.totalInterest),
      withExtra: formatCurrency(loan.totalInterest),
    },
    {
      label: 'Total payment',
      baseline: formatCurrency(loan.baseline.totalPayment),
      withExtra: formatCurrency(loan.totalPayment),
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">Prepayment Impact</Typography>
        <Chip
          icon={<TrendingDownIcon />}
          label={
            loan.extraPayment > 0
              ? `${formatCurrency(loan.interestSaved)} saved`
              : 'No prepayment'
          }
          color={loan.extraPayment > 0 ? 'success' : 'default'}
          variant={loan.extraPayment > 0 ? 'filled' : 'outlined'}
        />
      </Stack>
      {loan.extraPayment > 0 && (
        <Box
          sx={{
            mb: 2,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            color: 'success.main',
            bgcolor: 'background.default',
            fontWeight: 700,
          }}
        >
          Payoff shortened by {formatMonths(loan.monthsSaved)}
        </Box>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell>Base loan</TableCell>
              <TableCell>With prepayment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.baseline}</TableCell>
                <TableCell>{row.withExtra}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default React.memo(LoanComparison);
