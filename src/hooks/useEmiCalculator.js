import { useMemo } from 'react';
import { calculateEmi } from '../utils/loanCalculations';

const useEmiCalculator = (principal, rate, months) =>
  useMemo(
    () => calculateEmi(principal, rate, months),
    [principal, rate, months]
  );

export default useEmiCalculator;
