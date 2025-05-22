import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/contexts/AuthContext';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import CartoonContainer from '../components/containers/CartoonContainer';
import CartoonButton from '../components/buttons/CartoonButton';
import { getAccountType, getFamilyDocId, setAccountType } from '../firebase/auth';
import CartoonHeader from '../components/headers/CartoonHeader';
import SnowyGround from '../components/effects/SnowyGround';
import Snowfall from '../components/effects/Snowfall';
import { defaultFamily, Family, setFamily } from '../firebase/families';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getDoc } from 'firebase/firestore';
import { defaultSponsor, setSponsorInfo, Sponsor } from '../firebase/sponsors';

const StyledContainer = styled(CartoonContainer)<{ isSelected?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    max-width: 40vmin;
    gap: 2vmin;
    padding: 3vmin;
    background-color: ${(props) => (props.isSelected ? 'white' : '#e0e0e0')};
    box-shadow: ${(props) => (props.isSelected ? '4px 4px 0px 0px rgba(0, 0, 0, 1)' : 'none')};
    transition: all 0.3s ease;
    opacity: ${(props) => (props.isSelected ? '1' : '0.8')};
`;

const ConfirmationOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const ConfirmationContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vmin;
    padding: 4vmin;
    max-width: 50vmin;
    text-align: center;
    animation: slideIn 0.3s ease-out;

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1vmin;
    margin: 2vmin 0;
    font-family: 'TT Trick New', serif;
    font-size: 2vmin;
`;

const StyledCheckbox = styled.input`
    appearance: none;
    -webkit-appearance: none;
    width: 3vmin;
    height: 3vmin;
    border: 3px solid black;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    position: relative;
    box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 1);
    transition: all 0.2s ease;

    &:checked {
        background-color: #1ec9f2;
        &::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: black;
            font-size: 2vmin;
            font-weight: bold;
        }
    }

    &:active {
        transform: translate(1px, 1px);
        box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 2vmin;
    margin-top: 2vmin;
`;

const TitleContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 2vmin;
    margin-bottom: 4vmin;
    animation: fadeIn 0.5s ease-in-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vmin;
    width: 100%;
    align-items: center;
`;

const Label = styled.label`
    font-family: 'TT Trick New', serif;
    font-size: 2vmin;
    color: #333;
    width: 100%;
    text-align: center;
    margin-bottom: 0.5vmin;
`;

const Input = styled.input`
    padding: 1.5vmin;
    border: 0.2vmin solid #ccc;
    border-radius: 1vmin;
    font-size: 1.8vmin;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #4169E1;
        box-shadow: 0 0 0.5vmin rgba(65, 105, 225, 0.3);
    }
`;

const ErrorMessage = styled.div`
    color: #dc2626;
    font-size: 1.6vmin;
    margin-top: 0.5vmin;
    text-align: center;
    height: 2vmin;
