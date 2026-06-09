import { jsPDF } from 'jspdf';
import { formatCurrency, formatMonths } from './formatters';

const toCsvValue = (value) => {
  const stringValue = String(value ?? '');
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export const downloadCsv = (schedule, filename = 'amortization-schedule.csv') => {
  const rows = [
    ['Month', 'Payment', 'EMI', 'Extra Payment', 'Interest', 'Principal', 'Balance'],
    ...schedule.map((row) => [
      row.month,
      row.payment.toFixed(2),
      row.emi.toFixed(2),
      row.extraPayment.toFixed(2),
      row.interest.toFixed(2),
      row.principalPaid.toFixed(2),
      row.balance.toFixed(2),
    ]),
  ];
  const csv = rows.map((row) => row.map(toCsvValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadPdf = ({
  schedule,
  summary,
  filename = 'amortization-schedule.pdf',
}) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const headers = ['Month', 'Payment', 'Interest', 'Principal', 'Balance'];
  const columns = [14, 38, 72, 106, 146];
  let y = 18;

  doc.setFontSize(16);
  doc.text('Amortization Schedule', 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Monthly EMI: ${formatCurrency(summary.emi)}`, 14, y);
  doc.text(`Payoff: ${formatMonths(summary.payoffMonths)}`, 100, y);
  y += 6;
  doc.text(`Total Interest: ${formatCurrency(summary.totalInterest)}`, 14, y);
  doc.text(`Total Payment: ${formatCurrency(summary.totalPayment)}`, 100, y);
  y += 12;

  const drawHeaders = () => {
    doc.setFont(undefined, 'bold');
    headers.forEach((header, index) => doc.text(header, columns[index], y));
    doc.setFont(undefined, 'normal');
    y += 6;
  };

  drawHeaders();

  schedule.forEach((row) => {
    if (y > pageHeight - 16) {
      doc.addPage();
      y = 18;
      drawHeaders();
    }

    [
      row.month,
      formatCurrency(row.payment),
      formatCurrency(row.interest),
      formatCurrency(row.principalPaid),
      formatCurrency(row.balance),
    ].forEach((value, index) => doc.text(String(value), columns[index], y));
    y += 6;
  });

  doc.save(filename);
};
