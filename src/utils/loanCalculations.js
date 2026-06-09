export const calculateEmi = (principal, annualRate, months) => {
  const amount = Number(principal);
  const rate = Number(annualRate);
  const term = Number(months);

  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(term) ||
    amount <= 0 ||
    rate < 0 ||
    term <= 0
  ) {
    return 0;
  }

  if (rate === 0) {
    return amount / term;
  }

  const monthlyRate = rate / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, term);

  return (amount * monthlyRate * growthFactor) / (growthFactor - 1);
};

export const getMonthsFromTenure = (tenureValue, tenureUnit = 'months') => {
  const tenure = Number(tenureValue);

  if (!Number.isFinite(tenure)) {
    return NaN;
  }

  return tenureUnit === 'years' ? tenure * 12 : tenure;
};

export const getVehicleLoanAmount = (vehiclePrice, downPayment) =>
  Number(vehiclePrice) - Number(downPayment || 0);

export const generateAmortizationSchedule = ({
  principal,
  rate,
  months,
  emi,
  extraPayment = 0,
}) => {
  const amount = Number(principal);
  const annualRate = Number(rate);
  const term = Number(months);
  const monthlyEmi = Number(emi);
  const monthlyExtra = Math.max(0, Number(extraPayment) || 0);

  if (
    amount <= 0 ||
    annualRate < 0 ||
    term <= 0 ||
    monthlyEmi <= 0 ||
    !Number.isFinite(amount) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(term) ||
    !Number.isFinite(monthlyEmi)
  ) {
    return [];
  }

  const monthlyRate = annualRate / 12 / 100;
  let balance = amount;
  const schedule = [];

  for (let month = 1; month <= term && balance > 0.005; month += 1) {
    const interest = balance * monthlyRate;
    const scheduledPrincipal = Math.min(Math.max(monthlyEmi - interest, 0), balance);
    const extraPrincipal = Math.min(
      monthlyExtra,
      Math.max(balance - scheduledPrincipal, 0)
    );
    const principalPaid = scheduledPrincipal + extraPrincipal;
    const payment = interest + principalPaid;

    balance = Math.max(balance - principalPaid, 0);

    schedule.push({
      month,
      payment,
      emi: Math.min(monthlyEmi, payment),
      extraPayment: extraPrincipal,
      interest,
      principalPaid,
      balance,
    });
  }

  return schedule;
};

export const summarizeSchedule = (schedule, principal) => {
  const totalInterest = schedule.reduce((total, row) => total + row.interest, 0);
  const totalPayment = schedule.reduce((total, row) => total + row.payment, 0);

  return {
    principal: Number(principal),
    payoffMonths: schedule.length,
    totalInterest,
    totalPayment,
  };
};

export const calculateOfferResult = ({
  lenderName = 'Offer',
  principal,
  rate,
  months,
  tenureValue,
  tenureUnit = 'months',
  processingFee = 0,
}) => {
  const normalizedPrincipal = Number(principal);
  const normalizedRate = Number(rate);
  const normalizedMonths = Number(
    months ?? getMonthsFromTenure(tenureValue, tenureUnit)
  );
  const normalizedProcessingFee = Math.max(0, Number(processingFee) || 0);
  const emi = calculateEmi(
    normalizedPrincipal,
    normalizedRate,
    normalizedMonths
  );
  const totalPayment = emi * normalizedMonths;
  const totalInterest = Math.max(totalPayment - normalizedPrincipal, 0);
  const totalCost = totalPayment + normalizedProcessingFee;
  const isValid =
    normalizedPrincipal > 0 &&
    normalizedRate >= 0 &&
    normalizedMonths > 0 &&
    Number.isInteger(normalizedMonths) &&
    emi > 0;

  return {
    lenderName,
    principal: normalizedPrincipal,
    rate: normalizedRate,
    months: normalizedMonths,
    tenureValue: Number(tenureValue ?? normalizedMonths),
    tenureUnit,
    processingFee: normalizedProcessingFee,
    emi,
    totalInterest,
    totalPayment,
    totalCost,
    isValid,
  };
};

export const compareLoanOffers = (offers) => {
  const validOffers = offers.filter((offer) => offer.isValid);

  if (validOffers.length < 2) {
    return {
      winner: null,
      savings: 0,
    };
  }

  const sortedOffers = [...validOffers].sort((a, b) => a.totalCost - b.totalCost);
  const [winner, nextBest] = sortedOffers;

  return {
    winner,
    savings: Math.max(nextBest.totalCost - winner.totalCost, 0),
  };
};

