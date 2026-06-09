import React from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { formatCurrency } from '../utils/formatters';

const LoanBreakdownChart = ({ principal, totalInterest }) => {
  const total = principal + totalInterest;
  const principalPercent = total > 0 ? (principal / total) * 100 : 0;
  const interestPercent = Math.max(100 - principalPercent, 0);

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
      <Typography variant="h6" gutterBottom>
        Principal vs Interest
      </Typography>
      <Box
        component="svg"
        role="img"
        aria-label="Principal versus interest chart"
        viewBox="0 0 320 44"
        sx={{ display: 'block', width: '100%', height: 72 }}
      >
        <rect x="0" y="8" width="320" height="18" rx="4" fill="#DCE5EC" />
        <rect
          x="0"
          y="8"
          width={(principalPercent / 100) * 320}
          height="18"
          rx="4"
          fill="#1267A8"
        />
        <rect
          x={(principalPercent / 100) * 320}
          y="8"
          width={(interestPercent / 100) * 320}
          height="18"
          rx="4"
          fill="#F59E0B"
        />
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            Principal: {formatCurrency(principal)} ({principalPercent.toFixed(1)}%)
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: 'warning.main' }} />
          <Typography variant="body2" color="text.secondary">
            Interest: {formatCurrency(totalInterest)} ({interestPercent.toFixed(1)}%)
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default React.memo(LoanBreakdownChart);
