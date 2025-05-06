const useEmiCalculator = (principal, rate, months) => {
    const r = rate / 12 / 100;
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return emi || 0;
  };
  
  export default useEmiCalculator;
  