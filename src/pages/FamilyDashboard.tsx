import { useEffect, useState } from "react";
import CartoonButton from "../components/buttons/CartoonButton";
import CartoonContainer from "../components/containers/CartoonContainer";
import CartoonInput from "../components/inputs/CartoonInput";
import { ContentContainer, InputGroup, Label, PageContainer, FormContainer } from "./SponsorDashboard";
import CartoonHeader from "../components/headers/CartoonHeader";

const FamilyDashboard = () => {
    const BasicInfoForm: React.FC = () => {
        const [sponsorName, setSponsorName] = useState("");
        const [sponsorEmail, setSponsorEmail] = useState("");
        const [sponsorPhone, setSponsorPhone] = useState("");
        const [isSaving, setIsSaving] = useState(false);
        const [saveMessage, setSaveMessage] = useState("-");
        const [loadingAccountInfo, setLoadingAccountInfo] = useState(true);

        const validateEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
    
        const formatPhoneNumber = (value: string) => {
            const phoneNumber = value.replace(/\D/g, '');
            if (phoneNumber.length === 0) return '';
            if (phoneNumber.length < 3) return `(${phoneNumber}`;
            if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        };
    
        const handlePhoneChange = (value: string) => {
            const formatted = formatPhoneNumber(value);
            setSponsorPhone(formatted);
        };
    
        const validatePhone = (phone: string) => {
            const phoneNumber = phone.replace(/\D/g, '');
            return phoneNumber.length === 10;
        };
    
        useEffect(() => {
            
        }, []);
    
        const handleSave = async () => {
            
        };
    
        return (
            <PageContainer>
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
                                <Label>Name</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What's your name?"
                                    onChange={(e) => setSponsorName(e)}
                                    value={loadingAccountInfo ? "Loading..." : sponsorName}
                                />
                            </InputGroup>
    
                            <InputGroup>
                                <Label>Email</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="What's your email?"
                                    onChange={(e) => setSponsorEmail(e)}
                                    value={loadingAccountInfo ? "Loading..." : sponsorEmail}
                                />
                            </InputGroup>
    
                            <InputGroup>
                                <Label>Phone Number</Label>
                                <CartoonInput
                                    color={loadingAccountInfo ? "gray" : "white"}
                                    placeholder="(123) 456-7890"
                                    onChange={(e) => handlePhoneChange(e)}
                                    value={loadingAccountInfo ? "Loading..." : sponsorPhone}
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
                                fontSize: '2vmin'
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
            </PageContainer>
        );
    };
    return (
        <div>
            <h1>Family Dashboard</h1>
        </div>
    );
};

export default FamilyDashboard;