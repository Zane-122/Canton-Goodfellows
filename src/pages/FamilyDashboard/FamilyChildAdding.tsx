import { useState } from 'react';
import { useAuth } from '../../firebase/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { setFamilyInfo, Family, Child } from '../../firebase/families';
import CartoonButton from '../../components/buttons/CartoonButton';
import CartoonContainer from '../../components/containers/CartoonContainer';
import CartoonInput from '../../components/inputs/CartoonInput';
import CartoonHeader from '../../components/headers/CartoonHeader';
import { ContentContainer, InputGroup, Label, FormContainer, ModalOverlay, ModalContent, ModalInnerContent, ChildCard, ChildInfo, ButtonContainer } from '../SponsorDashboard';
import { Tag } from '../../components/headers/tag';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const ChildAdding: React.FC = () => {
    const [showChildForm, setShowChildForm] = useState(false);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [childAge, setChildAge] = useState("");
    const [childGender, setChildGender] = useState<"Boy" | "Girl" | "Other">("Boy");
    const [hasDisabilities, setHasDisabilities] = useState(false);
    const [schoolName, setSchoolName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("-");

    const [family, setFamily] = useState<Family | null>(null);
    const [refreshFamily, setRefreshFamily] = useState(false);
    const {user} = useAuth();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [childToDelete, setChildToDelete] = useState<string | null>(null);

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
                console.log("It works");
            }
        }
    };

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