import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './config';

import {
    collection,
    addDoc,
    DocumentReference,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteField,
    deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import { addFamily, setFamily, defaultFamily } from './families';
import { addSponsor, setSponsorInfo, defaultSponsor } from './sponsors';
import { useNavigate } from 'react-router-dom';

const googleProvider = new GoogleAuthProvider();
export const handleAddSponsor = async (): Promise<string> => {
    try {
        const docRef = await addSponsor();
        console.log('Sponsor added successfully!');
        return docRef.id;
    } catch (error) {
        console.error('Failed to add sponsor:', error);
        throw error;
    }
}
const handleAddFamily = async (): Promise<string> => {
    try {
        const docRef = await addFamily();
        console.log('Family added successfully!');
        return docRef.id;
    } catch (error) {
        console.error('Failed to add family:', error);
        throw error;
    }
};

export interface AuthUser {
    email: string | null;
    uid: string;
    displayName: string | null;
    photoURL: string | null;
}

export interface Account {
    authUser: AuthUser;
    accountType: 'sponsor' | 'family' | null;
}

export class AuthError extends Error {
    constructor(
        message: string,
        public code: string
    ) {
        super(message);
        this.name = 'AuthError';
    }
}
export async function getFamilyDocId(): Promise<string> {
    const user = auth.currentUser;

    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if ((await getAccountType()) === 'family') {
            return userDoc.data()?.family.familyDocId;
        }
        return '';
    } else {
        throw new AuthError('No user is signed in.', 'no-user-signed-in');
        return '';
    }
}

export async function signInWithGoogle(): Promise<User> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, { email: user.email, accountType: null });
        }

        return result.user;
    } catch (error: unknown) {
        console.error('Error signing in with Google:', error);

        // Handle specific error cases
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-disabled':
                    throw new AuthError(
                        'This account has been disabled. Please contact support.',
                        'user-disabled'
                    );
                case 'auth/popup-closed-by-user':
                    throw new AuthError('Sign in was cancelled. Please try again.', 'popup-closed');
                case 'auth/popup-blocked':
                    throw new AuthError(
                        'Pop-up was blocked. Please allow pop-ups for this site.',
                        'popup-blocked'
                    );
                case 'auth/cancelled-popup-request':
                    throw new AuthError(
                        'Another sign-in attempt is in progress.',
                        'popup-cancelled'
                    );
                default:
                    throw new AuthError(error.code, error.message);
            }
        }
        throw new AuthError('An unexpected error occurred. Please try again.', 'unknown');
    }
}

