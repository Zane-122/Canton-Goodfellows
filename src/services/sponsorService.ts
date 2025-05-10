import { collection, addDoc, DocumentReference, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

export interface Sponsor {
  name: string;
  timestamp: Date;
}

export async function addSponsor(name: string): Promise<void> {
  console.log("Starting to add sponsor:", name);
  try {
    console.log("Attempting to add document to Firestore...");
    const sponsorsCollection = collection(db, "sponsors");
    
    const docRef: DocumentReference = await addDoc(sponsorsCollection, {
      name: name,
      timestamp: new Date()
    });
    console.log("✅ Success! Document written with ID:", docRef.id);
  } catch (e) {
    console.error("❌ Error adding document:", e);
  }
}

export async function getSponsors(): Promise<Sponsor[]> {
  const sponsorsCollection = collection(db, "sponsors");
  const querySnapshot = await getDocs(sponsorsCollection);
  return querySnapshot.docs.map(doc => ({
    ...doc.data() as Sponsor,
    timestamp: (doc.data().timestamp as any).toDate()
  }));
} 