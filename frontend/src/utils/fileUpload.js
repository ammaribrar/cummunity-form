import api from './api';
import { v4 as uuidv4 } from 'uuid';

/**
 * Validates a file against size and type constraints
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in MB
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @returns {Object} Validation result with success and message
 */
const validateFile = (file, options = {}) => {
  const defaultOptions = {
    maxSize: 5, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  };
  
  const { maxSize, allowedTypes } = { ...defaultOptions, ...options };
  const maxSizeInBytes = maxSize * 1024 * 1024; // Convert MB to bytes
  
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      message: `File is too large. Maximum size is ${maxSize}MB.`,
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  
  return { isValid: true };
};

/**
 * Compresses an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.quality - Image quality (0-1)
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @returns {Promise<File>} Compressed image file
 */
const compressImage = (file, options = {}) => {
  const defaultOptions = {
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
  };
  
  const { quality, maxWidth, maxHeight } = { ...defaultOptions, ...options };
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Create a canvas to draw the compressed image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Create a new File object with the compressed image
            const compressedFile = new File(
              [blob],
              file.name,
              { type: file.type, lastModified: Date.now() }
            );
            
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a file to the server
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @param {string} options.path - The server path to upload to (e.g., 'avatars', 'posts')
 * @param {boolean} options.compress - Whether to compress images before upload
 * @returns {Promise<Object>} The server response
 */
export const uploadFile = async (file, options = {}) => {
  const defaultOptions = {
    path: 'uploads',
    compress: true,
  };
  
  const { path, compress, ...uploadOptions } = { ...defaultOptions, ...options };
  
  try {
    // Validate the file
    const validation = validateFile(file, uploadOptions);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }
    
    let fileToUpload = file;
    
    // Compress image if enabled and file is an image
    if (compress && file.type.startsWith('image/')) {
      fileToUpload = await compressImage(file, uploadOptions);
    }
    
    // Create form data
    const formData = new FormData();
    const uniqueFilename = `${uuidv4()}-${file.name}`;
    formData.append('file', fileToUpload, uniqueFilename);
    
    // Add any additional data
    if (uploadOptions.additionalData) {
      Object.entries(uploadOptions.additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    
    // Upload the file
    const response = await api.post(`/upload/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Converts a file to a data URL
 * @param {File} file - The file to convert
 * @returns {Promise<string>} The data URL
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Gets the file extension from a filename or URL
 * @param {string} filename - The filename or URL
 * @returns {string} The file extension (without the dot)
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  
  // Handle URLs with query parameters
  const urlParts = filename.split(/[?#]/)[0].split('/');
  const lastPart = urlParts[urlParts.length - 1];
  
  // Split on the last dot
  const parts = lastPart.split('.');
  if (parts.length === 1) return ''; // No extension
  
  return parts.pop().toLowerCase();
};

/**
 * Gets the MIME type from a file extension
 * @param {string} extension - The file extension (with or without dot)
 * @returns {string} The MIME type
 */
export const getMimeType = (extension) => {
  if (!extension) return 'application/octet-stream';
  
  // Remove leading dot if present
  const ext = extension.startsWith('.') ? extension.slice(1) : extension;
  
  const mimeTypes = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    txt: 'text/plain',
    csv: 'text/csv',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    
    // Code
    js: 'application/javascript',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    
    // Video
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
  };
  
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Re-export for convenience
export default {
  validateFile,
  compressImage,
  uploadFile,
  fileToDataUrl,
  getFileExtension,
  getMimeType,
  formatFileSize,
};
