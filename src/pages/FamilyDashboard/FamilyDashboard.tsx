import { useEffect, useState, useMemo } from "react";
import CartoonButton from "../../components/buttons/CartoonButton";
import CartoonContainer from "../../components/containers/CartoonContainer";
import CartoonInput from "../../components/inputs/CartoonInput";
import { ContentContainer, InputGroup, Label, PageContainer, FormContainer, DashboardButton, ChildCard, ChildInfo, ButtonContainer, ModalOverlay, ModalContent, ModalInnerContent } from "../SponsorDashboard";
import CartoonHeader from "../../components/headers/CartoonHeader";
import { useAuth } from "../../firebase/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import SnowyGround from "../../components/effects/SnowyGround";
import Snowfall from "../../components/effects/Snowfall";
import Navbar from "../../components/Navbar";
import { Family, setFamilyInfo, Child, getFamily, getChildren } from "../../firebase/families";
import { Navigate, useNavigate } from "react-router-dom";
import { getAccountType, setAccountType } from "../../firebase/auth";
import { Tag } from "../../components/headers/tag";
import styled from "styled-components";
import Catalog from "../Catalog";
import { setSponsorInfo } from "../../firebase/sponsors";
import CartoonImageInput from "../../components/inputs/CartoonImageInput";
import CartoonImageContainer from "../../components/containers/CartoonImageContainer";
import { uploadImage, uploadMultipleImages, getFileDownloadURL, deleteFile } from "../../firebase/storage";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebase/config";
import { BasicInfoForm } from "./FamilyInfoForm";
import { IdentityVerification } from "./FamilyVerification";
import { ChildAdding } from "./FamilyChildAdding";
import { info } from "console";

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #1EC9F2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    will-change: transform;
    transform: translateZ(0);

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

const LoadingPage = ({text}: {text: string}) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '2vmin'
    }}>
        <CartoonContainer style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '4vmin',
            gap: '2vmin'
        }}>
            <CartoonHeader title={text} subtitle="Please Wait" />
            <Spinner />
        </CartoonContainer>
    </div>
);

