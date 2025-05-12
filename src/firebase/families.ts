import { collection, addDoc, DocumentReference, getDocs, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from './config';

export interface Toy {
  title: string;
  price: {
    value: number;
    currency: string;
  };
  image: string;
  asin: string;
}

export interface Child {
  ChildID: string;

  ChildGender: string;
  ChildAge: number;
  ChildToys: Toy[];
  HasDisabilities: boolean;

  SchoolName: string;
}

export interface Family {

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
        const families = await getFamilies();
        const familyId = `Family ${families.length + 1}`;
        const familyRef = doc(db, "families", familyId);
        
        await setDoc(familyRef, { family });
        console.log("✅ Success! Document written with ID:", familyId);
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

export async function addChildToy(toy: Toy, familyID: string, childID: string): Promise<void> {
  const familyRef = doc(db, "families", familyID);
  const familyDoc = await getDoc(familyRef);
  const familyData = familyDoc.data()?.family;
  const allChildren = familyData.Children;
  const chosenChild = allChildren.find((child: Child) => child.ChildID === childID);
  const currentToys = chosenChild?.ChildToys || [];
  
  const simplifiedToy = {
    title: toy.title,
    price: toy.price.currency + " " + toy.price.value,
    image: toy.image,
    asin: toy.asin,
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
      "family.Children": updatedChildren
    });
  }
}

export async function removeChildToy(toy: Toy, familyID: string, childID: string): Promise<void> {
  const familyRef = doc(db, "families", familyID);
  const familyDoc = await getDoc(familyRef);
  const familyData = familyDoc.data()?.family;
  const allChildren = familyData.Children;
  const chosenChild = allChildren.find((child: Child) => child.ChildID === childID);
  if (chosenChild) {
    const updatedChildren = allChildren.map((child: Child) => 
      child.ChildID === childID 
        ? { ...child, ChildToys: chosenChild.ChildToys.filter((t: Toy) => t.asin !== toy.asin) }
        : child
    );

    await updateDoc(familyRef, {
      "family.Children": updatedChildren
    });
  }
}

export async function getChildren(familyID: string): Promise<Child[]> {
  const familyRef = doc(db, "families", familyID);
  const familyDoc = await getDoc(familyRef);
  const familyData = familyDoc.data()?.family;
  return familyData.Children;
}

export async function getWishlist(familyID: string, childID: string): Promise<Toy[]> {
  const familyRef = doc(db, "families", familyID);
  const familyDoc = await getDoc(familyRef);
  const familyData = familyDoc.data()?.family;
  const chosenChild = familyData.Children.find((child: Child) => child.ChildID === childID);
  
  return chosenChild?.ChildToys.map((toy: any) => ({
    ...toy,
    price: {
      value: parseFloat(toy.price.split(' ')[1]),
      currency: toy.price.split(' ')[0]
    }
  })) || [];
}
