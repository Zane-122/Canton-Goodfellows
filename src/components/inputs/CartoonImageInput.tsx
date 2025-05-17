import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import CartoonButton from '../buttons/CartoonButton';

const InputContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1vmin;
`;

const HiddenInput = styled.input`
    display: none;
`;

const ImagePreview = styled.div<{ hasImage: boolean; variant: 'rectangle' | 'square' }>`
    width: ${props => props.variant === 'rectangle' ? '60vmin' : '50vmin'};
    height: ${props => props.hasImage 
        ? (props.variant === 'rectangle' ? '15vmin' : '50vmin')
        : (props.variant === 'rectangle' ? '7.5vmin' : '25vmin')};
    border: 0.3vmin solid black;
    border-radius: 1vmin;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3vmin;
    padding: 1.5vmin;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0.4vmin 0.4vmin 0 0 black;

    &:hover {
        transform: translateY(0.2vmin);
        box-shadow: 0.2vmin 0.2vmin 0 0 black;
    }

    &:active {
        transform: translateY(0.4vmin);
        box-shadow: 0.1vmin 0.1vmin 0 0 black;
    }
`;

const PreviewImage = styled.img`
    width: 12vmin;
    height: 12vmin;
    object-fit: contain;
    background-color: white;
    border: 0.2vmin solid #ddd;
    border-radius: 0.5vmin;
`;

const PlaceholderText = styled.p`
    font-family: 'TT Trick New', serif;
    font-size: 2vmin;
    color: #666;
    text-align: center;
    margin: 0;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1vmin;
    flex: 1;
    align-items: center;
    text-align: center;
`;

const ImageName = styled.p`
    font-family: 'TT Trick New', serif;
    font-size: 2vmin;
    color: #333;
    margin: 0;
    word-break: break-word;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1vmin;
`;

interface CartoonImageInputProps {
    onChange: (file: File | null) => void;
    value?: string;
    placeholder?: string;
    color?: string;
    variant?: 'rectangle' | 'square';
    onEnlarge?: () => void;
    onRemove?: () => void;
}

const CartoonImageInput: React.FC<CartoonImageInputProps> = ({
    onChange,
    value,
    placeholder = "Click to upload an image",
    color = "white",
    variant = 'rectangle',
    onEnlarge,
    onRemove
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
    const [imageName, setImageName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                    setImageName(file.name);
                };
                reader.readAsDataURL(file);
                onChange(file);
            } else {
                alert('Please select an image file');
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <InputContainer>
            <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <ImagePreview hasImage={!!previewUrl} onClick={handleClick} variant={variant}>
                {previewUrl ? (
                    <>
                        <PreviewImage src={previewUrl} alt="Preview" />
                        <TextContainer>
                            <ImageName>{imageName}</ImageName>
                            <ButtonContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <CartoonButton 
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setImageName(null);
                                        onChange(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                        onRemove?.();
                                    }}
                                    color="#CA242B"
                                    style={{ fontSize: '1.8vmin', padding: '0.8vmin 2vmin' }}
                                >
                                    Remove
                                </CartoonButton>
                                {onEnlarge && (
                                    <CartoonButton 
                                        onClick={() => {
                                            onEnlarge();
                                        }}
                                        color="#4A90E2"
                                        style={{ fontSize: '1.8vmin', padding: '0.8vmin 2vmin' }}
                                    >
                                        Enlarge
                                    </CartoonButton>
                                )}
                            </ButtonContainer>
                        </TextContainer>
                    </>
                ) : (
                    <PlaceholderText>{placeholder}</PlaceholderText>
                )}
            </ImagePreview>
        </InputContainer>
    );
};

export default CartoonImageInput; 