import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { Navigate, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { getAccountType } from "../firebase/auth";
import { useAuth } from "../firebase/contexts/AuthContext";
import CartoonHeader from "../components/headers/CartoonHeader";
import CartoonContainer from "../components/containers/CartoonContainer";
import CartoonInput from "../components/inputs/CartoonInput";
import CartoonButton from "../components/buttons/CartoonButton";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getSponsorDocId, setSponsorInfo } from "../firebase/sponsors";
import { set } from "lodash";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Snowfall from "../components/effects/Snowfall";
import SnowyGround from "../components/effects/SnowyGround";
import { Child, Family, getChildren, getFamilies } from "../firebase/families";
import { Tag } from "../components/headers/tag";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: radial-gradient(circle at 50% 200%, #87CEEB 50%, #4169E1 70%, #1E3A8A 100%);
    background-attachment: fixed;
    position: relative;
    overflow-x: hidden;
`;

const SnowfallContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 4vmin;
    gap: 4vmin;
    flex: 1;
    margin-top: 15vh;
    margin-bottom: 10vh;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
`;

const FormContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3vmin;
    padding: 4vmin;
    width: 90%;
    max-width: 60vmin;
    background-color: white;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.9);
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

const Message = styled.div<{ isError?: boolean }>`
    color: ${props => props.isError ? '#CA242B' : '#1EC9F2'};
    font-family: 'TT Trick New', serif;
    font-size: 2vmin;
    text-align: center;
    width: 100%;
`;

const DashboardButton = styled(CartoonButton)`
    position: fixed;
    bottom: 4vmin;
    right: 4vmin;
    z-index: 50;
    padding: 2vmin 4vmin;
    font-size: 2vmin;
`;

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
    max-width: 80vmin;
    max-height: 80vh;
    overflow-y: auto;
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

const ModalInnerContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2vmin;
    width: 100%;
`;

const ChildCard = styled(CartoonContainer)<{ gender: string }>`
    display: flex;
    flex-direction: row;
    gap: 2vmin;
    padding: 2vmin;
    border: 0.7vmin solid ${props => props.gender.toLowerCase() === 'boy' ? '#1EC9F2' : props.gender.toLowerCase() === 'girl' ? '#FF69B4' : '#9B4DCA'};
    background-color: white;
`;

const ChildInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vmin;
    flex: 1;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vmin;
    justify-content: center;
`;

const TitleCartoonContainer = styled(CartoonContainer)`
    display: flex;
    flex-direction: column;
    gap: 1vmin;
    margin-top: 10vmin;
`;

////////////////////////////////////////////////////////////

