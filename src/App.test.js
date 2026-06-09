import { fireEvent, render, screen } from '@testing-library/react';
import Calculator from './components/Calculator';

test('validates calculator inputs before allowing submission', () => {
  const onCalculate = jest.fn();

  render(<Calculator onCalculate={onCalculate} />);

  const calculateButton = screen.getByRole('button', { name: /calculate/i });
  const principalInput = screen.getByLabelText(/loan amount/i);
  const rateInput = screen.getByLabelText(/annual interest rate/i);
  const tenureInput = screen.getByLabelText(/tenure \(months\)/i);
  const extraPaymentInput = screen.getByLabelText(/extra monthly prepayment/i);

  expect(calculateButton).toBeDisabled();

  fireEvent.change(principalInput, { target: { value: '-100' } });
  fireEvent.blur(principalInput);

  expect(screen.getByText(/loan amount must be greater than 0/i)).toBeInTheDocument();
  expect(calculateButton).toBeDisabled();

  fireEvent.change(principalInput, { target: { value: '12000' } });
  fireEvent.change(rateInput, { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: /years/i }));
  fireEvent.change(tenureInput, { target: { value: '1' } });
  fireEvent.change(extraPaymentInput, { target: { value: '100' } });

  expect(calculateButton).toBeEnabled();

  fireEvent.click(calculateButton);

  expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({
    loanPurpose: 'standard',
    principal: 12000,
    rate: 0,
    months: 12,
    tenureValue: 1,
    tenureUnit: 'years',
    extraPayment: 100,
    emi: 1000,
    payoffMonths: 11,
    monthsSaved: 1,
  }));
});

test('calculates a vehicle loan from price and down payment', () => {
  const onCalculate = jest.fn();

  render(<Calculator onCalculate={onCalculate} />);

  fireEvent.click(screen.getByRole('button', { name: /car or bike loan/i }));
  fireEvent.change(screen.getByLabelText(/car price/i), {
    target: { value: '1000000' },
  });
  fireEvent.change(screen.getByLabelText(/down payment/i), {
    target: { value: '200000' },
  });
  fireEvent.change(screen.getByLabelText(/annual interest rate/i), {
    target: { value: '10' },
  });
  fireEvent.click(screen.getByRole('button', { name: /years/i }));
  fireEvent.change(screen.getByLabelText(/tenure \(years\)/i), {
    target: { value: '5' },
  });

  expect(screen.getByText(/financed amount/i)).toHaveTextContent('8,00,000');

  fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

  expect(onCalculate).toHaveBeenCalledWith(expect.objectContaining({
    loanPurpose: 'vehicle',
    vehicleType: 'car',
    vehiclePrice: 1000000,
    downPayment: 200000,
    principal: 800000,
    months: 60,
  }));
});
