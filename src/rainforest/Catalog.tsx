import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CartoonContainer from '../components/containers/CartoonContainer';
import CartoonInput from '../components/inputs/CartoonInput';
import Button from '../components/buttons/CartoonButton';
import { addChildToy, Toy, getChildren, Child, getWishlist } from '../firebase/families';
import Snowfall from '../components/effects/Snowfall';
import CartoonHeader from '../components/headers/CartoonHeader';
import SnowyGround from '../components/effects/SnowyGround';
import Navbar from '../components/Navbar';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import SelectionField from '../components/inputs/SelectionField';

interface RainforestResponse {
  search_results?: Toy[];
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
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  overflow-x: hidden;
`;

const CatalogContainer = styled(CartoonContainer)`
  width: 48vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
`;

const FadeInCard = styled(CatalogContainer)<{ delay: number }>`
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
  animation-delay: ${props => props.delay}s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ChildContainer = styled.div`
  width: 30vw;
  height: 20vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  border: 3px solid black;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
`;

const CardImage = styled.img`
  width: 20vh;
  height: 20vh;
  object-fit: contain;
  background-color: white;
  border-radius: 10px;
  border: 3px solid rgb(0, 0, 0);
  padding: 10px;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
  transform: rotate(0deg);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 10;

  &:hover {
    transform: rotate(3deg) scale(1.2);
  }
`;

const PriceTag = styled.div`
  font-size: 1.2em;
  color: #CA242B;
  font-weight: bold;
  font-family: 'TT Trick New', serif;
`;

const MemoizedSnowfall = memo(Snowfall);

interface CatalogCardProps {
  title: string;
  price: string;
  image: string;
  inWishlist: boolean;
  onToggleWishlist: () => void;
  isLoading?: boolean;
}

const ScaledText = styled.div<{ isTitle?: boolean }>`
  color: black;
  font-family: 'TT Trick New', serif;
  font-weight: 600;
  text-align: center;
  width: 100%;
  padding: 0 10px;
  font-size: ${props => props.isTitle ? '1.5em' : '1.2em'};
  white-space: normal;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2;
`;

const CatalogCard: React.FC<CatalogCardProps> = ({ title, price, image, inWishlist, onToggleWishlist, isLoading }) => {
  return (
    <CatalogContainer>
      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
        <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
          <CardImage src={image} alt={title} />
          <ChildContainer>
            <ScaledText isTitle>{title}</ScaledText>
            <ScaledText>{price}</ScaledText>
          </ChildContainer>
        </div>
        <Button 
          color={inWishlist ? "#CA242B" : "#00BCD4"} 
          disabled={isLoading} 
          onClick={onToggleWishlist}
        >
          {isLoading ? 'Loading...' : inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        </Button>
      </div>
    </CatalogContainer>
  );
};

const GlobalStyle = styled.div`
  * {
    max-width: 100vw;
    overflow-x: hidden;
  }
`;

interface CatalogProps {
  familyID: string;
}

const SearchBarContainer = styled(CartoonContainer)`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchInput = styled(CartoonInput)`
  flex: 1;
  border: none;
  background: white;
  border-radius: 10px;
  padding: 10px;
  font-family: 'TT Trick New', serif;
  font-size: 1.1em;
  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
  border: 3px solid black;

  &:focus {
    outline: none;
  }
`;

const SearchBar: React.FC<{ onSearch: (term: string) => void, loading: boolean }> = ({ onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchBarContainer>
        <SearchInput 
          value={searchTerm} 
          onChange={(value) => setSearchTerm(value)} 
          placeholder="Search for toys..."
        />
        <Button 
          color="#00BCD4" 
          disabled={loading} 
          onClick={() => onSearch(searchTerm)}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </SearchBarContainer>
    </form>
  );
};
interface WishlistProps {
  familyID: string;
  childID: string;
}

const Catalog: React.FC<CatalogProps> = ({familyID}) => {
  const [results, setResults] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(false);
  const [childID, setChildID] = useState<string>("Child A");
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [viewWishlist, setViewWishlist] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [wishlistToys, setWishlistToys] = useState<Toy[]>([]);

  useEffect(() => {
    const loadChildren = async () => {
      const fetchedChildren = await getChildren(familyID);
      setChildren(fetchedChildren);
    };
    loadChildren();
  }, [familyID]);

  useEffect(() => {
    const loadWishlist = async () => {
      const wishlist = await getWishlist(familyID, childID);
      setWishlistItems(new Set(wishlist.map((toy) => toy.asin)));
      setWishlistToys(wishlist);
    };
    loadWishlist();
  }, [familyID, childID]);

  const searchToys = async (searchTerm: string) => {
    setLoading(true);
    try {
      const params = {
        api_key: "EDFE78F1FABE4DB3BF41DA41678398B5",
        amazon_domain: "amazon.com",
        search_term: searchTerm,
        type: "search"
      };

      const response = await axios.get<RainforestResponse>('https://api.rainforestapi.com/request', { params });
      setResults([]);
      setTimeout(() => {
        setResults(response.data.search_results?.slice(0, 10) || []);
      }, 50);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (item: Toy) => {
    setLoadingItems(prev => new Set([...prev, item.asin]));
    try {
      const familyRef = doc(db, "families", familyID);
      const familyDoc = await getDoc(familyRef);
      if (!familyDoc.exists()) {
        throw new Error("Family document not found");
      }

      const familyData = familyDoc.data()?.family;
      if (!familyData || !familyData.Children) {
        throw new Error("Family data or children not found");
      }

      const allChildren = familyData.Children;
      const chosenChild = allChildren.find((child: Child) => child.ChildID === childID);
      if (!chosenChild) {
        throw new Error("Child not found");
      }

      if (wishlistItems.has(item.asin)) {
        // Remove from wishlist
        const updatedToys = chosenChild.ChildToys.filter((t: Toy) => t.asin !== item.asin);
        const updatedChildren = allChildren.map((child: Child) => 
          child.ChildID === childID 
            ? { ...child, ChildToys: updatedToys }
            : child
        );

        await updateDoc(familyRef, {
          "family.Children": updatedChildren
        });
        
        setWishlistItems(prev => {
          const next = new Set(prev);
          next.delete(item.asin);
          return next;
        });
        
        // Update wishlistToys state to remove the item
        setWishlistToys(prev => prev.filter(toy => toy.asin !== item.asin));
      } else {
        // Add to wishlist
        await addChildToy(item, familyID, childID);
        setWishlistItems(prev => new Set([...prev, item.asin]));
        
        // Update wishlistToys state to add the item
        setWishlistToys(prev => [...prev, item]);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(item.asin);
        return next;
      });
    }
  };

  const getGenderColor = (childID: string) => {
    return children.find(child => child.ChildID === childID)?.ChildGender === "Boy" ? "#00BCD4" : children.find(child => child.ChildID === childID)?.ChildGender === "Girl" ? "#FF69B4" : "#9C27B0";
  }
  return (
    <>
      <Navbar />
      <MemoizedSnowfall />
      <div style={{ padding: '20px', marginTop: '15vh', minHeight: '100vh', display: "flex", flexDirection: "column", gap: "20px"}}>
      <CartoonHeader color="#FFFFFF" title={`${childID}'s ${viewWishlist ? "Wishlist" : "Gift Catalog"}`} subtitle={viewWishlist ? "These are the items on your wishlist" : `Add items to your wishlist!`}/>
        <div style={{
          display: "flex", 
          flexDirection: "row", 
          gap: "20px", 
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          margin: "0 auto"
        }}>
          <SelectionField 
            options={children.map(child => ({ label: child.ChildID, value: child.ChildID }))}
            value={childID}
            onChange={setChildID}
            backgroundColor="#F5F5F5"
            selectionColor={getGenderColor(childID)}
          />
          <Button 
            color={getGenderColor(childID)}
            onClick={() => { setViewWishlist(!viewWishlist) }}
            disabled={false}
          > 
            <p> {`${viewWishlist ? "View Catalog" : "View Wishlist"}`}</p>
          </Button>
        </div>
        {viewWishlist ? (
          <>
          <ResultsContainer>
              {wishlistToys.map((item, index) => (
                <FadeInCard 
                  key={index} 
                  delay={index * 0.1}
                >
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
                      <CardImage src={item.image} alt={item.title} />
                      <ChildContainer>
                        <ScaledText isTitle>{item.title}</ScaledText>
                        <ScaledText>{item.price ? `${item.price.currency} ${item.price.value}` : 'Price not available'}</ScaledText>
                      </ChildContainer>
                    </div>
                    <Button 
                      color="#CA242B"
                      disabled={loadingItems.has(item.asin)} 
                      onClick={() => handleToggleWishlist(item)}
                    >
                      {loadingItems.has(item.asin) ? 'Loading...' : "Remove from wishlist"}
                    </Button>
                  </div>
                </FadeInCard>
              ))}
            </ResultsContainer>
          </>
        ) : (
          <>
            <SearchBar onSearch={searchToys} loading={loading} />
            <ResultsContainer>
              {results.map((item, index) => (
                <FadeInCard 
                  key={index} 
                  delay={index * 0.1}
                >
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    <div style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center"}}>
                      <CardImage src={item.image} alt={item.title} />
                      <ChildContainer>
                        <ScaledText isTitle>{item.title}</ScaledText>
                        <ScaledText>{item.price ? `${item.price.currency} ${item.price.value}` : 'Price not available'}</ScaledText>
                      </ChildContainer>
                    </div>
                    <Button 
                      color={wishlistItems.has(item.asin) ? "#CA242B" : "#00BCD4"} 
                      disabled={loadingItems.has(item.asin)} 
                      onClick={() => handleToggleWishlist(item)}
                    >
                      {loadingItems.has(item.asin) ? 'Loading...' : wishlistItems.has(item.asin) ? "Remove from wishlist" : "Add to wishlist"}
                    </Button>
                  </div>
                </FadeInCard>
              ))}
            </ResultsContainer>
          </>
        )}
      </div>
      <SnowyGround />
    </>
  );
};

export default Catalog;