export const SponsorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [accountType, setAccountType] = useState<"sponsor" | "family" | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAllInfo, setHasAllInfo] = useState(false);
    const [page, setPage] = useState<"dashboard" | "basicForm" | "childSelection">("dashboard");
    const [sponsoredChildren, setSponsoredChildren] = useState<string[]>([]);
    const [families, setFamilies] = useState<Family[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [showChildrenModal, setShowChildrenModal] = useState(false);
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [showOnlySponsored, setShowOnlySponsored] = useState(false);

    useEffect(() => {
        const fetchSponsorInfo = async () => {
            if (!user) return;
            
            try {
                const sponsorDocId = await getSponsorDocId();
                const sponsorRef = doc(db, 'sponsors', sponsorDocId);
                const sponsorDoc = await getDoc(sponsorRef);
                const sponsorInfo = sponsorDoc.data();

                if (sponsorInfo?.name && sponsorInfo?.email && sponsorInfo?.contact_number) {
                    if (sponsorInfo.name !== "" && sponsorInfo.email !== "" && sponsorInfo.contact_number !== "") {
                        setHasAllInfo(true);
                    } else {
                        setHasAllInfo(false);
                    }
                } else {
                    setHasAllInfo(false);
                }
            } catch (error) {
                console.error('Error fetching sponsor info:', error);
                setHasAllInfo(false);
            }
        };

        fetchSponsorInfo();
    }, [user]);

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            const type = await getAccountType();
            setAccountType(type);
            setIsLoading(false);
        };

        checkAuth();
    }, [user, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (accountType !== "sponsor") {
        return <Navigate to="/login" />;
    }

    const DashboardPage: React.FC = () => {
        return (
            <FormContainer>
                <CartoonHeader title="Welcome to Your Dashboard" />
                <CartoonButton color="#1EC9F2" onClick={() => setPage("basicForm")}>Update Basic Info</CartoonButton>
                <CartoonButton disabled={!hasAllInfo} color="#1EC9F2" onClick={() => setPage("childSelection")}>Select Children to Sponsor</CartoonButton>
            </FormContainer>
        );
    };

    const ChildSelection: React.FC = () => {
        const [families, setFamilies] = useState<Family[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
        const [showChildrenModal, setShowChildrenModal] = useState(false);
        const [showFamilyModal, setShowFamilyModal] = useState(false);
        const [saveMessage, setSaveMessage] = useState("");
        const [sponsoredChildren, setSponsoredChildren] = useState<string[]>([]);

        useEffect(() => {
            const fetchSponsoredChildren = async () => {
                const sponsorDocId = await getSponsorDocId();
                const sponsorRef = doc(db, 'sponsors', sponsorDocId);
                const sponsorDoc = await getDoc(sponsorRef);
                const sponsorInfo = sponsorDoc.data();
                setSponsoredChildren(sponsorInfo?.sponsored_children || []);
            };
            fetchSponsoredChildren();
        }, []);
        
        const handleViewChildren = (family: Family) => {
            // Find the most up-to-date version of this family from the families array
            const updatedFamily = families.find(f => f.FamilyID === family.FamilyID) || family;
            setSelectedFamily(updatedFamily);
            setShowChildrenModal(true);
        };

        const handleViewFamily = (family: Family) => {
            setSelectedFamily(family);
            setShowFamilyModal(true);
        };

        const getFamilyDoc = async(familyId: string) => {
            const familiesRef = collection(db, 'families');
            const q = query(familiesRef, where('FamilyID', '==', familyId));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                console.error('Family not found');
                setSaveMessage("Error: Family not found");
                return;
            }
            
            const familyDoc = querySnapshot.docs[0];
            return familyDoc;
        }

        const getChild = async(familyId: string, childId: string): Promise<Child | null> => {  
            // Find the family document by FamilyID field
            const family = await getFamilyDoc(familyId);
            if (family === null) {return null;}
            const familyData = family?.data();

            // Get the Children array from the family data
            const children = familyData?.family.Children || [];
            console.log('Children array:', children);
            
            const childIndex = children.findIndex((child: Child) => child.ChildID === childId);
            if (childIndex === -1) {
                console.error('Child not found in family');
                setSaveMessage("Error: Child not found");
                return null;
            }

            return children[childIndex];
        }

        const ReloadFamily = async (familyId: string) => {
            if (selectedFamily && selectedFamily.FamilyID === familyId) {
                const familyDoc = await getFamilyDoc(familyId);
                const updatedChildren = familyDoc?.data()?.family.Children;
                const updatedFamily = {...selectedFamily};
                if (updatedChildren) {
                    updatedFamily.Children = updatedChildren;
                    setSelectedFamily(updatedFamily);
                }
            }
        }

        const handleSponsorChild = async (familyId: string, childId: string) => {
            try {
                const sponsorDocId = await getSponsorDocId();
                const sponsorRef = doc(db, 'sponsors', sponsorDocId);
                const sponsorDoc = await getDoc(sponsorRef);
                const currentInfo = sponsorDoc.data();
                
                const child = await getChild(familyId, childId);
                
                const childIdentifier = `${familyId} ${childId}`;
                
                const familyDoc = await getFamilyDoc(familyId);
                if (familyDoc === null) {return;}
                const familyData = familyDoc?.data();

                let newSponsoredChildren;
                if (sponsoredChildren.includes(childIdentifier)) {
                    // Unsponsor the child
                    newSponsoredChildren = sponsoredChildren.filter(child => child !== childIdentifier);
                    if (child) {
                        child.isSponsored = false;
                        child.sponsorDocID = '';
                    }
                    setSaveMessage("Child unsponsored successfully!");
                } else {
                    // Sponsor the child
                    if (sponsoredChildren.length >= 3) {
                        setSaveMessage("Error: You can only sponsor up to 3 children at a time.");
                        setTimeout(() => setSaveMessage(""), 2000);
                        return;
                    } else if (sponsoredChildren.includes(childIdentifier) || child?.isSponsored) {
                        setSaveMessage("Error: This child is already sponsored.");
                        setTimeout(() => setSaveMessage(""), 2000);
                        ReloadFamily(familyId);
                        return;
                    } else {
                        newSponsoredChildren = [...sponsoredChildren, childIdentifier];
                        if (child) {
                            child.isSponsored = true;
                            child.sponsorDocID = sponsorDocId;
                        }
                        setSaveMessage("Child sponsored successfully!");
                    }
                }

                // Update sponsor's sponsored_children
                await updateDoc(sponsorRef, {
                    sponsored_children: newSponsoredChildren
                });
                
                // Update local state with the new sponsored children list
                setSponsoredChildren(newSponsoredChildren);
                
                // Get updated children array from family doc
                const updatedFamilyData = familyDoc?.data();
                const updatedChildren = updatedFamilyData?.family?.Children || [];
                
                // Find update the  child in the children array
                const childIndex = updatedChildren.findIndex((c: Child) => c.ChildID === child?.ChildID);
                if (childIndex !== -1) {
                    updatedChildren[childIndex] = child;
                }
                
                // Update the family document with the modified children array
                if (familyDoc && familyDoc.ref) {
                    await updateDoc(familyDoc.ref, {
                        'family.Children': updatedChildren
                    });
                } else {
                    console.error('Family document reference is undefined');
                    setSaveMessage("Error updating family document. Please try again.");
                }
                
                // Update the selectedFamily state if it matches the current family
                if (selectedFamily && selectedFamily.FamilyID === familyId) {
                    const updatedFamily = {...selectedFamily};
                    updatedFamily.Children = updatedChildren;
                    setSelectedFamily(updatedFamily);
                }
                
                setTimeout(() => setSaveMessage(""), 2000);
            } catch (error) {
                console.error('Error updating sponsorship:', error);
                setSaveMessage("Error updating sponsorship. Please try again.");
                setTimeout(() => setSaveMessage(""), 2000);
            }
        };

        useEffect(() => {
            const fetchFamilies = async () => {
                try {
                    const fetchedFamilies = await getFamilies();
                    console.log('Fetched families:', fetchedFamilies);
                    setFamilies(fetchedFamilies);
                } catch (error) {
                    console.error('Error fetching families:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchFamilies();
        }, []);

        if (isLoading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: 'white',
                    fontFamily: 'TT Trick New, serif',
                    fontSize: '3vmin',
                }}>
                    Loading families...
                </div>
            );
        }

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2vmin',
                padding: '4vmin',
                marginTop: '10vh',
                zIndex: 2,
            }}>
                {saveMessage && (
                    <CartoonContainer style={{
                        padding: '2vmin',
                        position: 'fixed',
                        bottom: '10vmin',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: saveMessage.includes('Error') ? '#FFE5E5' : '#E5FFE5',
                        zIndex: 2000,
                        transition: 'opacity 0.3s ease-in-out',
                     
                    }}>
                        <p style={{ 
                            margin: 0, 
                            fontSize: '2vmin',
                            color: saveMessage.includes('Error') ? '#CA242B' : '#059669',
                            zIndex: 2000,
                        }}>
                            {saveMessage}
                        </p>
                    </CartoonContainer>
                )}
                <TitleCartoonContainer>
                    <CartoonHeader title="Child Selection" subtitle="Select a child to sponsor!" />
                    <p>If every child in a family is fully sponsored, they will not show up in the list.</p>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '2vmin',
                        marginTop: '2vmin',
                        width: '100%'
                    }}>
                        <CartoonButton 
                            color={showOnlySponsored ? "#1EC9F2" : "#1EC9F2"}
                            onClick={() => setShowOnlySponsored(!showOnlySponsored)}
                            style={{ minWidth: '25vmin' }}
                        >
                            {showOnlySponsored ? "All Families" : "Families I'm Sponsoring"}
                        </CartoonButton>
                    </div>
                </TitleCartoonContainer>

                <CartoonContainer style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2vmin',
                    padding: '4vmin',
                    justifyContent: 'flex-start',
                    maxWidth: '60vw',
                    alignItems: 'center',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'transparent transparent',
                }}>
                    {families
                        .filter(family => {
                            if (showOnlySponsored) {
                                // Only show families where the current user has sponsored children
                                return family.Children.some(child => 
                                    sponsoredChildren.includes(`${family.FamilyID} ${child.ChildID}`)
                                );
                            } else {
                                // Show families that either have unsponsored children or have children sponsored by the current user
                                return family.Children.some(child => 
                                    !child.isSponsored || 
                                    sponsoredChildren.includes(`${family.FamilyID} ${child.ChildID}`)
                                );
                            }
                        })
                        .sort((a, b) => {
                            const aNum = parseInt((a.FamilyID || '0').replace(/\D/g, ''));
                            const bNum = parseInt((b.FamilyID || '0').replace(/\D/g, ''));
                            return aNum - bNum;
                        })
                        .map((family) => (
                        <CartoonContainer key={family.FamilyID} style={{
                            padding: '2vmin',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1vmin',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <h3 style={{ margin: 0, fontSize: '2.5vmin' }}>{family.FamilyID || 'Unnamed Family'}</h3>
                            <p style={{ margin: 0, fontSize: '2vmin' }}>Children: {family.Children.length}</p>
                            <CartoonButton color="#1EC9F2" onClick={() => handleViewChildren(family)}>
                                View Children
                            </CartoonButton>
                            <CartoonButton color="#CA242B" onClick={() => handleViewFamily(family)}>
                                See family Info
                            </CartoonButton>
                        </CartoonContainer>
                    ))}
                    {families.filter(family => {
                            if (showOnlySponsored) {
                                // Only show families where the current user has sponsored children
                                return family.Children.some(child => 
                                    sponsoredChildren.includes(`${family.FamilyID} ${child.ChildID}`)
                                );
                            } else {
                                // Show families that either have unsponsored children or have children sponsored by the current user
                                return family.Children.some(child => 
                                    !child.isSponsored || 
                                    sponsoredChildren.includes(`${family.FamilyID} ${child.ChildID}`)
                                );
                            }
                        }).length === 0 && (
                        <CartoonHeader title={showOnlySponsored ? "No families sponsored" : "No families found"} subtitle={showOnlySponsored ? "Sponsor a child to see the family here!" : "Please check back later"} />
                    )} 
                </CartoonContainer>

                {showChildrenModal && selectedFamily && (
                    <ModalOverlay onClick={() => setShowChildrenModal(false)}>
                        <ModalContent>  
                            <ModalInnerContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <CartoonHeader 
                                    title={`${selectedFamily.FamilyID} - Children`} 
                                    subtitle={`${selectedFamily.Children.length} children in this family`}
                                />
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2vmin',
                                }}>
                                    {[...selectedFamily.Children].reverse().map((child) => (
                                        <ChildCard 
                                            key={child.ChildID} 
                                            gender={child.ChildGender}
                                            style={{
                                                opacity: sponsoredChildren.includes(`${selectedFamily.FamilyID} ${child.ChildID}`) ? 0.7 : 1,
                                                position: 'relative'
                                            }}
                                        >                    
                                            <ChildInfo>
                                                <div style={{ display: 'flex', flexDirection: 'row', gap: '1vmin' }}>
                                                    <h3 style={{ margin: 0, fontSize: '2.5vmin' }}>{child.ChildID}</h3>
                                                    {(
                                                        <Tag
                                                            backgroundColor={sponsoredChildren.includes(`${selectedFamily.FamilyID} ${child.ChildID}`) ? '#059669' : child.isSponsored ? '#1EC9F2' : '#CA242B'}
                                                            text={sponsoredChildren.includes(`${selectedFamily.FamilyID} ${child.ChildID}`) ? "Sponsored by You" : child.isSponsored ? "Sponsored by Someone Else" : "Not Sponsored"}
                                                        />
                                                    )}
                                                </div>
                                                    <p style={{ margin: 0, fontSize: '2vmin' }}>Age: {child.ChildAge}</p>
                                                    <p style={{ margin: 0, fontSize: '2vmin' }}>
                                                    Has Disabilities: {child.HasDisabilities ? 'Yes' : 'No'}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '2vmin' }}>
                                                    Toys in Wishlist: {child.ChildToys.length}
                                                </p>
                                            </ChildInfo>
                                            <ButtonContainer>
                                                <CartoonButton 
                                                    color={child.ChildGender.toLowerCase() === 'boy' ? '#1EC9F2' : child.ChildGender.toLowerCase() === 'girl' ? '#FF69B4' : '#9B4DCA'} 
                                                    onClick={() => {console.log(child.ChildToys);}}
                                                >
                                                    View Wishlist
                                                </CartoonButton>
                                                <CartoonButton 
                                                    color={child.ChildGender.toLowerCase() === 'boy' ? '#1EC9F2' : child.ChildGender.toLowerCase() === 'girl' ? '#FF69B4' : '#9B4DCA'} 
                                                    onClick={() => {handleSponsorChild(selectedFamily.FamilyID || '', child.ChildID);}}
                                                    disabled={!sponsoredChildren.includes(`${selectedFamily.FamilyID} ${child.ChildID}`) && child.isSponsored}
                                                >
                                                    {sponsoredChildren.includes(`${selectedFamily.FamilyID} ${child.ChildID}`) ? "Unsponsor Child" : "Sponsor Child"}
                                                </CartoonButton>
                                            </ButtonContainer>
                                        </ChildCard>
                                    ))}
                                </div>
                                <div style={{ marginTop: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2vmin' }}>
                                    <CartoonButton 
                                        color="#CA242B" 
                                        onClick={() => setShowChildrenModal(false)}
                                    >
                                        Close
                                    </CartoonButton>
                                    <CartoonButton 
                                        color="#1EC9F2" 
                                        onClick={() => ReloadFamily(selectedFamily?.FamilyID || '')}
                                    >
                                        Reload
                                    </CartoonButton>
                                </div>
                            </ModalInnerContent>
                        </ModalContent>
                    </ModalOverlay>
                )}

                {showFamilyModal && selectedFamily && (
                    <ModalOverlay onClick={() => setShowFamilyModal(false)}>
                        <ModalContent>
                            <ModalInnerContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <CartoonHeader 
                                    title={`${selectedFamily.FamilyID} - Family Information`} 
                                    subtitle="Family Details"
                                />
                                <CartoonContainer style={{
                                    padding: '3vmin',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2vmin',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1vmin',
                                    }}>
                                        <h3 style={{ margin: 0, fontSize: '2.5vmin', color: '#333' }}>Parent Information</h3>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Parent 1: {selectedFamily.Parent1Name}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Parent 2: {selectedFamily.Parent2Name}</p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1vmin',
                                    }}>
                                        <h3 style={{ margin: 0, fontSize: '2.5vmin', color: '#333' }}>Contact Information</h3>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Address: {selectedFamily.StreetAddress}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Zip Code: {selectedFamily.ZipCode}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Phone: {selectedFamily.PhoneNumber}</p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1vmin',
                                    }}>
                                        <h3 style={{ margin: 0, fontSize: '2.5vmin', color: '#333' }}>General Information</h3>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Total Children: {selectedFamily.Children.length}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>
                                            Registration Date: {selectedFamily.timestamp ? new Date(selectedFamily.timestamp).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </CartoonContainer>
                                <div style={{ marginTop: '2vmin' }}>
                                    <CartoonButton 
                                        color="#CA242B" 
                                        onClick={() => setShowFamilyModal(false)}
                                    >
                                        Close
                                    </CartoonButton>
                                </div>
                            </ModalInnerContent>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </div>
        );
    };
    
    const BasicInfoForm: React.FC = () => {
        const [sponsorName, setSponsorName] = useState("");
        const [sponsorEmail, setSponsorEmail] = useState("");
        const [sponsorPhone, setSponsorPhone] = useState("");
        const [isSaving, setIsSaving] = useState(false);
        const [saveMessage, setSaveMessage] = useState("-");
        const [loadingAccountInfo, setLoadingAccountInfo] = useState(true);

        const validateEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
    
        const formatPhoneNumber = (value: string) => {
            const phoneNumber = value.replace(/\D/g, '');
            if (phoneNumber.length === 0) return '';
            if (phoneNumber.length <= 3) return `(${phoneNumber})`;
            if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        };
    
        const handlePhoneChange = (value: string) => {
            const formatted = formatPhoneNumber(value);
            setSponsorPhone(formatted);
        };
    
        const validatePhone = (phone: string) => {
            const phoneNumber = phone.replace(/\D/g, '');
            return phoneNumber.length === 10;
        };
    
        useEffect(() => {
            const fetchSponsorInfo = async () => {
                setLoadingAccountInfo(true);
                try {
                    const sponsorDocId = await getSponsorDocId();
                    const sponsorRef = doc(db, 'sponsors', sponsorDocId);
                    const sponsorDoc = await getDoc(sponsorRef);
                    const sponsorInfo = sponsorDoc.data();
    
                    if (sponsorInfo) {
                        setSponsorName(sponsorInfo.name || "");
                        setSponsorEmail(sponsorInfo.email || "");
                        setSponsorPhone(sponsorInfo.contact_number || "");
                    }
                } catch (error) {
                    console.error('Error fetching sponsor info:', error);
                } finally {
                    setLoadingAccountInfo(false);
                }
            }
            fetchSponsorInfo();
        }, []);
    
        const handleSave = async () => {
            setSaveMessage("-");
            
            if (!validateEmail(sponsorEmail)) {
                setSaveMessage("Please enter a valid email address");
                return;
            }
    
            if (!validatePhone(sponsorPhone)) {
                setSaveMessage("Please enter a valid 10-digit phone number");
                return;
            }

            if (sponsorName.length < 3) {
                setSaveMessage("Please enter a name with at least 3 characters");
                return;
            }

            if (!sponsorName.includes(" ")) {
                setSaveMessage("Please enter a name with a first and last name");
                return;
            }
    
            setIsSaving(true);
            try {
                const sponsorDocId = await getSponsorDocId();
                const sponsorRef = doc(db, 'sponsors', sponsorDocId);
                const sponsorDoc = await getDoc(sponsorRef);
                const currentInfo = sponsorDoc.data();
                
                await setSponsorInfo({
                    name: sponsorName,
                    email: sponsorEmail,
                    contact_number: sponsorPhone,
                    sponsored_children: currentInfo?.sponsored_children || [],
                    timestamp: new Date(),
                });
                setSaveMessage("Information saved successfully!");
                setHasAllInfo(true);
            } catch (error) {
                console.error('Error saving sponsor info:', error);
                setSaveMessage("Error saving information. Please try again.");
            } finally {
                setIsSaving(false);

            }
            setTimeout(() => {
                if (!isSaving) {
                    setSaveMessage("-");
                }
            }, 2000);
        };
    
        return (
            <PageContainer>
                <ContentContainer>
                    <FormContainer>
                        <CartoonHeader
                            title="Basic Information"
                            subtitle="Please fill out the following information!"
                        />
                        <CartoonContainer style={{
                            padding: '2vmin',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2vmin',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <InputGroup>
                                <Label>Name</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What's your name?"
                                    onChange={(e) => setSponsorName(e)}
                                    value={loadingAccountInfo ? "Loading..." : sponsorName}
                                />
                            </InputGroup>
    
                            <InputGroup>
                                <Label>Email</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What's your email?"
                                    onChange={(e) => setSponsorEmail(e)}
                                    value={loadingAccountInfo ? "Loading..." : sponsorEmail}
                                />
                            </InputGroup>
    
                            <InputGroup>
                                <Label>Phone Number</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="(123) 456-7890"
                                    onChange={(e) => handlePhoneChange(e)}
                                    value={loadingAccountInfo ? "Loading..." : sponsorPhone}
                                />
                            </InputGroup>
    
                            <p style={{
                                color: saveMessage.includes('Error') || saveMessage.includes('Please') 
                                    ? '#CA242B' 
                                    : saveMessage.includes('successfully') 
                                        ? '#059669' 
                                        : 'black',
                                height: '2vmin',
                                fontFamily: 'TT Trick New, serif',
                                fontSize: '2vmin'
                            }}> {saveMessage} </p>
                            <CartoonButton
                                color="#1EC9F2"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save Information"}
                            </CartoonButton>
                        </CartoonContainer>
                    </FormContainer>
                </ContentContainer>
            </PageContainer>
        );
    };

    if (isLoading) {
        return (
            <>
                <PageContainer>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100vh',
                        color: 'white',
                        fontFamily: 'TT Trick New, serif',
                        fontSize: '3vmin',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        Loading...
                    </div>
                </PageContainer>
            </>
        );
    }

    if (!user || accountType !== 'sponsor') {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Navbar />
            <SnowfallContainer>
                <Snowfall />
            </SnowfallContainer>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}>
                {
                    page === "dashboard" ? <DashboardPage /> : page === "basicForm" ? <BasicInfoForm /> : <ChildSelection />
                }
            </div>

            <DashboardButton 
                color="#1EC9F2" 
                onClick={() => setPage("dashboard")}
                disabled={page === "dashboard"}
            >
                Back to Dashboard
            </DashboardButton>

            <SnowyGround />
        </>
    );
}