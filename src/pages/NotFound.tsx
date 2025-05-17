import styled from "styled-components";
import { Link } from "react-router-dom";
import CartoonButton from "../components/buttons/CartoonButton";
import CartoonContainer from "../components/containers/CartoonContainer";
import CartoonHeader from "../components/headers/CartoonHeader";
import SnowyGround from "../components/effects/SnowyGround";
import Snowfall from "../components/effects/Snowfall";
import Navbar from "../components/Navbar";
import { useState } from "react";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: radial-gradient(circle at 50% 200%, #87CEEB 50%, #4169E1 70%, #1E3A8A 100%);
    background-attachment: fixed;
    position: relative;
    overflow-x: hidden;
    min-height: 100vh;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4vmin;
    gap: 4vmin;
    flex: 1;
    margin-top: 15vh;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
`;

const StyledContainer = styled(CartoonContainer)`
    width: fit-content;
    height: fit-content;
`;

export const NotFound = () => {
    const [isThinking, setIsThinking] = useState(true);

    return (
        <PageContainer>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Snowfall />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <ContentContainer>
                    <div 
                        onClick={() => setIsThinking(!isThinking)}
                        style={{ cursor: 'pointer' }}
                    >
                        <StyledContainer color="#CA242B">
                            <CartoonHeader 
                                title="Whoops!" 
                                color="#ffe6e6"
                                fontSize="10vmin"
                            />
                            <br />
                            <CartoonHeader 
                                title={isThinking ? "404" : "Yo Ho Ho!"} 
                                color="#ffe6e6"
                            />
                            <CartoonHeader 
                                title="This place doesn't exist..." 
                                color="#ffe6e6"
                            />
                            <CartoonHeader 
                                title={isThinking ? "🤔" : "🎅"} 
                                color="#ffe6e6"
                                fontSize="6vmin"
                            />
                        </StyledContainer>
                    </div>

                    <Link to="/">
                        <CartoonButton color="#CA242B">
                            <CartoonHeader 
                                title="Take me home!"
                                color="#ffe6e6"
                                fontSize="4vmin"
                            />
                        </CartoonButton>
                    </Link>
                </ContentContainer>
            </div>
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 0 }}>
                <SnowyGround />
            </div>
        </PageContainer>
    );
}