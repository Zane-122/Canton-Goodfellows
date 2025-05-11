import React, { useEffect } from 'react';

interface RainforestResponse {
  // Add specific response type if needed
  [key: string]: any;
}

const Test: React.FC = () => {
  useEffect(() => {
    const params = new URLSearchParams({
      api_key: "EDFE78F1FABE4DB3BF41DA41678398B5",
      amazon_domain: "amazon.com",
      asin: "B073JYC4XM",
      type: "product"
    });

    fetch(`https://api.rainforestapi.com/request?${params}`)
      .then(response => response.json())
      .then((data: RainforestResponse) => {
        // print the JSON response from Rainforest API
        console.log(JSON.stringify(data, null, 2));
      })
      .catch(error => {
        // catch and print the error
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Rainforest API Test</h1>
    </div>
  );
};

export default Test;