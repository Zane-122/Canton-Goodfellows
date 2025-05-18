import {
    collection,
    addDoc,
    DocumentReference,
    getDocs,
    doc,
    updateDoc,
    setDoc,
    getDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import { getFamilyDocId } from './auth';
import { User } from 'firebase/auth';


export interface Toy {
    title: string;

    price: {
        value: number;
        currency: string;
    };

    image: string;
    link: string;

    starred: boolean;
    giftType: string;

    asin: string;
}

export interface Child {
    ChildID: string;

    ChildGender: string;
    ChildAge: number;
    ChildToys: Toy[];
    HasDisabilities: boolean;

    isSponsored: boolean;
    sponsorDocID: string;
    
    SchoolName: string;
}

export interface Family {
    FamilyID?: string;
    Parent1Name: string;
    Parent2Name: string;
    StreetAddress: string;
    ZipCode: string;
    PhoneNumber: string;
    Children: Child[];
    Verified: boolean;
    timestamp: Date;
}


export const defaultFamily = (displayName: string = ''): Family => ({
    Parent1Name: displayName,
    Parent2Name: '',
    StreetAddress: '',
    ZipCode: '',
    PhoneNumber: '',
    Children: [],
    Verified: false,
    timestamp: new Date(),
});
export async function addFamily(): Promise<DocumentReference> {
    try {
        console.log('Attempting to add document to Firestore...');
        const families = await getFamilies();
        
        // Find the highest existing family number
        const familyNumbers = families
            .map(f => {
                const match = f.FamilyID?.match(/Family (\d+)/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(num => !isNaN(num));
        
        const nextNumber = familyNumbers.length > 0 ? Math.max(...familyNumbers) + 1 : 1;
        const familyId = `Family ${nextNumber}`;
        
        const familiesCollection = collection(db, 'families');
        const docRef = await addDoc(familiesCollection, { 
            FamilyID: familyId,
            family: {
                FamilyID: familyId,
                timestamp: new Date()
            }
        });
        
        console.log('✅ Success! Document written with ID:', docRef.id);
        return docRef;
    } catch (e) {
        console.error('❌ Error adding document:', e);
        throw e;
    }
}

export async function setFamilyInfo(family: Family): Promise<void> {
    try {
        const id = await getFamilyDocId();
        console.log(id);
        const familyRef = doc(db, 'families', id);
        const familyDoc = await getDoc(familyRef);
        if (familyDoc.exists()) {
            await updateDoc(familyRef, {
                FamilyID: familyDoc.data()?.FamilyID,
                family,
            });
            console.log('Family information updated successfully');
        }
    } catch (error) {
        console.error('Error fetching family document ID:', error);
    }
}

export async function getFamilies(): Promise<Family[]> {
    const familiesCollection = collection(db, 'families');
    const querySnapshot = await getDocs(familiesCollection);
    return querySnapshot.docs.map((doc) => ({
        ...doc.data().family,
        FamilyID: doc.data().FamilyID,
    }));
}

export async function addChildToy(toy: Toy, familyID: string, childID: string): Promise<void> {
    const familyRef = doc(db, 'families', familyID);
    const familyDoc = await getDoc(familyRef);
    const familyData = familyDoc.data()?.family;
    const allChildren = familyData.Children;
    const chosenChild = allChildren.find((child: Child) => child.ChildID === childID);
    const currentToys = chosenChild?.ChildToys || [];

    const simplifiedToy = {
        title: toy.title,
        price:"$"+toy.price.value,
        image: toy.image,
        asin: toy.asin,
        link: toy.link,
        giftType: toy.giftType,
        starred: false,
    };

    // Check if toy with this ASIN already exists
    const toyExists = currentToys.some((t: Toy) => t.asin === toy.asin);
    if (!toyExists && chosenChild) {
        const updatedChildren = allChildren.map((child: Child) =>
            child.ChildID === childID
                ? { ...child, ChildToys: [...currentToys, simplifiedToy] }
                : child
        );

        await updateDoc(familyRef, {
            'family.Children': updatedChildren,
        });
    }
}

export async function removeChildToy(toy: Toy, familyID: string, childID: string): Promise<void> {
    const familyRef = doc(db, 'families', familyID);
    const familyDoc = await getDoc(familyRef);
    const familyData = familyDoc.data()?.family;
    const allChildren = familyData.Children;
    const chosenChild = allChildren.find((child: Child) => child.ChildID === childID);
    if (chosenChild) {
        const updatedChildren = allChildren.map((child: Child) =>
            child.ChildID === childID
                ? {
                      ...child,
                      ChildToys: chosenChild.ChildToys.filter((t: Toy) => t.asin !== toy.asin),
                  }
                : child
        );

        await updateDoc(familyRef, {
            'family.Children': updatedChildren,
        });
    }
}

export async function getChildren(familyID: string): Promise<Child[]> {
    const familyRef = doc(db, 'families', familyID);
    const familyDoc = await getDoc(familyRef);
    const familyData = familyDoc.data()?.family;
    return familyData.Children;
}

export async function getWishlist(familyID: string, childID: string): Promise<Toy[]> {
    const familyRef = doc(db, 'families', familyID);
    const familyDoc = await getDoc(familyRef);
    const familyData = familyDoc.data()?.family;
    const chosenChild = familyData.Children.find((child: Child) => child.ChildID === childID);

    return (
        chosenChild?.ChildToys.map((toy: any) => ({
            ...toy,
            price: {
                value: parseFloat(toy.price.split(' ')[1]),
                currency: toy.price.split(' ')[0],
            },
        })) || []
    );
}

export async function toggleToyStarred(toy: Toy, familyID: string, childID: string): Promise<void> {
    const familyRef = doc(db, 'families', familyID);
    const familyDoc = await getDoc(familyRef);
    const familyData = familyDoc.data()?.family;
    const allChildren = familyData.Children;
    const chosenChild = allChildren.find((child: Child) => child.ChildID === childID);
    const currentToys = chosenChild?.ChildToys || [];

    // Count starred toys by type
    const starredCounts = {
        "Small Gift": currentToys.filter((t: Toy) => t.giftType === "Small Gift" && t.starred).length,
        "Medium Gift": currentToys.filter((t: Toy) => t.giftType === "Medium Gift" && t.starred).length,
        "Large Gift": currentToys.filter((t: Toy) => t.giftType === "Large Gift" && t.starred).length
    };

    // Check if we can star this toy
    const canStar = !toy.starred && (
        (toy.giftType === "Small Gift" && starredCounts["Small Gift"] < 1) ||
        (toy.giftType === "Medium Gift" && starredCounts["Medium Gift"] < 2) ||
        (toy.giftType === "Large Gift" && starredCounts["Large Gift"] < 1)
    );

    if (!canStar && !toy.starred) {
        return; // Don't proceed if we can't star the toy
    }

    const updatedToys = currentToys.map((t: Toy) => 
        t.asin === toy.asin 
            ? { ...t, starred: !t.starred }
            : t
    );

    const updatedChildren = allChildren.map((child: Child) =>
        child.ChildID === childID
            ? { ...child, ChildToys: updatedToys }
            : child
    );

    await updateDoc(familyRef, {
        'family.Children': updatedChildren,
    });
}
