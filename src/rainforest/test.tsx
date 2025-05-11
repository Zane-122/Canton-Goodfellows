import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CartoonContainer from '../components/containers/CartoonContainer';
import CartoonInput from '../components/inputs/CartoonInput';
interface SearchResult {
  title: string;
  price?: {
    value: number;
    currency: string;
  };
  image: string;
  asin: string;
}

interface RainforestResponse {
  search_results?: SearchResult[];
}

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #CA242B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'TT Trick New', serif;
  font-weight: 600;

  &:hover {
    background-color: #a61d23;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResultItem = styled.div`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: white;
  font-family: 'Coolvetica Rg', sans-serif;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  background-color: white;
  border-radius: 5px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const Test: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchToys = async () => {
    setLoading(true);
    try {
      const params = {
        api_key: "EDFE78F1FABE4DB3BF41DA41678398B5",
        amazon_domain: "amazon.com",
        search_term: "toy",
        type: "search"
      };

      const response = await axios.get<RainforestResponse>('https://api.rainforestapi.com/request', { params: { ...params, search_term: search } });
      setResults(response.data.search_results?.slice(0, 20) || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
        <CartoonInput value={search} onChange={(e) => setSearch(e)} />

      <SearchButton onClick={searchToys} disabled={loading}>
        {loading ? 'Searching...' : 'Search for Toys'}
      </SearchButton>
      
      <ResultsContainer>
        {results.map((item, index) => (
          <ResultItem key={index}>
            <ItemImage src={item.image} alt={item.title} />
            <ItemDetails>
              <div>{item.title}</div>
              <div style={{ fontSize: '0.8em', opacity: 0.7 }}>ITEM ID: {item.asin}</div>
              {item.price && <div>${item.price.value}</div>}
            </ItemDetails>
          </ResultItem>
        ))}ei
      </ResultsContainer>
    </div>
  );
};

export default Test;