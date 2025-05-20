import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { auth } from './config';

import { functions } from './config';
import { httpsCallable } from 'firebase/functions';

const storage = getStorage();

/**
 * Upload an image to a specific folder in Firebase Storage
 * @param file The image file to upload
 * @param folderPath The path to the folder where the image should be stored
 * @returns The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folderPath: string): Promise<string> => {
    if (!functions) {
        throw new Error('Functions are not initialized');
    }

    console.log("Uploading image to folder:", folderPath);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
            try {
                const base64String = reader.result?.toString().split(',')[1];
                if (!base64String) {
                    reject(new Error('Failed to read file'));
                    return;
                }

                const uploadTask = httpsCallable(functions!, 'uploadImage');
                const result = await uploadTask({ file: base64String, folderPath: folderPath });
                const resultData = result.data;
                console.log(`RESULT DATA: ${resultData}`);
                resolve(resultData as string);
            } catch (error) {
                console.log("Error witht the function")
                console.log({error});
                console.log(`Error uploading image: ${error}`);
                reject(error);
            }
        };

        reader.onerror = () => {
            console.error('Error reading file');
            reject(new Error('Error reading file'));
        };

        // Start reading the file
        reader.readAsDataURL(file);
    });
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