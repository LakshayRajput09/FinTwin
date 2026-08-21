import { loadFinancialData } from "./data/financialStore";

loadFinancialData()
  .then((data) => {
    console.log(
      "DATABASE TEST SUCCESS:",
      data
    );
  })
  .catch((error) => {
    console.error(
      "DATABASE TEST FAILED:",
      error
    );
  });