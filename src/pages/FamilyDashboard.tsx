import { useEffect, useState } from "react";
import CartoonButton from "../components/buttons/CartoonButton";
import CartoonContainer from "../components/containers/CartoonContainer";
import CartoonInput from "../components/inputs/CartoonInput";
import { ContentContainer, InputGroup, Label, PageContainer, FormContainer, DashboardButton, ChildCard, ChildInfo, ButtonContainer, ModalOverlay, ModalContent, ModalInnerContent } from "./SponsorDashboard";
import CartoonHeader from "../components/headers/CartoonHeader";
import { useAuth } from "../firebase/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import SnowyGround from "../components/effects/SnowyGround";
import Snowfall from "../components/effects/Snowfall";
import Navbar from "../components/Navbar";
import { Family, setFamilyInfo, Child } from "../firebase/families";
import { Navigate, useNavigate } from "react-router-dom";
import { getAccountType } from "../firebase/auth";
import { Tag } from "../components/headers/tag";
import styled from "styled-components";
import Catalog from "./Catalog";
import { setSponsorInfo } from "../firebase/sponsors";
import CartoonImageInput from "../components/inputs/CartoonImageInput";
import CartoonImageContainer from "../components/containers/CartoonImageContainer";
import { uploadImage, uploadMultipleImages } from "../firebase/storage";

