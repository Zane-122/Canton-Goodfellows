import { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/contexts/AuthContext';
import { functions } from '../../firebase/config';
import CartoonButton from '../../components/buttons/CartoonButton';
import CartoonContainer from '../../components/containers/CartoonContainer';
import CartoonInput from '../../components/inputs/CartoonInput';
import CartoonHeader from '../../components/headers/CartoonHeader';
import { ContentContainer, InputGroup, Label, FormContainer } from '../SponsorDashboard';
import { httpsCallable } from 'firebase/functions';

export const BasicInfoForm: React.FC = () => {
    const [parent1Name, setParent1Name] = useState("");
    const [parent2Name, setParent2Name] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState("-");

    const {user} = useAuth();

    interface FamilyInfo {
        Parent1Name: string;
        Parent2Name: string;
        PhoneNumber: string;
        StreetAddress: string;
        ZipCode: string;
    }
    const getFamilyInfo = async () => {
        if (!functions) return;
        setIsLoading(true);
        try {
            const getFamilyInfo = httpsCallable(functions, 'getFamilyInfo');
            const result = await getFamilyInfo({uid: user?.uid});
            const familyInfo: FamilyInfo = result.data as FamilyInfo;
            
            setParent1Name(familyInfo.Parent1Name as string);
            setParent2Name(familyInfo.Parent2Name as string);
            setPhoneNumber(familyInfo.PhoneNumber as string);
            setAddress(familyInfo.StreetAddress as string);
            setZipCode(familyInfo.ZipCode as string);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Updated state values:", {
            parent1Name,
            parent2Name,
            phoneNumber,
            address,
            zipCode
        });
    }, [parent1Name, parent2Name, phoneNumber, address, zipCode]);

    useEffect(() => {
        getFamilyInfo();
    }, [user]);

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
        
        if (!user) return;
        if (!functions) return;

        setIsLoading(true);

        try {
            const setFamilyInfo = httpsCallable(functions, 'setFamilyInfo');
            const familyInfo: FamilyInfo = {
                Parent1Name: parent1Name,
                Parent2Name: parent2Name,
                PhoneNumber: phoneNumber,
                StreetAddress: address,
                ZipCode: zipCode,
            };

            const result = await setFamilyInfo({
                familyInfo: familyInfo,
                uid: user.uid,
            });

            console.log(result.data);
            setSaveMessage("Information was saved successfully!");
            setTimeout(() => {
                setSaveMessage("-");
            }, 2000);
            getFamilyInfo();
        } catch (error) {
            console.error(error);
            setSaveMessage("Error saving information");
        } finally {
            setIsLoading(false);
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
                                color={"white"}
                                placeholder={isLoading ? "Loading..." : "What is Parent 1's name?"}
                                onChange={(e) => {
                                    setParent1Name(e);
                                }}
                                value={parent1Name}
                                loading={isLoading}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Parent 2 Name</Label>
                            <CartoonInput
                                color={"white"}
                                placeholder={isLoading ? "Loading..." : "What is Parent 2's name?"}
                                onChange={(e) => {
                                    setParent2Name(e);
                                }}
                                value={parent2Name}
                                loading={isLoading}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label>Input a contact number</Label>
                            <CartoonInput
                                color={"white"}
                                placeholder={isLoading ? "Loading..." : "What is your phone number?"}
                                onChange={(e) => {
                                   handlePhoneChange(e);
                                }}
                                value={phoneNumber}
                                loading={isLoading}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Input a street address</Label>
                            <CartoonInput
                                color={"white"}
                                placeholder={isLoading ? "Loading..." : "What is your street address?"}
                                onChange={(e) => {
                                    setAddress(e);
                                }}
                                value={address}
                                loading={isLoading}
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>Input a zip code</Label>
                            <CartoonInput
                                color={"white"}
                                placeholder={isLoading ? "Loading..." : "What is your zip code?"}
                                onChange={(e) => {
                                    setZipCode(e);
                                }}
                                value={zipCode}
                                loading={isLoading}
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
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Information"}
                        </CartoonButton>
                    </CartoonContainer>
                </FormContainer>
            </ContentContainer>
            </div>
    );
};