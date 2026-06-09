import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  DirectionsCar as DirectionsCarIcon,
  Payments as PaymentsIcon,
  TwoWheeler as TwoWheelerIcon,
} from '@mui/icons-material';
import useEmiCalculator from '../hooks/useEmiCalculator';
import {
  calculateLoanResult,
  validateLoanInputs,
} from '../utils/loanCalculations';
import { formatCurrency } from '../utils/formatters';

const Calculator = ({ onCalculate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loanPurpose, setLoanPurpose] = useState('standard');
  const [vehicleType, setVehicleType] = useState('car');
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenureValue, setTenureValue] = useState('');
  const [tenureUnit, setTenureUnit] = useState('months');
  const [extraPayment, setExtraPayment] = useState('');
  const [touched, setTouched] = useState({});
  const validation = useMemo(
    () =>
      validateLoanInputs({
        loanPurpose,
        vehicleType,
        vehiclePrice,
        downPayment,
        principal,
        rate,
        tenureValue,
        tenureUnit,
        extraPayment,
      }),
    [
      downPayment,
      extraPayment,
      loanPurpose,
      principal,
      rate,
      tenureUnit,
      tenureValue,
      vehiclePrice,
      vehicleType,
    ]
  );
  const emi = useEmiCalculator(
    validation.values.principal,
    rate,
    validation.values.months
  );
  const vehiclePriceLabel = vehicleType === 'bike' ? 'Bike price' : 'Car price';

  const showError = useCallback(
    (field) => Boolean(touched[field] && validation.errors[field]),
    [touched, validation.errors]
  );

  const markTouched = useCallback((field) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }, []);

  const handleLoanPurposeChange = useCallback((event, nextPurpose) => {
    if (nextPurpose) {
      setLoanPurpose(nextPurpose);
    }
  }, []);

  const handleVehicleTypeChange = useCallback((event, nextVehicleType) => {
    if (nextVehicleType) {
      setVehicleType(nextVehicleType);
    }
  }, []);

  const handleTenureUnitChange = useCallback((event, nextUnit) => {
    if (nextUnit) {
      setTenureUnit(nextUnit);
    }
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setTouched({
      vehiclePrice: true,
      downPayment: true,
      principal: true,
      rate: true,
      tenureValue: true,
      extraPayment: true,
    });

    if (!validation.isValid) {
      return;
    }

    onCalculate(calculateLoanResult(validation.values));
  }, [onCalculate, validation.isValid, validation.values]);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 18px 50px rgba(23, 33, 43, 0.08)',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5">EMI Mitra</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            INR loan calculator
          </Typography>
        </Box>
        <Chip
          icon={<PaymentsIcon />}
          label="INR"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700 }}
        />
      </Stack>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        value={loanPurpose}
        onChange={handleLoanPurposeChange}
        aria-label="Loan type"
        sx={{
          mt: 3,
          '& .MuiToggleButton-root': {
            minHeight: 48,
            py: 1.1,
          },
        }}
      >
        <ToggleButton value="standard" aria-label="Regular EMI">
          Regular EMI
        </ToggleButton>
        <ToggleButton value="vehicle" aria-label="Car or bike loan">
          Car / Bike Loan
        </ToggleButton>
      </ToggleButtonGroup>

      {loanPurpose === 'vehicle' ? (
        <Box
          sx={{
            mt: { xs: 2, sm: 2.5 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={vehicleType}
            onChange={handleVehicleTypeChange}
            aria-label="Vehicle type"
            sx={{
              mb: { xs: 2.25, sm: 2 },
              width: { xs: '100%', sm: 'auto' },
              '& .MuiToggleButton-root': {
                flex: { xs: 1, sm: 'initial' },
                minHeight: 48,
                px: { xs: 1.5, sm: 2 },
              },
            }}
          >
            <ToggleButton value="car" aria-label="Car">
              <DirectionsCarIcon fontSize="small" sx={{ mr: 0.75 }} />
              Car
            </ToggleButton>
            <ToggleButton value="bike" aria-label="Bike">
              <TwoWheelerIcon fontSize="small" sx={{ mr: 0.75 }} />
              Bike
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label={vehiclePriceLabel}
              type="number"
              fullWidth
              margin="none"
              value={vehiclePrice}
              onBlur={() => markTouched('vehiclePrice')}
              onChange={(event) => setVehiclePrice(event.target.value)}
              error={showError('vehiclePrice')}
              helperText={
                showError('vehiclePrice') ? validation.errors.vehiclePrice : ' '
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rs.</InputAdornment>
                ),
              }}
              inputProps={{ min: 0, step: 10000 }}
            />
            <TextField
              label="Down payment"
              type="number"
              fullWidth
              margin="none"
              value={downPayment}
              onBlur={() => markTouched('downPayment')}
              onChange={(event) => setDownPayment(event.target.value)}
              error={showError('downPayment')}
              helperText={
                showError('downPayment') ? validation.errors.downPayment : ' '
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rs.</InputAdornment>
                ),
              }}
              inputProps={{ min: 0, step: 10000 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Financed amount:{' '}
            {Number.isFinite(validation.values.principal) &&
            validation.values.principal > 0
              ? formatCurrency(validation.values.principal)
              : '--'}
          </Typography>
        </Box>
      ) : (
        <TextField
          label="Loan amount"
          type="number"
          fullWidth
          margin="normal"
          value={principal}
          onBlur={() => markTouched('principal')}
          onChange={(event) => setPrincipal(event.target.value)}
          error={showError('principal')}
          helperText={showError('principal') ? validation.errors.principal : ' '}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Rs.</InputAdornment>
            ),
          }}
          inputProps={{ min: 0, step: 10000 }}
        />
      )}

      <TextField
        label="Annual Interest Rate (%)"
        type="number"
        fullWidth
        margin="normal"
        value={rate}
        onBlur={() => markTouched('rate')}
        onChange={(event) => setRate(event.target.value)}
        error={showError('rate')}
        helperText={showError('rate') ? validation.errors.rate : ' '}
        inputProps={{ min: 0, step: 0.01 }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      >
        <TextField
          label={`Tenure (${tenureUnit})`}
          type="number"
          fullWidth
          margin="normal"
          value={tenureValue}
          onBlur={() => markTouched('tenureValue')}
          onChange={(event) => setTenureValue(event.target.value)}
          error={showError('tenureValue')}
          helperText={
            showError('tenureValue') ? validation.errors.tenureValue : ' '
          }
          inputProps={{ min: 1, step: tenureUnit === 'years' ? 0.25 : 1 }}
        />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={tenureUnit}
          onChange={handleTenureUnitChange}
          aria-label="Tenure unit"
          sx={{ mt: { xs: 0, sm: 2 } }}
        >
          <ToggleButton value="months" aria-label="Months">
            Months
          </ToggleButton>
          <ToggleButton value="years" aria-label="Years">
            Years
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <TextField
        label="Extra monthly prepayment"
        type="number"
        fullWidth
        margin="normal"
        value={extraPayment}
        onBlur={() => markTouched('extraPayment')}
        onChange={(event) => setExtraPayment(event.target.value)}
        error={showError('extraPayment')}
        helperText={
          showError('extraPayment')
            ? validation.errors.extraPayment
            : 'Optional principal prepayment each month'
        }
        InputProps={{
          startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
        }}
        inputProps={{ min: 0, step: 1000 }}
      />
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Monthly EMI
        </Typography>
        <Typography variant="h5" color="primary" sx={{ mt: 0.5 }}>
          {validation.isValid ? formatCurrency(emi) : '--'}
        </Typography>
      </Paper>
      <Button
        variant="contained"
        type="submit"
        disabled={!validation.isValid}
        startIcon={<CalculateIcon />}
        fullWidth
        size="large"
        sx={{
          mt: 1.5,
          py: 1.2,
          minHeight: 52,
          position: { xs: 'sticky', sm: 'static' },
          bottom: { xs: 12, sm: 'auto' },
          zIndex: { xs: 5, sm: 'auto' },
          boxShadow: {
            xs: validation.isValid
              ? '0 14px 32px rgba(18, 103, 168, 0.28)'
              : 'none',
            sm: 'none',
          },
        }}
      >
        {isMobile ? 'Calculate EMI' : 'Calculate'}
      </Button>
    </Box>
  );
};

export default React.memo(Calculator);