const FamilyDashboard = () => {
    const [accountType, setAccountType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAllInfo, setHasAllInfo] = useState(false);
    const [family, setFamily] = useState<Family | null>(null);
    const [page, setPage] = useState<"dashboard" | "basicForm" | "childAdding" | "giftCatalog" | "identityVerification">("dashboard");
    const [refreshFamily, setRefreshFamily] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [childToDelete, setChildToDelete] = useState<string | null>(null);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            const type = await getAccountType();
            setAccountType(type);
            setIsLoading(false);
        }

        checkAuth();
        
    }, [user, navigate]);


    const getFamilyInfo = async () => {
        if (!user?.uid) return;
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        console.log(userDoc.data());
        if (userDoc !== null) {
            const userData = userDoc.data();
            if (userData?.accountType !== 'family') return;

            const familyId = userData?.family.familyDocId;
            console.log(familyId);
            const familyRef = doc(db, 'families', familyId);
            const familyDoc = await getDoc(familyRef);
            console.log(familyDoc.data());
            if (familyDoc !== null) {
                const familyData = familyDoc.data();
                setFamily(familyData?.family as Family);
                if (familyData?.family.Parent1Name && familyData?.family.Parent2Name && familyData?.family.PhoneNumber && familyData?.family.StreetAddress && familyData?.family.ZipCode) {
                    setHasAllInfo(true);
                }
                console.log("It works");
            }
        }
    };
    useEffect(() => {
        getFamilyInfo();
        setRefreshFamily(false);
    }, [user, navigate, page]);

    const handleRefreshFamily = async () => {
        setRefreshFamily(true);
        await getFamilyInfo();
        setRefreshFamily(false);
    };

    const handleDeleteChild = (childId: string) => {
        setChildToDelete(childId);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteChild = async () => {
        if (!childToDelete || !user?.uid) return;
        
        // Close modal immediately
        setShowDeleteConfirmation(false);
        setChildToDelete(null);
        
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            if (userData?.accountType !== 'family') return;
            
            const familyDocId = userData?.family.familyDocId;
            const familyRef = doc(db, 'families', familyDocId);
            const familyDoc = await getDoc(familyRef);
            const familyID = familyDoc.data()?.FamilyID;
            const family = familyDoc.data()?.family;

            if (!family || family.Children.length === 0) return;

            const childIndex = family.Children.findIndex((child: Child) => child.ChildID === childToDelete);
            if (childIndex === -1) return;

            if (family.Children[childIndex].isSponsored) {
                const sponsorDocId = family.Children[childIndex].sponsorDocID;
                const sponsorRef = doc(db, 'sponsors', sponsorDocId);
                const sponsorDoc = await getDoc(sponsorRef);
                const sponsor = sponsorDoc.data();
                
                if (sponsor) {
                    const newSponsoredChildren = sponsor.sponsored_children.filter((child: string) => child !== `${familyID} ${childToDelete}`);
                    await setDoc(sponsorRef, {
                        contact_number: sponsor.contact_number,
                        email: sponsor.email,
                        name: sponsor.name,
                        sponsored_children: newSponsoredChildren,
                        timestamp: new Date()
                    });
                }
            }

            const newChildren = family.Children.filter((child: Child) => child.ChildID !== childToDelete);
            await setFamilyInfo({...family, Children: newChildren});
            await handleRefreshFamily();
        } catch (error) {
            console.error('Error deleting child:', error);
        }
    };

    const BasicInfoForm: React.FC = () => {
        const [parent1Name, setParent1Name] = useState("");
        const [parent2Name, setParent2Name] = useState("");
        const [phoneNumber, setPhoneNumber] = useState("");
        const [address, setAddress] = useState("");
        const [zipCode, setZipCode] = useState("");
        const [isSaving, setIsSaving] = useState(false);
        const [saveMessage, setSaveMessage] = useState("-");

        const [loadingAccountInfo, setLoadingAccountInfo] = useState(true);
        const {user} = useAuth();
        const validateEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
    
        const formatPhoneNumber = (value: string) => {
            const phoneNumber = value.replace(/\D/g, '');
            if (phoneNumber.length === 0) return '';
            if (phoneNumber.length <= 3) return `(${phoneNumber}`;
            if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        };
    
        const handlePhoneChange = (value: string) => {
            const formatted = formatPhoneNumber(value);
            setPhoneNumber(formatted);
        };
    
        const validatePhone = (phone: string) => {
            const phoneNumber = phone.replace(/\D/g, '');
            return phoneNumber.length === 10;
        };
        const getFamilyInfo = async () => {
            setLoadingAccountInfo(true);
            if (!user?.uid) return;
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            console.log(userDoc.data());
            if (userDoc !== null) {
                const userData = userDoc.data();
                if (userData?.accountType !== 'family') return;
    
                const familyId = userData?.family.familyDocId;
                console.log(familyId);
                const familyRef = doc(db, 'families', familyId);
                const familyDoc = await getDoc(familyRef);
                console.log(familyDoc.data());
                if (familyDoc !== null) {
                    const familyData = familyDoc.data();
                    setParent1Name(familyData?.family.Parent1Name);
                    console.log(familyData);
                    console.log(familyData?.family.Parent1Name);
                    setParent2Name(familyData?.family.Parent2Name);
                    setPhoneNumber(familyData?.family.PhoneNumber);
                    setAddress(familyData?.family.StreetAddress);
                    setZipCode(familyData?.family.ZipCode);
                    console.log("It works");
                }
            }
            setLoadingAccountInfo(false);
        };
        useEffect(() => {
            
            try {
                getFamilyInfo();
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingAccountInfo(false);
                console.log("Loading account info is false");
            }
        }, [user]);
    
        const handleSave = async () => {
            if (parent1Name.length < 3) {
                setSaveMessage("Please enter a name with at least 3 characters");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (parent2Name.length < 3) {
                setSaveMessage("Please enter a name with at least 3 characters");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (!validatePhone(phoneNumber)) {
                setSaveMessage("Please enter a valid 10-digit phone number");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (address.length < 3) {
                setSaveMessage("Please enter a street address with at least 5 characters");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (!address.includes(" ")) {
                setSaveMessage("Please enter a street address with a street name and number");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (zipCode.length !== 5) {
                setSaveMessage("Please enter a valid 5-digit zip code");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (!parent1Name.includes(" ")) {
                setSaveMessage("Please enter a first and last name for Parent 1");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);

                return;
            }
            if (!parent2Name.includes(" ")) {
                setSaveMessage("Please enter a first and last name for Parent 2");
                setTimeout(() => {
                    setSaveMessage("-");
                }, 2000);
                
                return;
            }
            
            setIsSaving(true);
            setLoadingAccountInfo(true);
            try {
                if (!user?.uid) return;
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                console.log(userDoc.data());
                if (userDoc !== null) {
                    const userData = userDoc.data();
                    if (userData?.accountType !== 'family') return;

                    const familyId = userData?.family.familyDocId;
                    console.log(familyId);
                    const familyRef = doc(db, 'families', familyId);
                    const familyDoc = await getDoc(familyRef);
                    console.log(familyDoc.data());
                    if (familyDoc !== null) {
                        const familyData = familyDoc.data();
                        setParent1Name(familyData?.family.Parent1Name);
                        console.log(familyData);
                        console.log(familyData?.family.Parent1Name);
                        await setFamilyInfo({
                            Children: familyData?.family.Children,
                            Parent1Name: parent1Name,
                            Parent2Name: parent2Name,
                            PhoneNumber: phoneNumber,
                            StreetAddress: address,
                            ZipCode: zipCode,
                            timestamp: new Date(),
                            Verified: false,
                        });
                        setSaveMessage("Information saved successfully!");
                        setTimeout(() => {
                            setSaveMessage("-");
                        }, 2000);
                        console.log("It works");
                        getFamilyInfo();
                    }
                }
            } catch (error) {
                console.error(error);
                setSaveMessage("Error saving information");
            } finally {
                setIsSaving(false);
                setLoadingAccountInfo(false);
            }
        };
    
        return (
            <div>
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
                                <Label>Parent 1 Name</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What is Parent 1's name?"
                                    onChange={(e) => {
                                        setParent1Name(e);
                                    }}
                                    value={loadingAccountInfo ? "Loading..." : parent1Name}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>Parent 2 Name</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What is Parent 2's name?"
                                    onChange={(e) => {
                                        setParent2Name(e);
                                    }}
                                    value={loadingAccountInfo ? "Loading..." : parent2Name}
                                />
                            </InputGroup>
                            <InputGroup>
                                <Label>Input a contact number</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What is your phone number?"
                                    onChange={(e) => {
                                       handlePhoneChange(e);
                                    }}
                                    value={loadingAccountInfo ? "Loading..." : phoneNumber}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Input a street address</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What is your street address?"
                                    onChange={(e) => {
                                        setAddress(e);
                                    }}
                                    value={loadingAccountInfo ? "Loading..." : address}
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label>Input a zip code</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What is your zip code?"
                                    onChange={(e) => {
                                        setZipCode(e);
                                    }}
                                    value={loadingAccountInfo ? "Loading..." : zipCode}
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
                                fontSize: '2vmin',
                                textAlign: 'center',
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
                </div>
        );
    };

    const IdentityVerification: React.FC = () => {
        const [enlargeImage, setEnlargeImage] = useState(false);
        const [selectedImage, setSelectedImage] = useState<string | null>(null);
        const [isUploading, setIsUploading] = useState(false);
        const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'pending' | 'uploading' | 'success' | 'error'}>({
            address: 'pending',
            children: 'pending',
            income: 'pending'
        });
        const [documents, setDocuments] = useState<{
            address: File | null;
            children: File | null;
            income: File | null;
        }>({
            address: null,
            children: null,
            income: null
        });

        const handleImageUpload = (file: File | null, type: 'address' | 'children' | 'income') => {
            setDocuments(prev => ({ ...prev, [type]: file }));
            if (file) {
                const url = URL.createObjectURL(file);
                setSelectedImage(url);
            } else {
                setSelectedImage(null);
            }
        };

        const handleUpload = async () => {
            if (!user?.uid) return;
            setIsUploading(true);
            
            try {
                const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
                    if (!file) return;
                    
                    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
                    try {
                        const url = await uploadImage(file, `documents/${user.uid}/${type}`);
                        setUploadStatus(prev => ({ ...prev, [type]: 'success' }));
                        if (documents.address && documents.children && documents.income) {
                            setAllDocumentsUploaded(true);
                        } else {
                            setAllDocumentsUploaded(false);
                        }
                        return url;
                    } catch (error) {
                        console.error(`Error uploading ${type} document:`, error);
                        setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
                        throw error;
                    }
                });

                await Promise.all(uploadPromises);
            } catch (error) {
                console.error('Error uploading documents:', error);
            } finally {
                setIsUploading(false);
            }
        };

        const getStatusColor = (status: 'pending' | 'uploading' | 'success' | 'error') => {
            switch (status) {
                case 'success': return '#4CAF50';
                case 'error': return '#f44336';
                case 'uploading': return '#2196F3';
                default: return '#9E9E9E';
            }
        };

        const getStatusText = (status: 'pending' | 'uploading' | 'success' | 'error') => {
            switch (status) {
                case 'success': return '✓ Uploaded';
                case 'error': return '✗ Failed';
                case 'uploading': return '⟳ Uploading...';
                default: return '○ Pending';
            }
        };

        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: '100%',
                maxWidth: '80vmin',
                margin: '0 auto',
                gap: '4vmin', 
                padding: '2vmin' 
            }}>
                <CartoonHeader 
                    title="Identity Verification" 
                    subtitle="Please provide the following documents to verify your identity"
                />
                
                <CartoonContainer style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4vmin',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    padding: '4vmin',
                    width: '100%',
                    alignItems: 'center'
                }}>
                    {/* Address Proof */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2vmin',
                        width: '100%',
                        maxWidth: '60vmin',
                        alignItems: 'center'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            gap: '1vmin',
                            width: '100%',
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                gap: '1vmin',
                            }}>
                                
                                <Tag backgroundColor="#1EC9F2" text="Required" />
                            </div>
                            <CartoonHeader 
                                title="Proof of Address" 
                                subtitle="Upload a document that proves you live in Canton"
                            />
                            <div style={{ 
                                    color: getStatusColor(uploadStatus.address),
                                    fontFamily: 'TT Trick New, serif',
                                    fontSize: '2vmin'
                                }}>
                                    {getStatusText(uploadStatus.address)}
                                </div>
                        </div>
                        <CartoonImageInput 
                            placeholder="Upload proof of address (utility bill, lease agreement, etc.)" 
                            onChange={(file) => handleImageUpload(file, 'address')}
                            value={documents.address ? URL.createObjectURL(documents.address) : ""} 
                            onEnlarge={() => {handleImageUpload(documents.address, 'address'); setEnlargeImage(true);}}
                            onRemove={() => {
                                setDocuments(prev => ({ ...prev, address: null }));
                                setUploadStatus(prev => ({ ...prev, address: 'pending' }));
                            }}
                        />
                    </div>

                    {/* Children Proof */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2vmin',
                        width: '100%',
                        maxWidth: '60vmin',
                        alignItems: 'center'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            gap: '1vmin',
                            width: '100%',
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                gap: '1vmin',
                            }}>
                                
                                <Tag backgroundColor="#1EC9F2" text="Required" />
                            </div>
                            <CartoonHeader 
                                title="Proof of Children" 
                                subtitle="Upload a document that proves your children live with you"
                            />
                            <div style={{ 
                                color: getStatusColor(uploadStatus.children),
                                fontFamily: 'TT Trick New, serif',
                                fontSize: '2vmin'
                            }}>
                                {getStatusText(uploadStatus.children)}
                            </div>
                        </div>
                        <CartoonImageInput 
                            placeholder="Upload proof of children (birth certificates, school records, etc.)" 
                            onChange={(file) => handleImageUpload(file, 'children')}
                            value={documents.children ? URL.createObjectURL(documents.children) : ""} 
                            onEnlarge={() => {handleImageUpload(documents.children, 'children'); setEnlargeImage(true);}}
                            onRemove={() => {
                                setDocuments(prev => ({ ...prev, children: null }));

                            }}
                        />
                    </div>

                    {/* Income Proof */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2vmin',
                        width: '100%',
                        maxWidth: '60vmin',
                        alignItems: 'center'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            gap: '1vmin',
                            width: '100%',
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                gap: '1vmin',
                            }}>
                                
                                <Tag backgroundColor="#1EC9F2" text="Required" />
                            </div>
                            <CartoonHeader 
                                title="Proof of Income" 
                                subtitle="Upload documents showing all family income"
                            />
                            <div style={{ 
                                color: getStatusColor(uploadStatus.income),
                                fontFamily: 'TT Trick New, serif',
                                fontSize: '2vmin'
                            }}>
                                {getStatusText(uploadStatus.income)}
                            </div>
                        </div>
                        <CartoonImageInput 
                            placeholder="Upload proof of income (pay checks, tax returns, etc.)" 
                            onChange={(file) => handleImageUpload(file, 'income')}
                            value={documents.income ? URL.createObjectURL(documents.income) : ""} 
                            onEnlarge={() => {handleImageUpload(documents.income, 'income'); setEnlargeImage(true);}}
                            onRemove={() => {
                                setDocuments(prev => ({ ...prev, income: null }));
                                setUploadStatus(prev => ({ ...prev, income: 'pending' }));
                            }}
                        />
                    </div>

                    <CartoonButton 
                        color="#1EC9F2" 
                        disabled={isUploading || !Object.values(documents).some(doc => doc !== null)} 
                        onClick={handleUpload}
                        style={{ marginTop: '2vmin' }}
                    >
                        {isUploading ? "Uploading Documents..." : "Upload All Documents"}
                    </CartoonButton>
                </CartoonContainer>

                {enlargeImage && selectedImage && (
                    <ModalOverlay onClick={() => setEnlargeImage(false)}>
                        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <ModalContent>
                                <ModalInnerContent>
                                    <CartoonHeader 
                                        title="Document Preview" 
                                        subtitle="Your uploaded document"
                                    />
                                    <CartoonImageContainer width="60vmin" height="60vmin">
                                        <img 
                                            src={selectedImage} 
                                            alt="Document Preview" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain' 
                                            }} 
                                        />
                                    </CartoonImageContainer>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2vmin' }}>
                                        <CartoonButton 
                                            color="#1EC9F2" 
                                            onClick={() => setEnlargeImage(false)}
                                        >
                                            Close
                                        </CartoonButton>
                                    </div>
                                </ModalInnerContent>
                            </ModalContent>
                        </div>
                    </ModalOverlay>
                )}
            </div>
        );
    };

    const DashboardPage: React.FC = () => {
       
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vmin'}}>  
            <CartoonContainer style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2vmin',
            }}>
                <CartoonHeader title="Welcome to Your Dashboard" subtitle="Family Dashboard"/>
                <CartoonButton color="#1EC9F2" onClick={() => setPage("basicForm")}>Update Basic Info</CartoonButton>
                
                <CartoonButton disabled={!hasAllInfo} color="#1EC9F2" onClick={() => setPage("childAdding")}>Add Children</CartoonButton>
                <CartoonButton  disabled={!hasAllInfo || family?.Children.length === 0} color="#1EC9F2" onClick={() => setPage("identityVerification")}>Verify Identity</CartoonButton>
                
                <CartoonButton disabled={!allDocumentsUploaded || !family?.Verified} color="#1EC9F2" onClick={() => setPage("giftCatalog")}>Gift Catalog</CartoonButton>

            </CartoonContainer>
            {(!hasAllInfo || family?.Children.length === 0 || !allDocumentsUploaded) && (<CartoonContainer style={{borderColor: 'black', backgroundColor: '#CA242B', color: 'white', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'white'}}> {!hasAllInfo ? "Please update your basic information before adding children" : (family?.Children.length === 0) ? "Please add children before verifying identity" : "Please upload all documents to verify identity"} </p>
            </CartoonContainer>)}

            {(allDocumentsUploaded && !family?.Verified) && (<CartoonContainer style={{borderColor: 'black', backgroundColor: '#FFD711', color: 'black', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'black'}}> Please wait for your identity to be verified </p>
            </CartoonContainer>)}
            </div>
        );
    };

    const ChildAdding: React.FC = () => {
        const [showChildForm, setShowChildForm] = useState(false);
        const [editingChild, setEditingChild] = useState<Child | null>(null);
        const [childAge, setChildAge] = useState("");
        const [childGender, setChildGender] = useState<"Boy" | "Girl" | "Other">("Boy");
        const [hasDisabilities, setHasDisabilities] = useState(false);
        const [schoolName, setSchoolName] = useState("");
        const [isSaving, setIsSaving] = useState(false);
        const [saveMessage, setSaveMessage] = useState("-");

        const generateChildID = () => {
            if (!family) return "Child A";
            const existingChildren = family.Children || [];
            const lastChild = existingChildren[existingChildren.length - 1];
            if (!lastChild) return "Child A";
            
            const lastLetter = lastChild.ChildID.slice(-1);
            const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
            return `Child ${nextLetter}`;
        };

        const handleAddChild = async () => {
            if (!childAge || isNaN(Number(childAge)) || Number(childAge) < 0 || Number(childAge) > 18) {
                setSaveMessage("Please enter a valid age between 0 and 18");
                setTimeout(() => setSaveMessage("-"), 2000);
                return;
            }

            if (!schoolName.trim()) {
                setSaveMessage("Please enter a school name");
                setTimeout(() => setSaveMessage("-"), 2000);
                return;
            }

            setIsSaving(true);
            try {
                if (!user?.uid || !family) return;

                const newChild: Child = {
                    ChildID: editingChild?.ChildID || generateChildID(),
                    ChildAge: Number(childAge),
                    ChildGender: childGender,
                    HasDisabilities: hasDisabilities,
                    ChildToys: editingChild?.ChildToys || [],
                    isSponsored: editingChild?.isSponsored || false,
                    sponsorDocID: editingChild?.sponsorDocID || "",
                    SchoolName: schoolName
                };

                const updatedChildren = editingChild 
                    ? family.Children.map(child => child.ChildID === editingChild.ChildID ? newChild : child)
                    : [...(family.Children || []), newChild];

                await setFamilyInfo({
                    ...family,
                    Children: updatedChildren,
                    timestamp: new Date()
                });

                setFamily({ ...family, Children: updatedChildren });
                setSaveMessage("Child information saved successfully!");
                setTimeout(() => {
                    setSaveMessage("-");
                    setShowChildForm(false);
                    setEditingChild(null);
                    setChildAge("");
                    setChildGender("Boy");
                    setHasDisabilities(false);
                    setSchoolName("");
                }, 2000);
            } catch (error) {
                console.error('Error saving child info:', error);
                setSaveMessage("Error saving information. Please try again.");
            } finally {
                setIsSaving(false);
            }
        };

        const handleEditChild = (child: Child) => {
            setEditingChild(child);
            setChildAge(child.ChildAge.toString());
            setChildGender(child.ChildGender as "Boy" | "Girl" | "Other");
            setHasDisabilities(child.HasDisabilities);
            setSchoolName(child.SchoolName || "");
            setShowChildForm(true);
        };

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2vmin',
                width: '100%',
                maxWidth: '80vmin',
            }}>
                <FormContainer style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <CartoonHeader title="Add Children" subtitle="Please add the children in your family 18 and below"/>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '2vmin',
                    }}>
                        <CartoonButton color="#1EC9F2" onClick={() => setShowChildForm(true)}>Add Child</CartoonButton>
                        <CartoonButton color="#1EC9F2" disabled={refreshFamily} onClick={() => {handleRefreshFamily()}}>Refresh Family</CartoonButton>
                    </div>
                </FormContainer>

                {family?.Children && family.Children.length > 0 && (
                    <FormContainer>
                        <CartoonHeader title="Current Children" subtitle="Your family's children"/>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            gap: '2vmin',
                            width: '100%',
                            maxWidth: '60vmin'
                        }}>
                            {family.Children.map((child) => (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2vmin',
                                    width: '100%',
                                    maxWidth: '50vmin'
                                }}>
                                <ChildCard key={child.ChildID} gender={child.ChildGender}>
                                    <ChildInfo>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1vmin' }}>
                                            <h3 style={{ margin: 0, fontSize: '2.5vmin' }}>{child.ChildID}</h3>
                                            <Tag
                                                backgroundColor={child.ChildGender.toLowerCase() === 'boy' ? '#1EC9F2' : child.ChildGender.toLowerCase() === 'girl' ? '#FF69B4' : '#9B4DCA'}
                                                text={child.ChildGender}
                                            />
                                            <Tag
                                                backgroundColor={child.isSponsored ? '#059669' : '#CA242B'}
                                                text={child.isSponsored ? 'Sponsored' : 'Not Sponsored'}
                                            />
                                        </div>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Age: {child.ChildAge}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>Disabilities: {child.HasDisabilities ? 'Yes' : 'No'}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>School: {child.SchoolName}</p>
                                        <p style={{ margin: 0, fontSize: '2vmin' }}>
                                            Toys in Wishlist: {child.ChildToys.length}
                                        </p>
                                    </ChildInfo>
                                    <ButtonContainer>
                                        <CartoonButton 
                                            color={child.ChildGender.toLowerCase() === 'boy' ? '#1EC9F2' : child.ChildGender.toLowerCase() === 'girl' ? '#FF69B4' : '#9B4DCA'} 
                                            onClick={() => handleEditChild(child)}
                                        >
                                            Edit Child
                                        </CartoonButton>
                                        <CartoonButton 
                                            color="#CA242B" 
                                            onClick={() => handleDeleteChild(child.ChildID)}
                                        >
                                            Delete Child
                                        </CartoonButton>
                                    </ButtonContainer>
                                    </ChildCard>
                                </div>
                            ))}
                        </div>
                    </FormContainer>
                    
                )}
                {showChildForm && (
                    <ModalOverlay onClick={() => {
                        setShowChildForm(false);
                        setEditingChild(null);
                        setChildAge("");
                        setChildGender("Boy");
                        setHasDisabilities(false);
                        setSchoolName("");
                    }}>
                        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <ModalContent>
                                <ModalInnerContent>
                                    <CartoonHeader 
                                        title={editingChild ? "Edit Child" : "Add New Child"} 
                                        subtitle="Please fill out the child's information"
                                    />
                                    <CartoonContainer style={{
                                        padding: '3vmin',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2vmin',
                                    }}>
                                        <InputGroup>
                                            <Label>Age</Label>
                                            <CartoonInput
                                                color="white"
                                                placeholder="Enter age (0-18)"
                                                onChange={(e) => setChildAge(e)}
                                                value={childAge}
                                            />
                                        </InputGroup>

                                        <InputGroup>
                                            <Label>School Name</Label>
                                            <CartoonInput
                                                color="white"
                                                placeholder="Enter school name"
                                                onChange={(e) => setSchoolName(e)}
                                                value={schoolName}
                                            />
                                        </InputGroup>

                                        <InputGroup>
                                            <Label>Gender</Label>
                                            <div style={{
                                                display: 'flex',
                                                gap: '2vmin',
                                                justifyContent: 'center',
                                                width: '100%'
                                            }}>
                                                {["Boy", "Girl", "Other"].map((gender) => (
                                                    <CartoonButton
                                                        key={gender}
                                                        color={childGender === gender ? 
                                                            (gender === "Boy" ? "#1EC9F2" : 
                                                             gender === "Girl" ? "#FF69B4" : 
                                                             "#9B4DCA") : 
                                                            "#E5E5E5"}
                                                        onClick={() => setChildGender(gender as "Boy" | "Girl" | "Other")}
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: childGender === gender ? undefined : 'white',
                                                            color: childGender === gender ? 'white' : '#333'
                                                        }}
                                                    >
                                                        {gender}
                                                    </CartoonButton>
                                                ))}
                                            </div>
                                        </InputGroup>

                                        <InputGroup>
                                            <Label>Has Disabilities</Label>
                                            <CartoonButton
                                                color={hasDisabilities ? "#1EC9F2" : "#E5E5E5"}
                                                onClick={() => setHasDisabilities(!hasDisabilities)}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: hasDisabilities ? undefined : 'white',
                                                    color: hasDisabilities ? 'white' : '#333'
                                                }}
                                            >
                                                {hasDisabilities ? "Yes" : "No"}
                                            </CartoonButton>
                                        </InputGroup>

                                        <p style={{
                                            color: saveMessage.includes('Error') || saveMessage.includes('Please') 
                                                ? '#CA242B' 
                                                : saveMessage.includes('successfully') 
                                                    ? '#059669' 
                                                    : 'black',
                                            height: '2vmin',
                                            fontFamily: 'TT Trick New, serif',
                                            fontSize: '2vmin',
                                            textAlign: 'center',
                                        }}> {saveMessage} </p>

                                        <div style={{ display: 'flex', gap: '2vmin', justifyContent: 'center' }}>
                                            <CartoonButton
                                                color="#CA242B"
                                                onClick={() => {
                                                    setShowChildForm(false);
                                                    setEditingChild(null);
                                                    setChildAge("");
                                                    setChildGender("Boy");
                                                    setHasDisabilities(false);
                                                    setSchoolName("");
                                                }}
                                            >
                                                Cancel
                                            </CartoonButton>
                                            <CartoonButton
                                                color="#1EC9F2"
                                                onClick={handleAddChild}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : editingChild ? "Update Child" : "Add Child"}
                                            </CartoonButton>
                                        </div>
                                    </CartoonContainer>
                                </ModalInnerContent>
                            </ModalContent>
                        </div>
                    </ModalOverlay>
                )}
                {showDeleteConfirmation && (
                    <ModalOverlay>
                        <ModalContent>
                            <ModalInnerContent>
                                <CartoonHeader 
                                    title="Confirm Deletion" 
                                    subtitle="Are you sure you want to delete this child?"
                                />
                                <p style={{ margin: '2vmin 0', fontSize: '2vmin', textAlign: 'center' }}>
                                    This action cannot be undone. The child's information will be permanently removed.
                                </p>
                                <div style={{ display: 'flex', gap: '2vmin', justifyContent: 'center' }}>
                                    <CartoonButton 
                                        color="#CA242B" 
                                        onClick={confirmDeleteChild}
                                    >
                                        Yes, Delete
                                    </CartoonButton>
                                    <CartoonButton 
                                        color="#1EC9F2" 
                                        onClick={() => {
                                            setShowDeleteConfirmation(false);
                                            setChildToDelete(null);
                                        }}
                                    >
                                        Cancel
                                    </CartoonButton>
                                </div>
                            </ModalInnerContent>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </div>
        );
    };

    setTimeout(() => {
        if (!user || accountType !== 'family') {
            return <Navigate to="/" replace />;
        }
    }, 1000);

    return (
        <>
            <Snowfall />
            <Navbar />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '2vmin',
                minHeight: '100vh',
                marginTop: '20vh',

            }}>
                {page === "dashboard" && <DashboardPage />}
                {page === "basicForm" && <BasicInfoForm />}
                {page === "childAdding" && <ChildAdding />}
                {page === "giftCatalog" && <Catalog />}
                {page === "identityVerification" && <IdentityVerification />}
            </div>
            <SnowyGround />

            <DashboardButton 
                color="#1EC9F2" 
                onClick={() => setPage("dashboard")}
                disabled={page === "dashboard"}
            >
                Back to Dashboard
            </DashboardButton>
        </>

    );
};

export default FamilyDashboard;