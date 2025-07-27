// API Configuration for different environments
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

// Smart API URL detection for port forwarding
function detectApiUrl(): string {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    console.log(`🔧 Using explicit API URL: ${import.meta.env.VITE_API_URL}`);
    return import.meta.env.VITE_API_URL;
  }
  
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const currentPort = window.location.port;
  
  console.log(`🌐 Current location: ${currentProtocol}//${currentHost}:${currentPort}`);
  console.log(`🔍 Forwarding type detection: ${currentHost.includes('devtunnels.ms') ? 'Cursor Dev Tunnel' : 'Other'}`);
  
  // Local development
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    const localUrl = 'http://localhost:3001/api';
    console.log(`🏠 Local development detected, using: ${localUrl}`);
    return localUrl;
  }
  
  // Cursor Dev Tunnels (devtunnels.ms) - both private and public
  if (currentHost.includes('devtunnels.ms')) {
    // Pattern: vkgx2916-5173.asse.devtunnels.ms -> vkgx2916-3001.asse.devtunnels.ms
    const hostParts = currentHost.split('.');
    if (hostParts.length >= 3) {
      const portPart = hostParts[0];
      // Try different patterns for port replacement
      let newPortPart = portPart;
      
      // Pattern 1: Replace 5173 with 3001
      if (portPart.includes('5173')) {
        newPortPart = portPart.replace('5173', '3001');
      }
      // Pattern 2: Replace last number with 3001
      else if (portPart.match(/\d+$/)) {
        newPortPart = portPart.replace(/\d+$/, '3001');
      }
      // Pattern 3: Add -3001 suffix
      else {
        newPortPart = `${portPart}-3001`;
      }
      
      const backendHost = [newPortPart, ...hostParts.slice(1)].join('.');
      const backendUrl = `${currentProtocol}//${backendHost}/api`;
      console.log(`🔗 Cursor Dev Tunnel detected, using: ${backendUrl}`);
      console.log(`📡 Forwarding type: ${currentHost.includes('public') ? 'Public' : 'Private'}`);
      return backendUrl;
    }
  }
  
  // Ngrok tunnels
  if (currentHost.includes('ngrok')) {
    // For ngrok, the backend is typically on a different subdomain
    // Try replacing the port in the hostname
    const backendUrl = `${currentProtocol}//${currentHost.replace('5173', '3001')}/api`;
    console.log(`🔗 Ngrok tunnel detected, using: ${backendUrl}`);
    return backendUrl;
  }
  
  // Localtunnel
  if (currentHost.includes('loca.lt')) {
    console.log(`🔗 Localtunnel detected: ${currentHost}`);
    console.log(`⚠️ Localtunnel doesn't support automatic backend URL detection`);
    console.log(`💡 Please set VITE_API_URL environment variable or use the API Debugger`);
    console.log(`⚠️ Falling back to localhost - you may need to set VITE_API_URL manually`);
    return 'http://localhost:3001/api';
  }
  
  // Cloudflare Tunnel
  if (currentHost.includes('tunnel.local')) {
    const backendUrl = `${currentProtocol}//${currentHost.replace('5173', '3001')}/api`;
    console.log(`🔗 Cloudflare tunnel detected, using: ${backendUrl}`);
    return backendUrl;
  }
  
  // Custom domain or unknown forwarding
  console.log(`⚠️ Unknown forwarding domain: ${currentHost}`);
  console.log(`⚠️ Falling back to localhost - you may need to set VITE_API_URL manually`);
  return 'http://localhost:3001/api';
}

// API Configuration
export const apiConfig: ApiConfig = {
  baseUrl: detectApiUrl(),
  timeout: 10000, // 10 seconds
  retries: 3
};

// Helper function to get the current API URL (useful for debugging)
export function getCurrentApiUrl(): string {
  return apiConfig.baseUrl;
}

// Helper function to update API URL manually (useful for debugging)
export function updateApiUrl(newUrl: string): void {
  apiConfig.baseUrl = newUrl;
  console.log(`🔧 API URL updated to: ${newUrl}`);
}

// Export the base URL for direct use
export const API_BASE_URL = apiConfig.baseUrl; 