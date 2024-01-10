import "dotenv/config";

export const config = {
  currency: {
    USD: {
      min: 10,
      max: 20000,
    },
    CLP: {
      min: 1000,
      max: 90000,
    },
    ARS: {
      min: 900,
      max: 80000,
    },
    EUR: {
      min: 50,
      max: 30000,
    },
    TRY: {
      min: 300,
      max: 3000,
    },
    GBP: {
      min: 20,
      max: 10000,
    },
  },
  API: {
    API_KEY: process.env.API_KEY,
  },
};