export const setAccountType = async (accountType: 'family' | 'sponsor') => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is currently signed in');
    }

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (!userData) {
        throw new Error('User data not found');
    }

    // If the user is already the requested account type, do nothing
    if (userData.accountType === accountType) {
        return;
    }

    let familyDocId: string | undefined;
    let sponsorDocId: string | undefined;
    let originalUserData = { ...userData };
    let originalFamilyData: any = null;
    let originalSponsorData: any = null;
    let updatedFamilies: { ref: DocumentReference; data: any; children: any[] }[] = [];

    try {
        // Clean up existing relationships before switching account types
        if (userData.accountType === 'family' && userData.family?.familyDocId) {
            const familyRef = doc(db, 'families', userData.family.familyDocId);
            const familyDoc = await getDoc(familyRef);
            originalFamilyData = familyDoc.data();
            const children = originalFamilyData?.family?.Children || [];

            // For each child, remove them from their sponsor's sponsored_children array
            for (const child of children) {
                console.log(child);
                if (child?.sponsorDocID && child.sponsorDocID !== '') {
                    const sponsorRef = doc(db, 'sponsors', child.sponsorDocID);
                    const sponsorDoc = await getDoc(sponsorRef);
                    const sponsorData = sponsorDoc.data();
                    
                    if (sponsorData?.sponsored_children && Array.isArray(sponsorData.sponsored_children)) {
                        if (!originalFamilyData?.FamilyID) {
                            console.error('Family ID not found in family data');
                            console.log(originalFamilyData);
                            console.log(originalFamilyData.FamilyID);
                        }
                        const childIdentifier = `${originalFamilyData.FamilyID} ${child.ChildID}`;
                        console.log(childIdentifier);
                        const updatedSponsoredChildren = sponsorData.sponsored_children.filter(
                            (id: string) => id !== childIdentifier
                        );
                        
                        await updateDoc(sponsorRef, {
                            sponsored_children: updatedSponsoredChildren
                        });
                    } else {
                        console.log("No sponsored children found");
                    }
                }
            }

            await deleteDoc(familyRef);
        } else if (userData.accountType === 'sponsor' && userData.sponsor?.sponsorDocId) {
            const sponsorRef = doc(db, 'sponsors', userData.sponsor.sponsorDocId);
            const sponsorDoc = await getDoc(sponsorRef);
            originalSponsorData = sponsorDoc.data();
            
            // Get all families to check for sponsored children
            const familiesRef = collection(db, 'families');
            const familiesSnapshot = await getDocs(familiesRef);
            
            // For each family, check and update their children
            for (const familyDoc of familiesSnapshot.docs) {
                const familyData = familyDoc.data();
                const children = familyData?.family?.Children || [];
                let childrenUpdated = false;
                let originalChildren = [...children];
                
                // Check each child in the family
                for (let i = 0; i < children.length; i++) {
                    if (children[i]?.sponsorDocID === userData.sponsor.sponsorDocId) {
                        // Store original values before updating
                        const originalSponsorDocID = children[i].sponsorDocID;
                        const originalIsSponsored = children[i].isSponsored;
                        
                        // Remove sponsor reference and set isSponsored to false
                        children[i].sponsorDocID = '';
                        children[i].isSponsored = false;
                        childrenUpdated = true;
                        
                        // Store original values in the originalChildren array
                        originalChildren[i] = {
                            ...originalChildren[i],
                            sponsorDocID: originalSponsorDocID,
                            isSponsored: originalIsSponsored
                        };
                    }
                }
                
                // If any children were updated, update the family document
                if (childrenUpdated) {
                    await updateDoc(familyDoc.ref, {
                        'family.Children': children
                    });
                    // Store for potential rollback
                    updatedFamilies.push({
                        ref: familyDoc.ref,
                        data: familyData,
                        children: originalChildren
                    });
                }
            }
            
            await deleteDoc(sponsorRef);
        }

        // Create new document based on account type
        if (accountType === 'family') {
            familyDocId = await handleAddFamily();
        } else {
            sponsorDocId = await handleAddSponsor();
        }

        // Update the user's account type and document references
        await updateDoc(userRef, {
            accountType: accountType,
            ...(accountType === 'sponsor' && { sponsor: { sponsorDocId } }),
            ...(accountType === 'family' && { family: { familyDocId } }),
            ...(accountType === 'sponsor' && { family: deleteField() }),
            ...(accountType === 'family' && { sponsor: deleteField() })
        });

    } catch (error) {
        console.error('Error in account type change, rolling back:', error);
        
        // Restore original documents
        try {
            if (originalFamilyData) {
                const familyRef = doc(db, 'families', userData.family.familyDocId);
                await setDoc(familyRef, originalFamilyData);
            }
            
            if (originalSponsorData) {
                const sponsorRef = doc(db, 'sponsors', userData.sponsor.sponsorDocId);
                await setDoc(sponsorRef, originalSponsorData);
            }
            
            // Restore updated family documents with original children data
            for (const family of updatedFamilies) {
                await setDoc(family.ref, {
                    ...family.data,
                    'family.Children': family.children
                });
            }
            
            // Restore user document
            await setDoc(userRef, originalUserData);
            
            throw new Error('Failed to change account type. All changes have been rolled back.');
        } catch (restoreError) {
            console.error('Error during rollback:', restoreError);
            throw new Error('Failed to change account type and rollback failed. Please contact support.');
        }
    }
};

export async function getAccountType(): Promise<'sponsor' | 'family' | null> {
    const user = auth.currentUser;
    if (!user) {
        throw new AuthError('No user is signed in.', 'no-user-signed-in');
    }
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    return userDoc.data()?.accountType;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, { email: email, accountType: null });
        }
        return result.user;
    } catch (error) {
        console.error('Error signing in with email:', error);
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                    throw new AuthError('No account found with this email.', 'user-not-found');
                case 'auth/wrong-password':
                    throw new AuthError('Incorrect password.', 'wrong-password');
                case 'auth/invalid-email':
                    throw new AuthError('Invalid email address.', 'invalid-email');
                default:
                    throw new AuthError('Failed to sign in. Please try again.', 'signin-failed');
            }
        }
        throw new AuthError('An unexpected error occurred. Please try again.', 'unknown');
    }
}

export async function signUpWithEmail(
    email: string,
    password: string,
    displayName: string
): Promise<User> {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update the user's profile with display name
        await updateProfile(result.user, {
            displayName: displayName,
        });

        return result.user;
    } catch (error) {
        console.error('Error signing up with email:', error);
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    throw new AuthError(
                        'An account already exists with this email.',
                        'email-in-use'
                    );
                case 'auth/invalid-email':
                    throw new AuthError('Invalid email address.', 'invalid-email');
                case 'auth/weak-password':
                    throw new AuthError('Password is too weak.', 'weak-password');
                default:
                    throw new AuthError('Failed to sign up. Please try again.', 'signup-failed');
            }
        }
        throw new AuthError('An unexpected error occurred. Please try again.', 'unknown');
    }
}

export async function logOut(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw new AuthError('Failed to sign out. Please try again.', 'signout-failed');
    }
}