export const calculateLoanResult = ({
  loanPurpose = 'standard',
  vehicleType = 'car',
  vehiclePrice,
  downPayment = 0,
  principal,
  rate,
  months,
  tenureValue,
  tenureUnit = 'months',
  extraPayment = 0,
}) => {
  const normalizedLoanPurpose = loanPurpose === 'vehicle' ? 'vehicle' : 'standard';
  const normalizedPrincipal = Number(principal);
  const normalizedRate = Number(rate);
  const normalizedMonths = Number(
    months ?? getMonthsFromTenure(tenureValue, tenureUnit)
  );
  const normalizedExtraPayment = Math.max(0, Number(extraPayment) || 0);
  const emi = calculateEmi(normalizedPrincipal, normalizedRate, normalizedMonths);
  const schedule = generateAmortizationSchedule({
    principal: normalizedPrincipal,
    rate: normalizedRate,
    months: normalizedMonths,
    emi,
    extraPayment: normalizedExtraPayment,
  });
  const baselineSchedule = generateAmortizationSchedule({
    principal: normalizedPrincipal,
    rate: normalizedRate,
    months: normalizedMonths,
    emi,
    extraPayment: 0,
  });
  const summary = summarizeSchedule(schedule, normalizedPrincipal);
  const baselineSummary = summarizeSchedule(baselineSchedule, normalizedPrincipal);

  return {
    loanPurpose: normalizedLoanPurpose,
    vehicleType,
    vehiclePrice:
      normalizedLoanPurpose === 'vehicle' ? Number(vehiclePrice) : undefined,
    downPayment:
      normalizedLoanPurpose === 'vehicle' ? Number(downPayment || 0) : 0,
    principal: normalizedPrincipal,
    rate: normalizedRate,
    months: normalizedMonths,
    tenureValue: Number(tenureValue ?? normalizedMonths),
    tenureUnit,
    extraPayment: normalizedExtraPayment,
    emi,
    schedule,
    baselineSchedule,
    ...summary,
    baseline: baselineSummary,
    interestSaved: Math.max(
      baselineSummary.totalInterest - summary.totalInterest,
      0
    ),
    monthsSaved: Math.max(baselineSummary.payoffMonths - summary.payoffMonths, 0),
  };
};

export const validateLoanInputs = ({
  loanPurpose = 'standard',
  vehicleType = 'car',
  vehiclePrice = '',
  downPayment = '',
  principal,
  rate,
  months,
  tenureValue,
  tenureUnit = 'months',
  extraPayment = '',
}) => {
  const rawTenure = tenureValue ?? months;
  const normalizedLoanPurpose = loanPurpose === 'vehicle' ? 'vehicle' : 'standard';
  const normalizedVehicleType = vehicleType === 'bike' ? 'bike' : 'car';
  const normalizedVehiclePrice = vehiclePrice === '' ? NaN : Number(vehiclePrice);
  const normalizedDownPayment = downPayment === '' ? 0 : Number(downPayment);
  const normalizedPrincipal =
    normalizedLoanPurpose === 'vehicle'
      ? getVehicleLoanAmount(normalizedVehiclePrice, normalizedDownPayment)
      : Number(principal);
  const normalizedTenureUnit = tenureUnit === 'years' ? 'years' : 'months';
  const normalizedMonths = getMonthsFromTenure(rawTenure, normalizedTenureUnit);
  const normalizedExtraPayment = extraPayment === '' ? 0 : Number(extraPayment);
  const values = {
    loanPurpose: normalizedLoanPurpose,
    vehicleType: normalizedVehicleType,
    vehiclePrice: normalizedVehiclePrice,
    downPayment: normalizedDownPayment,
    principal: normalizedPrincipal,
    rate: Number(rate),
    tenureValue: Number(rawTenure),
    tenureUnit: normalizedTenureUnit,
    months: normalizedMonths,
    extraPayment: normalizedExtraPayment,
  };

  const errors = {};

  if (normalizedLoanPurpose === 'vehicle') {
    if (vehiclePrice === '') {
      errors.vehiclePrice = 'Vehicle price is required';
    } else if (
      !Number.isFinite(normalizedVehiclePrice) ||
      normalizedVehiclePrice <= 0
    ) {
      errors.vehiclePrice = 'Vehicle price must be greater than 0';
    }

    if (
      downPayment !== '' &&
      (!Number.isFinite(normalizedDownPayment) || normalizedDownPayment < 0)
    ) {
      errors.downPayment = 'Down payment cannot be negative';
    } else if (
      Number.isFinite(normalizedVehiclePrice) &&
      Number.isFinite(normalizedDownPayment) &&
      normalizedDownPayment >= normalizedVehiclePrice
    ) {
      errors.downPayment = 'Down payment must be less than vehicle price';
    }

    if (!errors.vehiclePrice && !errors.downPayment && normalizedPrincipal <= 0) {
      errors.vehiclePrice = 'Financed amount must be greater than 0';
    }
  } else if (principal === '') {
    errors.principal = 'Loan amount is required';
  } else if (!Number.isFinite(values.principal) || values.principal <= 0) {
    errors.principal = 'Loan amount must be greater than 0';
  }

  if (rate === '') {
    errors.rate = 'Interest rate is required';
  } else if (!Number.isFinite(values.rate) || values.rate < 0) {
    errors.rate = 'Interest rate cannot be negative';
  }

  if (rawTenure === '') {
    errors.tenureValue = 'Tenure is required';
  } else if (
    !Number.isFinite(normalizedMonths) ||
    normalizedMonths <= 0 ||
    !Number.isInteger(normalizedMonths)
  ) {
    errors.tenureValue = 'Tenure must resolve to whole months';
  }

  if (
    extraPayment !== '' &&
    (!Number.isFinite(normalizedExtraPayment) || normalizedExtraPayment < 0)
  ) {
    errors.extraPayment = 'Extra payment cannot be negative';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    values,
  };
};
