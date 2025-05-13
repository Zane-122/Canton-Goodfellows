import React, { useState } from 'react';
import CartoonContainer from './CartoonContainer';
import CartoonInput from '../inputs/CartoonInput';
import styled, { createGlobalStyle } from 'styled-components';
import CartoonToggleButton from '../buttons/CartoonToggleButton';

interface FormCardProps {
    title: string;
    type: string;
    subtitle?: string;
}
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Coolvetica Rg';
    src: url('/fonts/Coolvetica Rg.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'TT Trick New';
    src: url('/fonts/TT Tricks Trial DemiBold.otf') format('opentype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  * {
    font-family: 'Coolvetica Rg', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: radial-gradient(circle at 50% 200%, #87CEEB 50%, #4169E1 70%, #1E3A8A 100%);
    background-attachment: fixed;
  }
`;

const StyledFormCard = styled(CartoonContainer)`
    background-color: rgb(162, 37, 37);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 70vw;
    height: fit-content;
    color: #fff8e7;
    padding: 2rem;
    gap: 0.5rem;
`;
const StyledFormCardTitle = styled.h1`
    font-size: 50px;
    color: #fff8e7;
    margin: 0;
    font-family: 'TT Trick New', serif;
`;
const StyledFormCardInput = styled(CartoonInput)`
    text-align: center;
    margin: 0;
`;
const StyledFormCardSubtitle = styled.h2`
    font-size: 20px;
    color: #fff8e7;
    margin-bottom: 4rem;
    font-family: 'TT Trick New', serif;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 3rem;
`;

const StyledButton = styled(CartoonToggleButton)`
    font-size: 25px;
    font-family: 'TT Trick New', serif;
`;

const FormCard: React.FC<FormCardProps> = ({ title, type, subtitle }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [hasAccommodations, setHasAccommodations] = useState<boolean | null>(null);
    const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);

    const onPhoneNumberChange = (value: string) => {
        const numbers = value.replace(/[^0-9]/g, '');
        let formatted = '';
        if (numbers.length > 0) {
            formatted = '(' + numbers.slice(0, 3);
            if (numbers.length > 3) {
                formatted += ') ' + numbers.slice(3, 6);
                if (numbers.length > 6) {
                    formatted += '-' + numbers.slice(6, 10);
                }
            }
        }
        setPhoneNumber(formatted);
    };

    return (
        <StyledFormCard className="form-card" color="#D84040">
            <StyledFormCardTitle className="form-card-title">{title}</StyledFormCardTitle>
            {subtitle ? (
                <StyledFormCardSubtitle className="form-card-subtitle">
                    {subtitle}
                </StyledFormCardSubtitle>
            ) : null}

            {/* Phone Number Card */}
            {type === 'phonenumber' ? (
                <StyledFormCardInput value={phoneNumber} onChange={onPhoneNumberChange} />
            ) : null}

            {/* Gender Preferences Card */}
            {type === 'genderpreferences' ? (
                <ButtonsContainer>
                    <StyledButton
                        color="#bdf8ff"
                        isActive={selectedGender === 'male'}
                        onToggle={(isActive) => setSelectedGender(isActive ? 'male' : null)}
                    >
                        Male
                    </StyledButton>
                    <StyledButton
                        color="#f7bdff"
                        isActive={selectedGender === 'female'}
                        onToggle={(isActive) => setSelectedGender(isActive ? 'female' : null)}
                    >
                        Female
                    </StyledButton>
                    <StyledButton
                        color="#ce96ff"
                        isActive={selectedGender === 'no-preference'}
                        onToggle={(isActive) =>
                            setSelectedGender(isActive ? 'no-preference' : null)
                        }
                    >
                        No Preference
                    </StyledButton>
                </ButtonsContainer>
            ) : null}

            {/* Extra Accomodations Card */}
            {type === 'accomodations' ? (
                <ButtonsContainer>
                    <StyledButton
                        color="#bdf8ff"
                        isActive={hasAccommodations === true}
                        onToggle={(isActive) => setHasAccommodations(isActive ? true : null)}
                    >
                        Yes
                    </StyledButton>
                    <StyledButton
                        color="#f7bdff"
                        isActive={hasAccommodations === false}
                        onToggle={(isActive) => setHasAccommodations(isActive ? false : null)}
                    >
                        No
                    </StyledButton>
                </ButtonsContainer>
            ) : null}

            {/* Age Preferences Card */}
            {type === 'agepreferences' ? (
                <>
                    <ButtonsContainer>
                        <StyledButton
                            color="#bdf8ff"
                            isActive={selectedAgeRanges.includes('1-3')}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([...selectedAgeRanges, '1-3']);
                                } else {
                                    setSelectedAgeRanges(
                                        selectedAgeRanges.filter((range) => range !== '1-3')
                                    );
                                }
                            }}
                        >
                            1-3
                        </StyledButton>
                        <StyledButton
                            color="#bdf8ff"
                            isActive={selectedAgeRanges.includes('4-6')}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([...selectedAgeRanges, '4-6']);
                                } else {
                                    setSelectedAgeRanges(
                                        selectedAgeRanges.filter((range) => range !== '4-6')
                                    );
                                }
                            }}
                        >
                            4-6
                        </StyledButton>
                        <StyledButton
                            color="#f7bdff"
                            isActive={selectedAgeRanges.includes('7-9')}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([...selectedAgeRanges, '7-9']);
                                } else {
                                    setSelectedAgeRanges(
                                        selectedAgeRanges.filter((range) => range !== '7-9')
                                    );
                                }
                            }}
                        >
                            7-9
                        </StyledButton>
                        <StyledButton
                            color="#f7bdff"
                            isActive={selectedAgeRanges.includes('10-12')}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([...selectedAgeRanges, '10-12']);
                                } else {
                                    setSelectedAgeRanges(
                                        selectedAgeRanges.filter((range) => range !== '10-12')
                                    );
                                }
                            }}
                        >
                            10-12
                        </StyledButton>
                        <StyledButton
                            color="#ce96ff"
                            isActive={selectedAgeRanges.includes('13-15')}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([...selectedAgeRanges, '13-15']);
                                } else {
                                    setSelectedAgeRanges(
                                        selectedAgeRanges.filter((range) => range !== '13-15')
                                    );
                                }
                            }}
                        >
                            13-15
                        </StyledButton>
                        <StyledButton
                            color="#ce96ff"
                            isActive={selectedAgeRanges.includes('16-18')}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([...selectedAgeRanges, '16-18']);
                                } else {
                                    setSelectedAgeRanges(
                                        selectedAgeRanges.filter((range) => range !== '16-18')
                                    );
                                }
                            }}
                        >
                            16-18
                        </StyledButton>
                    </ButtonsContainer>
                    <br />
                    <ButtonsContainer>
                        <StyledButton
                            color="#6de8cf"
                            isActive={selectedAgeRanges.length === 0}
                            onToggle={(isActive) => {
                                if (isActive) {
                                    setSelectedAgeRanges([]);
                                } else {
                                    setSelectedAgeRanges([]);
                                }
                            }}
                        >
                            No Preference
                        </StyledButton>
                    </ButtonsContainer>
                </>
            ) : null}
        </StyledFormCard>
    );
};

export default FormCard;
