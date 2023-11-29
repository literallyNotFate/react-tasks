export const parseDateFromString = (
  string: string,
  char: string
): Date | null => {
  const [day, month, year] = string.split(char).map(Number);

  if (day && month && year) {
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};