const FamilyDashboard = () => {
    const [page, setPage] = useState<"dashboard" | "basicForm" | "childAdding" | "giftCatalog" | "identityVerification">("dashboard");
    const DashboardPage: React.FC = () => {
        const [family, setFamily] = useState<Family | null>(null);
        const [isVerified, setIsVerified] = useState(false);
        const { user } = useAuth();

        const [loadingStatus, setLoadingStatus] = useState<{
            basicInfo: boolean | null;
            children: boolean | null;
            documents: boolean | null;
            verified: boolean | null;
            family: boolean | null;
        }>({
            basicInfo: null,
            children: null,
            documents: null,
            verified: null,
            family: null
        });

        const [infoStatus, setInfoStatus] = useState<{
            hasFamily: boolean | null;
            hasBasicInfo: boolean | null;
            hasChildren: boolean | null;
            hasDocuments: boolean | null;
        }>({
            hasFamily: null,
            hasBasicInfo: null,
            hasChildren: null,
            hasDocuments: null,
        });

        const [documentStatus, setDocumentStatus] = useState<{
            address: boolean | null;
            children: boolean | null;
            income: boolean | null;
        }>({
            address: null,
            children: null,
            income: null,
        });

        // Get the family
        useEffect(() => {
            if (!user) return;

            setLoadingStatus(prev => ({...prev, family: true}));
            const getHasFamily = async () => {
                try {
                    const family = await getFamily();
                    if (family) {
                        setFamily(family);
                        setInfoStatus(prev => ({...prev, hasFamily: true}));
                    } else {
                        setInfoStatus(prev => ({...prev, hasFamily: false}));
                    }
                } catch (error) {
                    console.error("Error fetching family:", error);
                    setInfoStatus(prev => ({...prev, hasFamily: false}));
                } finally {
                    setLoadingStatus(prev => ({...prev, family: false}));
                }
            };
            getHasFamily();
        }, [user]);

        // Get the basic info
        useEffect(() => {
            if (!family || !user) return;

            const check = ["Parent1Name", "Parent2Name", "PhoneNumber", "StreetAddress", "ZipCode"];
            setLoadingStatus(prev => ({...prev, basicInfo: true}));
            
            const hasAllBasicInfo = check.every(field => 
                (family?.[field as keyof Family]?.toString() || '').trim().length > 0
            );
            
            setInfoStatus(prev => ({
                ...prev,
                hasBasicInfo: hasAllBasicInfo
            }));
            
            setLoadingStatus(prev => ({...prev, basicInfo: false}));
        }, [family, user]);

        // Get the children
        useEffect(() => {
            if (!family || !user) return;
            
            setLoadingStatus(prev => ({...prev, children: true}));
            setInfoStatus(prev => ({
                ...prev,
                hasChildren: family.Children.length > 0
            }));
            setLoadingStatus(prev => ({...prev, children: false}));
        }, [family, user]);

        // Getting the documents
        useEffect(() => {
            if (!user || !family) return;

            const loadDocuments = async () => {
                setLoadingStatus(prev => ({...prev, documents: true}));
                try {
                    const types: ('address' | 'children' | 'income')[] = ['address', 'children', 'income'];
                    const newDocStatus = {...documentStatus};
                    
                    for (const type of types) {
                        const folderRef = ref(storage, `documents/${user.uid}/${type}`);
                        const result = await listAll(folderRef);
                        newDocStatus[type] = result.items.length > 0;
                    }
                    
                    setDocumentStatus(newDocStatus);
                    setInfoStatus(prev => ({
                        ...prev,
                        hasDocuments: Object.values(newDocStatus).every(status => status === true)
                    }));
                } catch (error) {
                    console.error("Error loading documents:", error);
                    setInfoStatus(prev => ({...prev, hasDocuments: false}));
                } finally {
                    setLoadingStatus(prev => ({...prev, documents: false}));
                }
            };

            loadDocuments();
        }, [family, user]);

        // Check verification status
        useEffect(() => {
            if (!family || !user) return;
            
            setLoadingStatus(prev => ({...prev, verified: true}));
            console.log("Family verification status:", family.Verified);
            setIsVerified(!!family.Verified);
            console.log("isVerified set to:", !!family.Verified);
            setLoadingStatus(prev => ({...prev, verified: false}));
        }, [family, user]);

        const isLoading = Object.values(loadingStatus).some(status => status === null || status === true);

        useEffect(() => {
            console.log("Status Update: ")
            console.log(isLoading);
            if (!isLoading) {
                console.log(loadingStatus);
                console.log(infoStatus);
            }
        }, [isLoading]);

        const dashboardContent = useMemo(() => (
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
                    <CartoonButton color="#1EC9F2" disabled={!infoStatus.hasBasicInfo} onClick={() => setPage("childAdding")}>Add Children</CartoonButton>
                    <CartoonButton color="#1EC9F2" disabled={!infoStatus.hasChildren || !infoStatus.hasBasicInfo} onClick={() => setPage("identityVerification")}>Verify Identity</CartoonButton>
                    <CartoonButton color="#1EC9F2" disabled={!infoStatus.hasBasicInfo || !isVerified} onClick={() => setPage("giftCatalog")}>Gift Catalog</CartoonButton>
                </CartoonContainer>
                {(!infoStatus.hasBasicInfo || !infoStatus.hasChildren || !infoStatus.hasDocuments) && (
                    <CartoonContainer style={{borderColor: 'black', backgroundColor: '#CA242B', color: 'white', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'white'}}> 
                            {!infoStatus.hasBasicInfo ? "Please update your basic information before adding children" : 
                             !infoStatus.hasChildren ? "Please add children before verifying identity" : 
                             "Please upload all required documents: " + 
                             Object.entries(documentStatus)
                                 .filter(([_, doc]) => !doc)
                                 .map(([type]) => type)
                                 .join(', ')} 
                        </p>
                    </CartoonContainer>
                )}

                {(infoStatus.hasDocuments && !isVerified) && (
                    <CartoonContainer style={{borderColor: 'black', backgroundColor: '#FFD711', color: 'black', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'black'}}> Please wait for your identity to be verified </p>
                    </CartoonContainer>
                )}

                {(isVerified) && (
                    <CartoonContainer style={{borderColor: 'black', backgroundColor: '#4CAF50', color: 'white', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'white'}}> You are verified! </p>
                    </CartoonContainer>
                )}
            </div>
        ), [infoStatus, documentStatus, isVerified, setPage]);

        if (isLoading) {
            return <LoadingPage text="Loading Your Dashboard" />;
        }
        return dashboardContent;
    };

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