`;

export const Registration: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [accountType, setAccountTypeState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [pendingAccountType, setPendingAccountType] = useState<'sponsor' | 'family' | null>(null);
    const [familyDocId, setFamilyDocId] = useState<string>('');


    useEffect(() => {
        const fetchFamilyDocId = async () => {
            if (user) {
                const id = await getFamilyDocId();
                if (id != null) {
                    setFamilyDocId(id);
                } else {
                    setFamilyDocId('');
                }
            }
        };
        fetchFamilyDocId();
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const checkAccountType = async () => {
            try {
                const type = await getAccountType();
                setAccountTypeState(type);
            } catch (error) {
                console.error('Error checking account type:', error);
            }
        };

        checkAccountType();
    }, [user, navigate]);

    const handleChangeAccountType = async (newAccountType: 'sponsor' | 'family') => {
        if (accountType === null) {
            // For first-time selection, directly set the account type without confirmation
            setIsLoading(true);
            try {
                await setAccountType(newAccountType);
                setAccountTypeState(newAccountType);
                if (newAccountType === 'family') {
                    await setFamily(defaultFamily(user?.displayName || ''));
                } else if (newAccountType === 'sponsor') {
                    await setSponsorInfo(defaultSponsor(user?.displayName || '', user?.email || ''));
                }
            } catch (error) {
                console.error('Error setting account type:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            // For changing existing account type, show confirmation
            setPendingAccountType(newAccountType);
            setShowConfirmation(true);
        }
    };

    const handleConfirmChange = async () => {
        if (!isConfirmed || !pendingAccountType) return;

        setIsLoading(true);
        try {
            await setAccountType(pendingAccountType);
            setAccountTypeState(pendingAccountType);
            setShowConfirmation(false);
            setIsConfirmed(false);
            setPendingAccountType(null);
            if (pendingAccountType === 'family') {
                await setFamily(defaultFamily(user?.displayName || ''));
            } else if (pendingAccountType === 'sponsor') {
                await setSponsorInfo(defaultSponsor(user?.displayName || '', user?.email || ''));
            }
        } catch (error) {
            console.error('Error setting account type:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <Navbar />
            <Snowfall />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: '4vmin',
                }}
            >
                <TitleContainer>
                    <CartoonHeader
                        title={
                            accountType
                                ? `Current Account Type: ${accountType.charAt(0).toUpperCase() + accountType.slice(1)}`
                                : 'No Account Type Set'
                        }
                        subtitle={
                            accountType
                                ? 'You can change your account type below'
                                : 'Please select an account type below'
                        }
                    />
                </TitleContainer>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10vmin',
                    }}
                >
                    <StyledContainer isSelected={accountType === 'sponsor'}>
                        <CartoonHeader
                            title={
                                accountType === null
                                    ? 'Register to be a Sponsor'
                                    : accountType === 'sponsor'
                                      ? 'Edit your sponsor information'
                                      : 'Register to be a Sponsor'
                            }
                            subtitle="Register to help families in need on the holidays"
                        />
                        <span style={{ fontSize: '2vmin', color: 'black' }}> - </span>
                        <CartoonButton
                            color={accountType === 'sponsor' ? '#1EC9F2' : '#CA242B'}
                            onClick={() =>
                                accountType === 'sponsor'
                                    ? navigate('/sponsor-dashboard')
                                    : handleChangeAccountType('sponsor')
                            }
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Processing...'
                                : accountType === 'sponsor'
                                  ? 'Edit'
                                  : 'Sponsor a Family'}
                        </CartoonButton>
                    </StyledContainer>

                    <StyledContainer isSelected={accountType === 'family'}>
                        <CartoonHeader
                            title={
                                accountType === null
                                    ? 'Register to be a Family'
                                    : accountType === 'family'
                                      ? 'Edit your family information'
                                      : 'Register to be a Family'
                            }
                            subtitle=" Register to receive help from sponsors on the holidays"
                        />
                        <span style={{ fontSize: '2vmin', color: 'black' }}> - </span>
                        <CartoonButton
                            color={accountType === 'family' ? '#1EC9F2' : '#CA242B'}
                            onClick={() =>
                                accountType === 'family'
                                    ? navigate('/family-dashboard')
                                    : handleChangeAccountType('family')
                            }
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Processing...'
                                : accountType === 'family'
                                  ? 'Edit'
                                  : 'Register'}
                        </CartoonButton>
                    </StyledContainer>
                </div>
            </div>

            {showConfirmation && (
                <ConfirmationOverlay>
                    <ConfirmationContainer>
                        <CartoonHeader
                            title="⚠️ Important Notice ⚠️"
                            subtitle={`You are about to change your account type to ${pendingAccountType}. This action will delete all your previous ${pendingAccountType === 'sponsor' ? 'family' : 'sponsor'} configurations and cannot be undone.`}
                        />
                        <CheckboxContainer>
                            <StyledCheckbox
                                type="checkbox"
                                checked={isConfirmed}
                                onChange={(e) => setIsConfirmed(e.target.checked)}
                            />
                            <span>I understand that this action cannot be undone</span>
                        </CheckboxContainer>
                        <ButtonContainer>
                            <CartoonButton
                                color="#CA242B"
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setIsConfirmed(false);
                                    setPendingAccountType(null);
                                }}
                            >
                                Cancel
                            </CartoonButton>
                            <CartoonButton
                                color="#1EC9F2"
                                onClick={handleConfirmChange}
                                disabled={!isConfirmed || isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Confirm Change'}
                            </CartoonButton>
                        </ButtonContainer>
                    </ConfirmationContainer>
                </ConfirmationOverlay>
            )}
            <SnowyGround />
        </>
    );
};
