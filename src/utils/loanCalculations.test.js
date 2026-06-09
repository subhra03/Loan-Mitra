import {
  calculateEmi,
  calculateLoanResult,
  calculateOfferResult,
  compareLoanOffers,
  validateLoanInputs,
} from './loanCalculations';

describe('calculateEmi', () => {
  test('calculates monthly EMI for a standard interest-bearing loan', () => {
    expect(calculateEmi(100000, 12, 12)).toBeCloseTo(8884.88, 2);
  });

  test('calculates monthly EMI for a zero-interest loan', () => {
    expect(calculateEmi(12000, 0, 12)).toBe(1000);
  });

  test('returns 0 for invalid loan values', () => {
    expect(calculateEmi(-1000, 10, 12)).toBe(0);
    expect(calculateEmi(1000, -10, 12)).toBe(0);
    expect(calculateEmi(1000, 10, 0)).toBe(0);
  });
});

describe('validateLoanInputs', () => {
  test('accepts positive principal, non-negative rate, and year tenure', () => {
    const validation = validateLoanInputs({
      principal: '12000',
      rate: '0',
      tenureValue: '1.5',
      tenureUnit: 'years',
      extraPayment: '100',
    });

    expect(validation.errors).toEqual({});
    expect(validation.isValid).toBe(true);
    expect(validation.values).toEqual(expect.objectContaining({
      loanPurpose: 'standard',
      principal: 12000,
      rate: 0,
      tenureValue: 1.5,
      tenureUnit: 'years',
      months: 18,
      extraPayment: 100,
    }));
  });

  test('calculates financed amount from vehicle price and down payment', () => {
    const validation = validateLoanInputs({
      loanPurpose: 'vehicle',
      vehicleType: 'bike',
      vehiclePrice: '150000',
      downPayment: '30000',
      rate: '10',
      tenureValue: '24',
      tenureUnit: 'months',
    });

    expect(validation.errors).toEqual({});
    expect(validation.isValid).toBe(true);
    expect(validation.values).toEqual(expect.objectContaining({
      loanPurpose: 'vehicle',
      vehicleType: 'bike',
      vehiclePrice: 150000,
      downPayment: 30000,
      principal: 120000,
      rate: 10,
      months: 24,
    }));
  });

  test('rejects missing and invalid values', () => {
    const validation = validateLoanInputs({
      principal: '',
      rate: '-1',
      tenureValue: '1.1',
      tenureUnit: 'years',
      extraPayment: '-50',
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toEqual({
      principal: 'Loan amount is required',
      rate: 'Interest rate cannot be negative',
      tenureValue: 'Tenure must resolve to whole months',
      extraPayment: 'Extra payment cannot be negative',
    });
  });

  test('rejects a vehicle down payment that is not less than the price', () => {
    const validation = validateLoanInputs({
      loanPurpose: 'vehicle',
      vehiclePrice: '500000',
      downPayment: '500000',
      rate: '9',
      tenureValue: '3',
      tenureUnit: 'years',
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors.downPayment).toBe(
      'Down payment must be less than vehicle price'
    );
  });
});

describe('calculateLoanResult', () => {
  test('shows payoff and interest savings from extra monthly payments', () => {
    const result = calculateLoanResult({
      principal: 12000,
      rate: 0,
      tenureValue: 1,
      tenureUnit: 'years',
      extraPayment: 100,
    });

    expect(result.months).toBe(12);
    expect(result.emi).toBe(1000);
    expect(result.payoffMonths).toBe(11);
    expect(result.monthsSaved).toBe(1);
    expect(result.totalInterest).toBe(0);
    expect(result.schedule).toHaveLength(11);
  });

  test('returns vehicle loan details with calculated financed principal', () => {
    const validation = validateLoanInputs({
      loanPurpose: 'vehicle',
      vehicleType: 'car',
      vehiclePrice: '1000000',
      downPayment: '200000',
      rate: '10',
      tenureValue: '5',
      tenureUnit: 'years',
    });
    const result = calculateLoanResult(validation.values);

    expect(result).toEqual(expect.objectContaining({
      loanPurpose: 'vehicle',
      vehicleType: 'car',
      vehiclePrice: 1000000,
      downPayment: 200000,
      principal: 800000,
      months: 60,
    }));
    expect(result.emi).toBeGreaterThan(0);
  });
});

describe('offer comparison', () => {
  test('calculates total offer cost including processing fee', () => {
    const offer = calculateOfferResult({
      lenderName: 'Bank A',
      principal: 500000,
      rate: 10,
      tenureValue: 5,
      tenureUnit: 'years',
      processingFee: 5000,
    });

    expect(offer.lenderName).toBe('Bank A');
    expect(offer.months).toBe(60);
    expect(offer.emi).toBeGreaterThan(0);
    expect(offer.totalCost).toBeCloseTo(offer.totalPayment + 5000, 2);
    expect(offer.isValid).toBe(true);
  });

  test('finds the cheaper loan offer by total cost', () => {
    const bankA = calculateOfferResult({
      lenderName: 'Bank A',
      principal: 500000,
      rate: 10,
      months: 60,
      processingFee: 0,
    });
    const bankB = calculateOfferResult({
      lenderName: 'Bank B',
      principal: 500000,
      rate: 9,
      months: 60,
      processingFee: 2000,
    });
    const comparison = compareLoanOffers([bankA, bankB]);

    expect(comparison.winner.lenderName).toBe('Bank B');
    expect(comparison.savings).toBeGreaterThan(0);
  });
});
