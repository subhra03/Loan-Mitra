import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

const AmortizationTable = ({ principal, rate, months, emi }) => {
  const r = rate / 12 / 100;
  let balance = principal;
  let schedule = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;

    schedule.push({
      month: i,
      emi: emi.toFixed(2),
      interest: interest.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      balance: balance > 0 ? balance.toFixed(2) : 0,
    });
  }

  return (
    <>
      <Typography variant="h6" sx={{ mt: 4 }}>Amortization Schedule</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Month</TableCell>
            <TableCell>EMI</TableCell>
            <TableCell>Interest</TableCell>
            <TableCell>Principal</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.map((row) => (
            <TableRow key={row.month}>
              <TableCell>{row.month}</TableCell>
              <TableCell>{row.emi}</TableCell>
              <TableCell>{row.interest}</TableCell>
              <TableCell>{row.principalPaid}</TableCell>
              <TableCell>{row.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AmortizationTable;
