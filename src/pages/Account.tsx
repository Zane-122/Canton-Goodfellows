import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SnowyGround from '../components/effects/SnowyGround';
import Snowfall from '../components/effects/Snowfall';
import { useAuth } from '../firebase/contexts/AuthContext';
import CartoonHeader from '../components/headers/CartoonHeader';
import CartoonContainer from '../components/containers/CartoonContainer';
import CartoonButton from '../components/buttons/CartoonButton';
import { styled } from 'styled-components';
import { logOut, deleteAccount, getAccountType, setAccountType, AuthError } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled.div`
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
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContent = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    gap: 2vmin;
    padding: 4vmin;
    width: 90%;
    max-width: 60vmin;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideIn 0.3s ease-out;
    position: relative;
    margin: 0;

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

const StyledContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: fit-content;
    height: fit-content;
    gap: 1vmin;
`;

const StyledText = styled.text`
    padding: 0.3vmin;
    font-size: 2vmin;
    font-weight: bold;
    font-family: 'TT Trick', serif;
    color: #000;
    text-align: center;
`;

const ErrorMessage = styled.div`
    color: #CA242B;
    font-size: 1.8vmin;
    text-align: center;
    margin: 1vmin 0;
`;

const Account = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [accountType, setAccountType] = useState("");
    const [loadingAccountType, setLoadingAccountType] = useState(true);
    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            setError("");
            await deleteAccount();
            navigate('/');
        } catch (error: any) {
            console.error('Error deleting account:', error);
            setError(error.message || "Failed to delete account. Please try again.");
        } finally {
            setIsDeleting(false);
            setShowConfirmModal(false);
        }
    };

    useEffect(() => {
        const getAccountTypeValue = async () => {
            const type = await getAccountType() || "No account type set";
            setAccountType(type);
            setLoadingAccountType(false);
        }
        getAccountTypeValue();
    }, []);

    return (
        <> 
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '75vh',
        }}>
            <Navbar />
            <Snowfall />
            <StyledContainer>
                <CartoonHeader title="Account" subtitle={"Account actions"} />

                <text> - </text>

                <StyledText>Account Name: {user?.displayName}</StyledText>
                <StyledText>Account Email: {user?.email}</StyledText>
                <StyledText>Account Type: {loadingAccountType ? "Loading..." : accountType.toUpperCase()}</StyledText>
                
                <text> - </text>

                <CartoonButton color="#CA242B" onClick={() => {
                    try{
                        navigate('/');
                        logOut();
                    } catch (error) {
                        console.error('Error logging out:', error);
                        if (error instanceof AuthError) {
                            setError(error.message || "Failed to log out. Please try again.");
                        } else {
                            setError("An unexpected error occurred. Please try again.");
                        }
                    }
                }}>
                    Log Out
                </CartoonButton>
                <text> - </text>
                <text style={{color: 'red'}}> You can't undo this </text>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <CartoonButton 
                    color="#CA242B" 
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                </CartoonButton>
            </StyledContainer>
        </div>
        <SnowyGround />

        {showConfirmModal && (
            <ModalOverlay onClick={() => setShowConfirmModal(false)}>
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <ModalContent>
                        <CartoonHeader 
                            title="Confirm Account Deletion" 
                            subtitle="This action cannot be undone"
                        />
                        <StyledText style={{ color: '#CA242B', fontSize: '2.2vmin' }}>
                            Are you sure you want to delete your account? This will:
                        </StyledText>
                        <ul style={{ 
                            color: '#CA242B', 
                            fontSize: '2vmin',
                            margin: '0',
                            paddingLeft: '4vmin',
                            listStyleType: 'none'
                        }}>
                            <li>• Permanently delete your account</li>
                            <li>• Remove all your data</li>
                            <li>• Cancel any active sponsorships</li>
                        </ul>
                        <StyledText style={{ color: '#CA242B', fontSize: '2.2vmin' }}>
                            EVEN IF ACCOUNT DELETION FAILS, ACCOUNT DATA MAY STILL BE DELETED
                        </StyledText>
                        <div style={{
                            display: 'flex',
                            gap: '2vmin',
                            justifyContent: 'center',
                            marginTop: '2vmin'
                        }}>
                            <CartoonButton 
                                color="#1EC9F2" 
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </CartoonButton>
                            <CartoonButton 
                                color="#CA242B" 
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                            </CartoonButton>
                        </div>
                    </ModalContent>
                </div>
            </ModalOverlay>
        )}
        </>
    )
};

export default Account;