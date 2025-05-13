import { collection, addDoc, DocumentReference, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { AuthError } from './auth';

export interface Sponsor {
    name: string;
    email: string;
    contact_number: string;

    child_sponsored: string;
    timestamp: Date;
}

export async function addSponsor(): Promise<DocumentReference> {
    try {
        console.log('Attempting to add document to Firestore...');
        const sponsorsCollection = collection(db, 'sponsors');

        const docRef: DocumentReference = await addDoc(sponsorsCollection, {name: "test"});
        console.log('✅ Success! Document written with ID:', docRef.id);

        return docRef;
    } catch (e) {
        console.error('❌ Error adding document:', e);

        throw e
    }
}

export async function setSponsorInfo(sponsor: Sponsor): Promise<void> {
    const id = await getSponsorDocId();
    const sponsorRef = doc(db, 'sponsors', id);
    await setDoc(sponsorRef, sponsor);
}

export async function getSponsorDocId(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
        throw new AuthError('No user is signed in.', 'no-user-signed-in');
    }
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const sponsorDocId = userDoc.data()?.sponsor.sponsorDocId;
    return sponsorDocId;
}

export async function getSponsors(): Promise<Sponsor[]> {
    const sponsorsCollection = collection(db, 'sponsors');
    const querySnapshot = await getDocs(sponsorsCollection);
    return querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Sponsor),
        timestamp: (doc.data().timestamp as any).toDate(),
    }));
}
