import { collection, addDoc, DocumentReference, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from './config';

export interface Child {
  ChildID: string;

  ChildGender: string;
  ChildAge: number;
  
  HasDisabilities: boolean;

  SchoolName: string;
}

export interface Family {
  FamilyID: string;

  Parent1Name: string;
  Parent2Name: string;

  StreetAddress: string;
  ZipCode: string;

  PhoneNumber: string;

  Children: Child[];

  isSponsored: boolean;
  timestamp: Date;
}

export async function addFamily(family: Family): Promise<void> {
    try {
        console.log("Attempting to add document to Firestore...");
        const familiesCollection = collection(db, "families");
        
        const docRef: DocumentReference = await addDoc(familiesCollection, {family}, );
        console.log("✅ Success! Document written with ID:", docRef.id);
      } catch (e) {
        console.error("❌ Error adding document:", e);
      }
}

export async function getFamilies(): Promise<Family[]> {
  const familiesCollection = collection(db, "families");
  const querySnapshot = await getDocs(familiesCollection);
  return querySnapshot.docs.map(doc => ({
    ...doc.data().family,
    FamilyID: doc.id
  }));
}

export async function updateFamilySponsoredStatus(familyId: string, isSponsored: boolean): Promise<void> {
  try {
    const familyRef = doc(db, "families", familyId);
    await updateDoc(familyRef, {
      "family.isSponsored": isSponsored
    });
    console.log("✅ Success! Family sponsored status updated");
  } catch (e) {
    console.error("❌ Error updating family sponsored status:", e);
  }
}
