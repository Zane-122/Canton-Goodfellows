import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { auth } from './config';

const storage = getStorage();

/**
 * Generate a meaningful filename for uploaded files
 * @param file The original file
 * @param folderPath The folder path (used to determine file type)
 * @returns A sanitized filename with timestamp
 */
const generateFilename = (file: File, folderPath: string): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    const fileType = folderPath.split('/').pop() || 'document';
    const originalName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const extension = file.name.split('.').pop();
    
    return `${originalName}_${userId}_${timestamp}.${extension}`;
};

/**
 * Upload an image to a specific folder in Firebase Storage
 * @param file The image file to upload
 * @param folderPath The path to the folder where the image should be stored
 * @returns The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folderPath: string): Promise<string> => {
    try {
        // Generate a meaningful filename
        const fileName = generateFilename(file, folderPath);
        
        // Create a reference to the file location
        const storageRef = ref(storage, `${folderPath}/${fileName}`);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

/**
 * List all files in a folder
 * @param folderPath The path to the folder
 * @returns Array of file references
 */
export const listFilesInFolder = async (folderPath: string) => {
    try {
        const folderRef = ref(storage, folderPath);
        const result = await listAll(folderRef);
        return result.items;
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
};

/**
 * Delete a file from Firebase Storage
 * @param filePath The full path to the file
 */
export const deleteFile = async (filePath: string) => {
    try {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

/**
 * Upload multiple images to a folder
 * @param files Array of image files to upload
 * @param folderPath The path to the folder where images should be stored
 * @returns Array of download URLs for the uploaded images
 */
export const uploadMultipleImages = async (files: File[], folderPath: string): Promise<string[]> => {
    try {
        const uploadPromises = files.map(file => uploadImage(file, folderPath));
        const downloadURLs = await Promise.all(uploadPromises);
        return downloadURLs;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
};

/**
 * Get the download URL for a file
 * @param filePath The path to the file
 * @returns The download URL
 */
export const getFileDownloadURL = async (filePath: string): Promise<string> => {
    try {
        const fileRef = ref(storage, filePath);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Error getting download URL:', error);
        throw error;
    }
}; 