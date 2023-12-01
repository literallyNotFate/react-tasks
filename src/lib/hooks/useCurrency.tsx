import axios from "axios";
import { useState, useEffect } from "react";

const useCurrency = () => {
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );

        const data = response.data;

        if (response.status !== 200) {
          throw new Error("Failed to fetch exchange rates");
        }

        setRates(data.rates);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }

        setRates({});
      }
    };

    fetchRate();
  }, []);

  const convert = (amount: number, from: string, to: string) => {
    return (amount / rates[from]) * rates[to];
  };

  return { convert, error };
};

export default useCurrency;
