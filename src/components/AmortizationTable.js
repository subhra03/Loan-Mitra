import React from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { downloadCsv, downloadPdf } from '../utils/exportSchedule';
import { formatCurrency } from '../utils/formatters';
import { generateAmortizationSchedule } from '../utils/loanCalculations';

const AmortizationTable = ({
  principal,
  rate,
  months,
  emi,
  extraPayment = 0,
  schedule: providedSchedule,
  totalInterest,
  totalPayment,
  payoffMonths,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const schedule = React.useMemo(
    () =>
      providedSchedule ||
      generateAmortizationSchedule({
        principal,
        rate,
        months,
        emi,
        extraPayment,
      }),
    [emi, extraPayment, months, principal, providedSchedule, rate]
  );
  const visibleRows = React.useMemo(
    () => schedule.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, schedule]
  );

  const handleRowsPerPageChange = React.useCallback((event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }, []);

  if (schedule.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          mb: 1.5,
          display: 'flex',
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Typography variant="h6">Amortization Schedule</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<SwapHorizIcon />}
            label="Swipe table"
            size="small"
            variant="outlined"
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => downloadCsv(schedule)}
          >
            CSV
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdfIcon />}
            onClick={() =>
              downloadPdf({
                schedule,
                summary: {
                  emi,
                  totalInterest,
                  totalPayment,
                  payoffMonths,
                },
              })
            }
          >
            PDF
          </Button>
        </Stack>
      </Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'divider',
            borderRadius: 8,
          },
        }}
      >
        <Table size="small" sx={{ minWidth: 860 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>Month</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>EMI</TableCell>
              <TableCell>Extra</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Principal</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.month}
                sx={{
                  '&:last-child td': { borderBottom: 0 },
                  '&:hover': { bgcolor: 'background.default' },
                }}
              >
                <TableCell>{row.month}</TableCell>
                <TableCell>{formatCurrency(row.payment)}</TableCell>
                <TableCell>{formatCurrency(row.emi)}</TableCell>
                <TableCell>{formatCurrency(row.extraPayment)}</TableCell>
                <TableCell>{formatCurrency(row.interest)}</TableCell>
                <TableCell>{formatCurrency(row.principalPaid)}</TableCell>
                <TableCell>{formatCurrency(row.balance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={schedule.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[12, 24, 60]}
          onPageChange={(event, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </>
  );
};

export default React.memo(AmortizationTable);
