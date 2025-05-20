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
import { getAccountType } from "../../firebase/auth";
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

const FamilyDashboard = () => {
    const [page, setPage] = useState<"dashboard" | "basicForm" | "childAdding" | "giftCatalog" | "identityVerification">("dashboard");
    const DashboardPage: React.FC = () => {
        // States for the family
        const [family, setFamily] = useState<Family | null>(null);

        // State for verification
        const [isVerified, setIsVerified] = useState(false);

        // Get the current user
        const {user} = useAuth();

        // Loading states
        const [loadingStatus, setLoadingStatus] = useState<{
            basicInfo: boolean;
            children: boolean;
            documents: boolean;
            verified: boolean;
        }>({
            basicInfo: true,
            children: true,
            documents: true,
            verified: true
        });

        // Has requirements states
        const [infoStatus, setInfoStatus] = useState<{
            hasFamily: boolean;
            hasBasicInfo: boolean;
            hasChildren: boolean;
            hasDocuments: boolean;
        }>({
            hasFamily: false,
            hasBasicInfo: false,
            hasChildren: false,
            hasDocuments: false,
        });

        // Document status
        const [documentStatus, setDocumentStatus] = useState<{
            address: boolean;
            children: boolean;
            income: boolean;
        }>({
            address: false,
            children: false,
            income: false,
        });

        // Get the family
        useEffect(() => {
            if (!user) return;
            if (family) return;

            const getHasFamily = async () => {
                const family = await getFamily();
                if (family) {
                    console.log(family)
                    setFamily(family);
                    setInfoStatus({...infoStatus, hasFamily: true});
                }
            }
            getHasFamily();
        }, [user, family]);

        // Get the basic info
        useEffect(() => {
            if (!family) return;
            if (!user) return;

            const check = ["Parent1Name", "Parent2Name", "PhoneNumber", "StreetAddress", "ZipCode"];
            const getBasicInfo = async () => {
                if (family) {                   
                    setInfoStatus(prev => {
                        const newStatus = {
                            ...prev, 
                            hasBasicInfo: check.every(field => family[field as keyof Family]?.toString().length !== 0)
                        };
                        console.log(newStatus);
                        return newStatus;
                    });
                } else {
                    console.log("No family, can't get basic info")
                    setInfoStatus(prev => ({...prev, hasBasicInfo: false}));
                }
            }
            try {
                getBasicInfo();
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingStatus(prev => ({...prev, basicInfo: false}));
            }
        }, [family, user, loadingStatus])

        // Get the children
        useEffect(() => {
            if (!family) return;
            if (!user) return;

            const getFamilyChildren = async () => {
                if (family) {
                    if (family.Children.length === 0) {setInfoStatus({...infoStatus, hasChildren: false}); return;}
                    setInfoStatus({...infoStatus, hasChildren: true});
                } else {
                    setInfoStatus({...infoStatus, hasChildren: false});
                }
            }
            try {
                getFamilyChildren();
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingStatus(prev => ({...prev, children: false}));
            }
        }, [family, user, loadingStatus])

        // Getting the documents
        useEffect(() => {
            if (!user) return;
            if (!family) return;

            const loadDocuments = async () => {
                if (!family) return;
                if (!user) return;

                const types: ('address' | 'children' | 'income')[] = ['address', 'children', 'income'];
                
                for (const type of types) {
                    const folderRef = ref(storage, `documents/${user.uid}/${type}`);
                    const result = await listAll(folderRef);

                    if (result.items.length > 0) {
                        setDocumentStatus({...documentStatus, [type]: true});
                    } else {
                        setDocumentStatus({...documentStatus, [type]: false});
                    }
                }
            }
            try {
                loadDocuments();
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingStatus(prev => ({...prev, documents: true}));
            }
        }, [family, user, loadingStatus])

        useEffect(() => {
            if (!family) return;
            if (!user) return;

            const getHasAllDocuments = async () => {
                if (Object.values(documentStatus).every(status => status === true)) {
                    setInfoStatus({...infoStatus, hasDocuments: true});
                } else {
                    setInfoStatus({...infoStatus, hasDocuments: false});
                }
            }
            try {
                getHasAllDocuments();
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingStatus(prev => ({...prev, documents: false}));
            }
        }, [family, user, documentStatus])

        useEffect(() => {
            if (!user) return;
            if (!family) return;

            const getIsVerified = async () => {
                const isVerified = family?.Verified;
                setIsVerified(isVerified);
            }
            try {
                getIsVerified();
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingStatus(prev => ({...prev, verified: false}));
            }
            
        }, [user, family])

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
                    
                    <CartoonButton disabled={!infoStatus.hasBasicInfo} color="#1EC9F2" onClick={() => setPage("childAdding")}>Add Children</CartoonButton>
                    <CartoonButton disabled={!infoStatus.hasChildren || !infoStatus.hasBasicInfo} color="#1EC9F2" onClick={() => setPage("identityVerification")}>Verify Identity</CartoonButton>
                    
                    <CartoonButton disabled={!infoStatus.hasBasicInfo || !isVerified} color="#1EC9F2" onClick={() => setPage("giftCatalog")}>Gift Catalog</CartoonButton>
                </CartoonContainer>
                {(!infoStatus.hasBasicInfo || !infoStatus.hasChildren || !infoStatus.hasDocuments) && (
                    <CartoonContainer style={{borderColor: 'black', backgroundColor: '#CA242B', color: 'white', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'white'}}> 
                            {!infoStatus.hasBasicInfo ?`${JSON.stringify(infoStatus)} "Please update your basic information before adding children"` : 
                             !infoStatus.hasChildren ? "Please add children before verifying identity" : 
                             "Please upload all required documents: " + 
                             Object.entries(documentStatus)
                                 .filter(([_, doc]) => !doc)
                                 .map(([type]) => type)
                                 .join(', ')} 
                        </p>
                    </CartoonContainer>
                )}

                {(infoStatus.hasDocuments && !family?.Verified) && (
                    <CartoonContainer style={{borderColor: 'black', backgroundColor: '#FFD711', color: 'black', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <p style={{fontSize: '2vmin', fontFamily: 'TT Trick New, serif', textAlign: 'center', color: 'black'}}> Please wait for your identity to be verified </p>
                    </CartoonContainer>
                )}
            </div>
        ), [infoStatus, documentStatus, family, isVerified, setPage]);

        return Object.values(loadingStatus).every(status => status === false) && dashboardContent
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