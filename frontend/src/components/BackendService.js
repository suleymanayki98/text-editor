// BackendService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const loadComponentsFromJson = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-components`);
    return response.data;
  } catch (error) {
    console.error('Error loading components:', error);
    throw error;
  }
};

export const saveComponentsToJson = async (componentsData) => {
  try {
    await axios.post(`${BASE_URL}/save-components`, { components: componentsData });
  } catch (error) {
    throw error;
  }
};

export const loadEmailDataFromJson = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-email-data`);
    return response.data;
  } catch (error) {
    console.error('Error loading email data:', error);
    throw error;
  }
};

export const saveEmailDataToJson = async (emailData) => {
  try {
    await axios.post(`${BASE_URL}/save-email-data`, { emailData });
  } catch (error) {
    console.error('Error saving email data:', error);
    throw error;
  }
};
