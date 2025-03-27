export const khrFields = [
  "100000R",
  "50000R",
  "20000R",
  "10000R",
  "5000R",
  "1000R",
  "500R",
  "100R",
] as const;

export const usdFields = ["100$", "50$", "20$", "10$", "5$", "1$"] as const;

export const generateTotalAmount = (
  currency: Record<string, number>
): number => {
  return Object.entries(currency).reduce((acc, [key, value]) => {
    const keyNum = parseInt(key.replace(/[^\d]/g, "")); // Extract the numeric part of the key
    return acc + (isNaN(keyNum) ? 0 : keyNum * value); // Multiply if key is a valid number
  }, 0);
};

export const generateDefaultValues = (fields: readonly string[]) => {
  return fields.reduce((acc, field) => {
    acc[field] = 0; // Set default value to 0 for each field
    return acc;
  }, {} as Record<string, number>);
};

export const getKhrMultiplier = (field: string) => {
  const multipliers: Record<string, number> = {
    "100000R": 100000,
    "50000R": 50000,
    "20000R": 20000,
    "10000R": 10000,
    "5000R": 5000,
    "1000R": 1000,
    "500R": 500,
    "100R": 100,
  };
  return multipliers[field] || 0;
};

// Multipliers for USD and KHR bills
export const getUsdMultiplier = (field: string) => {
  const multipliers: Record<string, number> = {
    "100$": 100,
    "50$": 50,
    "20$": 20,
    "10$": 10,
    "5$": 5,
    "1$": 1,
  };
  return multipliers[field] || 0;
};
