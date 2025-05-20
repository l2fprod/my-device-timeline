export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getYearOptions = (): number[] => {
  const currentYear = getCurrentYear();
  const startYear = 1970; // Assuming electronic devices timeline starts from 1970
  const years = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};

export const formatTimeRange = (startYear: number, endYear: number | null): string => {
  if (endYear === null) {
    return startYear.toString();
  } 
  
  if (startYear === endYear) {
    return startYear.toString();
  }
  
  return `${startYear} - ${endYear}`;
};