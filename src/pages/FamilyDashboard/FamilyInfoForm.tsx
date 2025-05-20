import { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { setFamilyInfo } from '../../firebase/families';
import CartoonButton from '../../components/buttons/CartoonButton';
import CartoonContainer from '../../components/containers/CartoonContainer';
import CartoonInput from '../../components/inputs/CartoonInput';
import CartoonHeader from '../../components/headers/CartoonHeader';
import { ContentContainer, InputGroup, Label, FormContainer } from '../SponsorDashboard';

export const BasicInfoForm: React.FC = () => {
    const [parent1Name, setParent1Name] = useState("");
    const [parent2Name, setParent2Name] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("-");

    const [loadingAccountInfo, setLoadingAccountInfo] = useState(true);
    const {user} = useAuth();
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/\D/g, '');
        if (phoneNumber.length === 0) return '';
        if (phoneNumber.length <= 3) return `(${phoneNumber}`;
        if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setPhoneNumber(formatted);
    };

    const validatePhone = (phone: string) => {
        const phoneNumber = phone.replace(/\D/g, '');
        return phoneNumber.length === 10;
    };
    const getFamilyInfo = async () => {
        setLoadingAccountInfo(true);
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
                setParent1Name(familyData?.family.Parent1Name);
                console.log(familyData);
                console.log(familyData?.family.Parent1Name);
                setParent2Name(familyData?.family.Parent2Name);
                setPhoneNumber(familyData?.family.PhoneNumber);
                setAddress(familyData?.family.StreetAddress);
                setZipCode(familyData?.family.ZipCode);
                console.log("It works");
            }
        }
        setLoadingAccountInfo(false);
    };
    useEffect(() => {
        
        try {
            getFamilyInfo();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAccountInfo(false);
            console.log("Loading account info is false");
        }
    }, [user]);

    const handleSave = async () => {
        if (parent1Name.length < 3) {
            setSaveMessage("Please enter a name with at least 3 characters");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (parent2Name.length < 3) {
            setSaveMessage("Please enter a name with at least 3 characters");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (!validatePhone(phoneNumber)) {
            setSaveMessage("Please enter a valid 10-digit phone number");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (address.length < 3) {
            setSaveMessage("Please enter a street address with at least 5 characters");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (!address.includes(" ")) {
            setSaveMessage("Please enter a street address with a street name and number");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (zipCode.length !== 5) {
            setSaveMessage("Please enter a valid 5-digit zip code");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (!parent1Name.includes(" ")) {
            setSaveMessage("Please enter a first and last name for Parent 1");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);

            return;
        }
        if (!parent2Name.includes(" ")) {
            setSaveMessage("Please enter a first and last name for Parent 2");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);
            
            return;
        }
        
        setIsSaving(true);
        setLoadingAccountInfo(true);
        try {
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
                    setParent1Name(familyData?.family.Parent1Name);
                    console.log(familyData);
                    console.log(familyData?.family.Parent1Name);
                    await setFamilyInfo({
                        Children: familyData?.family.Children,
                        Parent1Name: parent1Name,
                        Parent2Name: parent2Name,
                        PhoneNumber: phoneNumber,
                        StreetAddress: address,
                        ZipCode: zipCode,
                        timestamp: new Date(),
                        Verified: false,
                    });
                    setSaveMessage("Information saved successfully!");
                    setTimeout(() => {
                        setSaveMessage("-");
                    }, 2000);
                    console.log("It works");
                    getFamilyInfo();
                }
            }
        } catch (error) {
            console.error(error);
            setSaveMessage("Error saving information");
        } finally {
            setIsSaving(false);
            setLoadingAccountInfo(false);
        }
    };

    return (
        <div>
            <ContentContainer>
                <FormContainer>
                    <CartoonHeader
                        title="Basic Information"
                        subtitle="Please fill out the following information!"
                    />
                    <CartoonContainer style={{
                        padding: '2vmin',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2vmin',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <InputGroup>
                            <Label>Parent 1 Name</Label>
                            <CartoonInput
                                color={loadingAccountInfo ? "gray" : "white"}
                                placeholder="What is Parent 1's name?"
                                onChange={(e) => {
                                    setParent1Name(e);
                                }}
                                value={loadingAccountInfo ? "Loading..." : parent1Name}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Parent 2 Name</Label>
                            <CartoonInput
                                color={loadingAccountInfo ? "gray" : "white"}
                                placeholder="What is Parent 2's name?"
                                onChange={(e) => {
                                    setParent2Name(e);
                                }}
                                value={loadingAccountInfo ? "Loading..." : parent2Name}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Input a contact number</Label>
                            <CartoonInput
                                color={loadingAccountInfo ? "gray" : "white"}
                                placeholder="What is your phone number?"
                                onChange={(e) => {
                                   handlePhoneChange(e);
                                }}
                                value={loadingAccountInfo ? "Loading..." : phoneNumber}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Input a street address</Label>
                            <CartoonInput
                                color={loadingAccountInfo ? "gray" : "white"}
                                placeholder="What is your street address?"
                                onChange={(e) => {
                                    setAddress(e);
                                }}
                                value={loadingAccountInfo ? "Loading..." : address}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Input a zip code</Label>
                            <CartoonInput
                                color={loadingAccountInfo ? "gray" : "white"}
                                placeholder="What is your zip code?"
                                onChange={(e) => {
                                    setZipCode(e);
                                }}
                                value={loadingAccountInfo ? "Loading..." : zipCode}
                            />
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
                        <CartoonButton
                            color="#1EC9F2"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Information"}
                        </CartoonButton>
                    </CartoonContainer>
                </FormContainer>
            </ContentContainer>
            </div>
    );
};