import React from 'react';
import {
  Box,
  Chip,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  EmojiEvents as WinnerIcon,
} from '@mui/icons-material';
import {
  calculateOfferResult,
  compareLoanOffers,
} from '../utils/loanCalculations';
import { formatCurrency, formatMonths } from '../utils/formatters';

const createDefaultOffers = (loan) => [
  {
    lenderName: 'Bank A',
    rate: String(loan.rate || ''),
    tenureValue: String(loan.tenureValue || loan.months || ''),
    tenureUnit: loan.tenureUnit || 'months',
    processingFee: '',
  },
  {
    lenderName: 'Bank B',
    rate: loan.rate ? Math.max(0, Number(loan.rate) - 0.25).toFixed(2) : '',
    tenureValue: String(loan.tenureValue || loan.months || ''),
    tenureUnit: loan.tenureUnit || 'months',
    processingFee: '',
  },
];

const OfferComparison = ({ loan }) => {
  const [offers, setOffers] = React.useState(() => createDefaultOffers(loan));

  React.useEffect(() => {
    setOffers(createDefaultOffers(loan));
  }, [loan]);

  const updateOffer = React.useCallback((index, field, value) => {
    setOffers((currentOffers) =>
      currentOffers.map((offer, offerIndex) =>
        offerIndex === index ? { ...offer, [field]: value } : offer
      )
    );
  }, []);

  const results = React.useMemo(
    () =>
      offers.map((offer) =>
        calculateOfferResult({
          ...offer,
          principal: loan.principal,
        })
      ),
    [loan.principal, offers]
  );
  const comparison = React.useMemo(() => compareLoanOffers(results), [results]);

  const comparisonRows = React.useMemo(
    () => [
      {
        label: 'Monthly EMI',
        values: results.map((offer) => formatCurrency(offer.emi)),
      },
      {
        label: 'Tenure',
        values: results.map((offer) => formatMonths(offer.months)),
      },
      {
        label: 'Total interest',
        values: results.map((offer) => formatCurrency(offer.totalInterest)),
      },
      {
        label: 'Processing fee',
        values: results.map((offer) => formatCurrency(offer.processingFee)),
      },
      {
        label: 'Total cost',
        values: results.map((offer) => formatCurrency(offer.totalCost)),
      },
    ],
    [results]
  );

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
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6">Compare Bank Offers</Typography>
          <Typography variant="body2" color="text.secondary">
            Same loan amount, different rate, tenure, and fees
          </Typography>
        </Box>
        <Chip
          icon={comparison.winner ? <WinnerIcon /> : <BankIcon />}
          label={
            comparison.winner
              ? `${comparison.winner.lenderName} saves ${formatCurrency(
                  comparison.savings
                )}`
              : 'Enter two offers'
          }
          color={comparison.winner ? 'success' : 'default'}
          variant={comparison.winner ? 'filled' : 'outlined'}
        />
      </Stack>

      <Grid container spacing={2}>
        {offers.map((offer, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <TextField
                label="Bank / offer name"
                fullWidth
                value={offer.lenderName}
                onChange={(event) =>
                  updateOffer(index, 'lenderName', event.target.value)
                }
                margin="none"
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Interest rate"
                  type="number"
                  fullWidth
                  value={offer.rate}
                  onChange={(event) =>
                    updateOffer(index, 'rate', event.target.value)
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label={`Tenure (${offer.tenureUnit})`}
                  type="number"
                  fullWidth
                  value={offer.tenureValue}
                  onChange={(event) =>
                    updateOffer(index, 'tenureValue', event.target.value)
                  }
                  inputProps={{
                    min: 1,
                    step: offer.tenureUnit === 'years' ? 0.25 : 1,
                  }}
                />
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{ mt: 2 }}
              >
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={offer.tenureUnit}
                  onChange={(event, nextUnit) => {
                    if (nextUnit) {
                      updateOffer(index, 'tenureUnit', nextUnit);
                    }
                  }}
                  aria-label={`${offer.lenderName} tenure unit`}
                  sx={{
                    '& .MuiToggleButton-root': {
                      flex: { xs: 1, sm: 'initial' },
                      minHeight: 44,
                    },
                  }}
                >
                  <ToggleButton value="months">Months</ToggleButton>
                  <ToggleButton value="years">Years</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                  label="Processing fee"
                  type="number"
                  fullWidth
                  value={offer.processingFee}
                  onChange={(event) =>
                    updateOffer(index, 'processingFee', event.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Rs.</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 500 }}
                />
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      <TableContainer sx={{ mt: 2, overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>Metric</TableCell>
              {results.map((offer) => (
                <TableCell key={offer.lenderName}>{offer.lenderName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                {row.values.map((value, index) => (
                  <TableCell key={`${row.label}-${index}`}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default React.memo(OfferComparison);