export async function deleteAccount(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new AuthError('No user is signed in.', 'no-user-signed-in');
    }

    // Store document references and data for potential rollback
    let familyRef: DocumentReference | null = null;
    let sponsorRef: DocumentReference | null = null;
    let familyData: any = null;
    let sponsorData: any = null;
    let updatedFamilies: { ref: DocumentReference; data: any; children: any[] }[] = [];
    let userRef: DocumentReference | null = null;
    let userData: any = null;

    try {
        // Get user's account type and associated document IDs
        userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        userData = userDoc.data();

        if (!userData) {
            throw new AuthError('User data not found.', 'user-data-not-found');
        }

        // First, clean up Firestore documents
        if (userData.accountType === 'family' && userData.family?.familyDocId) {
            familyRef = doc(db, 'families', userData.family.familyDocId);
            const familyDoc = await getDoc(familyRef);
            familyData = familyDoc.data();
            
            if (!familyData?.family?.Children) {
                console.warn('No children found in family document');
            } else {
                const children = familyData.family.Children;

                // For each child, remove them from their sponsor's sponsored_children array
                for (const child of children) {
                    console.log(child);
                    if (child?.sponsorDocID && child.sponsorDocID !== '') {
                        const sponsorRef = doc(db, 'sponsors', child.sponsorDocID);
                        const sponsorDoc = await getDoc(sponsorRef);
                        const sponsorData = sponsorDoc.data();
                        
                        if (sponsorData?.sponsored_children && Array.isArray(sponsorData.sponsored_children)) {
                            if (!familyData?.FamilyID) {
                                console.error('Family ID not found in family data');
                                console.log(familyData);
                                console.log(familyData.FamilyID);
                            }
                            const childIdentifier = `${familyData.FamilyID} ${child.ChildID}`;
                            console.log(childIdentifier);
                            const updatedSponsoredChildren = sponsorData.sponsored_children.filter(
                                (id: string) => id !== childIdentifier
                            );
                            
                            await updateDoc(sponsorRef, {
                                sponsored_children: updatedSponsoredChildren
                            });
                        } else {
                            console.log("No sponsored children found");
                        }
                    }
                }
            }

            await deleteDoc(familyRef);
        } else if (userData.accountType === 'sponsor' && userData.sponsor?.sponsorDocId) {
            userRef = doc(db, 'users', user.uid);
            userData = (await getDoc(userRef)).data();

            sponsorRef = doc(db, 'sponsors', userData.sponsor.sponsorDocId);
            const sponsorDoc = await getDoc(sponsorRef);
            sponsorData = sponsorDoc.data();
            
            // Get all families to check for sponsored children
            const familiesRef = collection(db, 'families');
            const familiesSnapshot = await getDocs(familiesRef);
            
            // For each family, check and update their children
            for (const familyDoc of familiesSnapshot.docs) {
                const familyData = familyDoc.data();
                const children = familyData?.family?.Children || [];
                let childrenUpdated = false;
                let originalChildren = [...children];
                
                // Check each child in the family
                for (let i = 0; i < children.length; i++) {
                    if (children[i]?.sponsorDocID === userData.sponsor.sponsorDocId) {
                        // Store original values before updating
                        const originalSponsorDocID = children[i].sponsorDocID;
                        const originalIsSponsored = children[i].isSponsored;
                        
                        // Remove sponsor reference and set isSponsored to false
                        children[i].sponsorDocID = '';
                        children[i].isSponsored = false;
                        childrenUpdated = true;
                        
                        // Store original values in the originalChildren array
                        originalChildren[i] = {
                            ...originalChildren[i],
                            sponsorDocID: originalSponsorDocID,
                            isSponsored: originalIsSponsored
                        };
                    }
                }
                
                // If any children were updated, update the family document
                if (childrenUpdated) {
                    await updateDoc(familyDoc.ref, {
                        'family.Children': children
                    });
                    // Store for potential rollback
                    updatedFamilies.push({
                        ref: familyDoc.ref,
                        data: familyData,
                        children: originalChildren
                    });
                }
            }
            await deleteDoc(sponsorRef);
        }


        // Finally, delete the auth account
                    
        if (userRef) {
            await deleteDoc(userRef);
        }

        try {
            
            await deleteUser(user);
        } catch (error) {
            console.error('Error deleting auth account:', error);
            // If auth deletion fails, we need to restore the Firestore documents
            try {
                if (userRef && userData) {
                    await setDoc(userRef, userData);
                }
                
                if (userData.accountType === 'family') {
                    await addFamily();
                    await setFamily(defaultFamily(user?.displayName || ''));
                } else if (userData.accountType === 'sponsor') {
                    await addSponsor();
                    await setSponsorInfo(defaultSponsor(user?.displayName || '', user?.email || ''));
                } 
            } catch (restoreError) {
                console.error('Error restoring documents after auth deletion failure:', restoreError);
            }
            throw new AuthError('Failed to delete authentication account. All changes have been rolled back.', 'auth-delete-failed');
        }

    } catch (error) {
        console.error('Error in account deletion process:', error);
        if (error instanceof FirebaseError) {
            throw new AuthError(error.message, error.code);
        }
        if (error instanceof Error) {
            throw new AuthError(error.message, 'delete-failed');
        }
        throw new AuthError('An unknown error occurred', 'delete-failed');
    }
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}
