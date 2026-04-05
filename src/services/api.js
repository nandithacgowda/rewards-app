import logger from "../logger";
const fetchTransactions = () => {
  logger.info("Fetching transactions from mock API...");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch("/data/transactions.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          logger.info(`Successfully fetched ${data.length} transactions`);
          resolve(data);
        })
        .catch((error) => {
          logger.error({ error: error.message }, "Error fetching transactions");
          reject(error);
        });
    }, 1000); 
  });
};

export default fetchTransactions;
