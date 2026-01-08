/**
 * Image upload utility - works without backend
 * Uses Imgur API (free, no authentication needed for anonymous uploads)
 */

const IMGUR_CLIENT_ID = '546c25a59c58ad7'; // Public Imgur client ID (safe to use in frontend)

export async function uploadImageToImgur(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: formData,
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Imgur upload failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data && data.data.link) {
      return data.data.link;
    } else {
      throw new Error('Invalid response from Imgur');
    }
  } catch (error) {
    console.error('Imgur upload error:', error);
    // Fallback: return data URL (works for all cases)
    console.warn('Using fallback data URL for image instead of Imgur');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imageFile);
    });
  }
}

/**
 * Convert image file to base64 data URL
 * Useful as a fallback if Imgur fails
 */
export function imageToDataURL(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
}

