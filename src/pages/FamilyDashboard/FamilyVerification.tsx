import { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { setFamilyInfo, Family } from '../../firebase/families';
import CartoonButton from '../../components/buttons/CartoonButton';
import CartoonContainer from '../../components/containers/CartoonContainer';
import CartoonInput from '../../components/inputs/CartoonInput';
import CartoonHeader from '../../components/headers/CartoonHeader';
import { ContentContainer, InputGroup, Label, FormContainer, ModalOverlay, ModalContent, ModalInnerContent } from '../SponsorDashboard';
import CartoonImageInput from '../../components/inputs/CartoonImageInput';
import CartoonImageContainer from '../../components/containers/CartoonImageContainer';
import { uploadImage } from '../../firebase/storage';
import { ref, listAll, deleteObject, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { Tag } from '../../components/headers/tag';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const IdentityVerification: React.FC = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [hasAllInfo, setHasAllInfo] = useState(false);
    const [family, setFamily] = useState<Family | null>(null);
    const [page, setPage] = useState<"dashboard" | "basicForm" | "childAdding" | "giftCatalog" | "identityVerification">("dashboard");
    const [refreshFamily, setRefreshFamily] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [childToDelete, setChildToDelete] = useState<string | null>(null);
    const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);
    const [loadingAccountStatus, setLoadingAccountStatus] = useState(true);
    const [documentStatus, setDocumentStatus] = useState<{
        address: { url: string | null; status: 'pending' | 'uploading' | 'success' | 'error' };
        children: { url: string | null; status: 'pending' | 'uploading' | 'success' | 'error' };
        income: { url: string | null; status: 'pending' | 'uploading' | 'success' | 'error' };
    }>({
        address: { url: null, status: 'pending' },
        children: { url: null, status: 'pending' },
        income: { url: null, status: 'pending' }
    });

    const loadDocuments = async () => {
        if (!user?.uid) return;
        
        try {
            const types: ('address' | 'children' | 'income')[] = ['address', 'children', 'income'];
            const newDocumentStatus = { ...documentStatus };
            
            for (const type of types) {
                try {
                    // List files in the folder
                    const folderRef = ref(storage, `documents/${user.uid}/${type}`);
                    const result = await listAll(folderRef);
                    
                    if (result.items.length > 0) {
                        // Get the most recent file (assuming files are named with timestamps)
                        const mostRecentFile = result.items.sort((a, b) => {
                            return b.name.localeCompare(a.name); // Sort by name (which includes timestamp)
                        })[0];
                        
                        const url = await getDownloadURL(mostRecentFile);
                        newDocumentStatus[type] = { url, status: 'success' };
                    } else {
                        console.log(`No existing ${type} document found`);
                        newDocumentStatus[type] = { url: null, status: 'pending' };
                    }
                } catch (error) {
                    console.log(`No existing ${type} document found`);
                    newDocumentStatus[type] = { url: null, status: 'pending' };
                }
            }
            
            setDocumentStatus(newDocumentStatus);
            
            // Check if all documents are uploaded
            const allUploaded = Object.values(newDocumentStatus).every(doc => doc.status === 'success');
            setAllDocumentsUploaded(allUploaded);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoadingAccountStatus(false);
        }
    };

    const [enlargeImage, setEnlargeImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
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
        console.log('handleImageUpload called with:', { file, type });
        setDocuments(prev => {
            console.log('Previous documents state:', prev);
            const newState = { ...prev, [type]: file };
            console.log('New documents state:', newState);
            return newState;
        });
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
            console.log('Starting upload with documents:', documents);
            const uploadPromises = (Object.entries(documents) as [keyof typeof documents, File | null][]).map(async ([type, file]) => {
                console.log('Processing upload for:', { type, file });
                if (!file) {
                    console.log('No file for type:', type);
                    return;
                }
                
                setDocumentStatus(prev => ({
                    ...prev,
                    [type]: { ...prev[type], status: 'uploading' }
                }));

                try {
                    // Delete all existing files in the folder
                    const folderRef = ref(storage, `documents/${user.uid}/${type}`);
                    const result = await listAll(folderRef);
                    
                    const deletePromises = result.items.map(fileRef => deleteObject(fileRef));
                    await Promise.all(deletePromises);
                    console.log("Deleted all existing files in the folder");
                    console.log(file);
                    const url = await uploadImage(file, `documents/${user.uid}/${type}`);
                    console.log(url);
                    setDocumentStatus(prev => ({
                        ...prev,
                        [type]: { url, status: 'success' }
                    }));
                    
                    const allUploaded = Object.values(documentStatus).every(doc => doc.status === 'success');
                    setAllDocumentsUploaded(allUploaded);
                    
                    return url;
                } catch (error) {
                    console.error(`Error uploading ${type} document:`, error);
                    setDocumentStatus(prev => ({
                        ...prev,
                        [type]: { ...prev[type], status: 'error' }
                    }));
                    throw error;
                }
            });

            await Promise.all(uploadPromises);
            await loadDocuments(); // Refresh document status after upload
        } catch (error) {
            console.error('Error uploading documents:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveDocument = async (type: 'address' | 'children' | 'income') => {
        if (!user?.uid) return;
        
        try {
            // Delete all files in the folder
            const folderRef = ref(storage, `documents/${user.uid}/${type}`);
            const result = await listAll(folderRef);
            const deletePromises = result.items.map(fileRef => deleteObject(fileRef));
            await Promise.all(deletePromises);
            
            // Update local state
            setDocuments(prev => ({ ...prev, [type]: null }));
            setDocumentStatus(prev => ({
                ...prev,
                [type]: { url: null, status: 'pending' }
            }));
            
            // Update allDocumentsUploaded status
            const newStatus = { ...documentStatus, [type]: { url: null, status: 'pending' } };
            const allUploaded = Object.values(newStatus).every(doc => doc.status === 'success');
            setAllDocumentsUploaded(allUploaded);
        } catch (error) {
            console.error(`Error removing ${type} document:`, error);
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
            
            <CartoonContainer style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4vmin',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                padding: '4vmin',
                width: '100%',
                alignItems: 'center'
            }}>
                                <CartoonHeader 
                title="Identity Verification" 
                subtitle="Please provide the following documents to verify your identity"
            />
            <p> - </p>
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
                            color: getStatusColor(documentStatus.address.status),
                            fontFamily: 'TT Trick New, serif',
                            fontSize: '2vmin'
                        }}>
                            {getStatusText(documentStatus.address.status)}
                        </div>
                    </div>
                    <CartoonImageInput 
                        placeholder="Upload proof of address (utility bill, lease agreement, etc.)" 
                        onChange={(file) => handleImageUpload(file, 'address')}
                        value={documents.address ? URL.createObjectURL(documents.address) : documentStatus.address.url || ""} 
                        onEnlarge={() => {
                            const imageToShow = documents.address ? URL.createObjectURL(documents.address) : documentStatus.address.url;
                            if (imageToShow) {
                                setSelectedImage(imageToShow);
                                setEnlargeImage(true);
                            }
                        }}
                        onRemove={() => handleRemoveDocument('address')}
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
                            color: getStatusColor(documentStatus.children.status),
                            fontFamily: 'TT Trick New, serif',
                            fontSize: '2vmin'
                        }}>
                            {getStatusText(documentStatus.children.status)}
                        </div>
                    </div>
                    <CartoonImageInput 
                        placeholder="Upload proof of children (birth certificates, school records, etc.)" 
                        onChange={(file) => handleImageUpload(file, 'children')}
                        value={documents.children ? URL.createObjectURL(documents.children) : documentStatus.children.url || ""} 
                        onEnlarge={() => {
                            const imageToShow = documents.children ? URL.createObjectURL(documents.children) : documentStatus.children.url;
                            if (imageToShow) {
                                setSelectedImage(imageToShow);
                                setEnlargeImage(true);
                            }
                        }}
                        onRemove={() => handleRemoveDocument('children')}
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
                            color: getStatusColor(documentStatus.income.status),
                            fontFamily: 'TT Trick New, serif',
                            fontSize: '2vmin'
                        }}>
                            {getStatusText(documentStatus.income.status)}
                        </div>
                    </div>
                    <CartoonImageInput 
                        placeholder="Upload proof of income (pay checks, tax returns, etc.)" 
                        onChange={(file) => handleImageUpload(file, 'income')}
                        value={documents.income ? URL.createObjectURL(documents.income) : documentStatus.income.url || ""} 
                        onEnlarge={() => {
                            const imageToShow = documents.income ? URL.createObjectURL(documents.income) : documentStatus.income.url;
                            if (imageToShow) {
                                setSelectedImage(imageToShow);
                                setEnlargeImage(true);
                            }
                        }}
                        onRemove={() => handleRemoveDocument('income')}
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