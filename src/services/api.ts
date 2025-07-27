import { Subject } from '../types';
import { API_BASE_URL, getCurrentApiUrl, updateApiUrl } from '../config/api';

// Logging utility
const logApiCall = (method: string, endpoint: string, data?: any) => {
  console.log(`🔗 API Call: ${method} ${API_BASE_URL}${endpoint}`);
  if (data) {
    console.log(`📤 Request Data:`, data);
  }
};

const logApiResponse = (method: string, endpoint: string, status: number, data?: any) => {
  console.log(`✅ API Response: ${method} ${endpoint} - Status: ${status}`);
  if (data) {
    console.log(`📥 Response Data:`, data);
  }
};

const logApiError = (method: string, endpoint: string, error: any) => {
  console.error(`❌ API Error: ${method} ${endpoint}`);
  console.error(`🔍 Error Details:`, error);
  console.error(`🌐 API Base URL: ${API_BASE_URL}`);
  console.error(`📡 Full URL: ${API_BASE_URL}${endpoint}`);
};

export class ApiService {
  static async getSubjects(): Promise<Subject[]> {
    const endpoint = '/subjects';
    logApiCall('GET', endpoint);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      logApiResponse('GET', endpoint, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      logApiResponse('GET', endpoint, response.status, data);
      return data;
    } catch (error) {
      logApiError('GET', endpoint, error);
      throw error;
    }
  }

  static async createSubject(subject: Subject): Promise<void> {
    const endpoint = '/subjects';
    logApiCall('POST', endpoint, subject);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subject),
      });
      
      logApiResponse('POST', endpoint, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      logApiResponse('POST', endpoint, response.status, data);
    } catch (error) {
      logApiError('POST', endpoint, error);
      throw error;
    }
  }

  static async updateSubject(subject: Subject): Promise<void> {
    const endpoint = `/subjects/${subject.id}`;
    logApiCall('PUT', endpoint, subject);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subject),
      });
      
      logApiResponse('PUT', endpoint, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      logApiResponse('PUT', endpoint, response.status, data);
    } catch (error) {
      logApiError('PUT', endpoint, error);
      throw error;
    }
  }

  static async deleteSubject(subjectId: string): Promise<void> {
    const endpoint = `/subjects/${subjectId}`;
    logApiCall('DELETE', endpoint);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      
      logApiResponse('DELETE', endpoint, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error Response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      logApiResponse('DELETE', endpoint, response.status, data);
    } catch (error) {
      logApiError('DELETE', endpoint, error);
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    const endpoint = '/health';
    logApiCall('GET', endpoint);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      logApiResponse('GET', endpoint, response.status);
      
      if (response.ok) {
        const data = await response.json();
        logApiResponse('GET', endpoint, response.status, data);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`❌ Health Check Failed: ${errorText}`);
        return false;
      }
    } catch (error) {
      logApiError('GET', endpoint, error);
      return false;
    }
  }
} 