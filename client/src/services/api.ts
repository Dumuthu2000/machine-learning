const API_URL = 'http://localhost:8000'; // Replace with your actual API URL

export async function detectDisease(image: File) {
  const formData = new FormData();
  formData.append('file', image);

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to connect to the server');
  }
}