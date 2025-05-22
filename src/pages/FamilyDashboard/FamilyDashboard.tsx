import { useEffect, useState, useMemo } from "react";
import CartoonButton from "../../components/buttons/CartoonButton";
import CartoonContainer from "../../components/containers/CartoonContainer";
import { DashboardButton} from "../SponsorDashboard";
import CartoonHeader from "../../components/headers/CartoonHeader";
import { useAuth } from "../../firebase/contexts/AuthContext";
import SnowyGround from "../../components/effects/SnowyGround";
import Snowfall from "../../components/effects/Snowfall";
import Navbar from "../../components/Navbar";
import { Family, getFamily } from "../../firebase/families";

import Catalog from "./Catalog";
import { BasicInfoForm } from "./FamilyInfoForm";
import { IdentityVerification } from "./FamilyVerification";
import { ChildAdding } from "./FamilyChildAdding";

import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/config";
import { Spinner } from "../../components/effects/Spinner";

interface DocumentStatus {
    address: boolean | null;
    children: boolean | null;
    income: boolean | null;
}

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
            <Spinner size={5} />
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

        const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
            address: null,
            children: null,
            income: null,
        });

        const loadDocumentStatus = async () => {
            if (!functions || !user) {
                throw new Error("Error loading document status: No user or functions");
            }

            setLoadingStatus(prev => ({...prev, documents: true}));

            const loadDocumentStatusFn = httpsCallable(functions!, 'getDocumentStatus');

            try {
                const result = await loadDocumentStatusFn({uid: user.uid});
                const newDocStatus = result.data as DocumentStatus;
  
                setDocumentStatus({
                    address: newDocStatus.address,
                    children: newDocStatus.children,
                    income: newDocStatus.income
                });

                setInfoStatus(prev => ({
                    ...prev,
                    hasDocuments: Object.values(newDocStatus).every(status => status === true)
                }));

                setLoadingStatus(prev => ({...prev, documents: false}));
            } catch(error) {
                console.error("Error loading document status:", error);
                setInfoStatus(prev => ({...prev, hasDocuments: false}));
                setLoadingStatus(prev => ({...prev, documents: false}));
                throw error;
            }
        };

        // Get the family
        useEffect(() => {
            if (!user) return;
            if (family) return;
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
            if (!user || !family) {
                return;
            };

            loadDocumentStatus().catch(error => {
                console.error("Error in document status effect:", error);
            });
        }, [family, user]);

        useEffect(() => {
            if (documentStatus) {
                setInfoStatus(prev => ({
                    ...prev,
                    hasDocuments: Object.values(documentStatus).every(status => status === true)
                }));

                console.log("Document status: ");
                console.log(documentStatus.address);
                console.log(documentStatus.children);
                console.log(documentStatus.income);
            }
        }, [family, user, documentStatus]);

        // Check verification status
        useEffect(() => {
            if (!family || !user) return;
            
            setLoadingStatus(prev => ({...prev, verified: true}));
            setIsVerified(!!family.Verified);
            setLoadingStatus(prev => ({...prev, verified: false}));
        }, [family, user]);

        const isLoading = Object.values(loadingStatus).some(status => status === null || status === true);

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
                    <CartoonContainer style={{backgroundColor: '#FFD711', color: 'black', height: '2vmin', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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