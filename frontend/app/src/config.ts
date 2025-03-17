const getEnvVar = (key: string, defaultValue?: string): string => {
    return process.env[key] || defaultValue || "";
  };
  
  export const API_URL = getEnvVar("REACT_APP_API_URL", "http://localhost:5000");
  