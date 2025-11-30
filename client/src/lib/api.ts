import { useLocation } from "wouter";

// Default from specs, but can be overridden
export const API_BASE_URL = localStorage.getItem("mysteryfy_api_url") || "https://gta.mysteryfy.com";

export const setApiUrl = (url: string) => {
  localStorage.setItem("mysteryfy_api_url", url);
  window.location.reload();
};

// Helper for headers
const getHeaders = () => {
  const token = localStorage.getItem("mysteryfy_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    verify: async (idToken: string) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken })
      });
      return res.json();
    }
  },
  stories: {
    getVersion: async (storyId: string, version: string) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${storyId}/check-update/${version}/`, {
        headers: getHeaders()
      });
      return res.json();
    },
    // In a real app, this would handle the zip download/extraction logic
    // For prototype, we just check if we can reach it
    checkDownload: async (storyId: string) => {
        const res = await fetch(`${API_BASE_URL}/stories/${storyId}/download`, {
            method: "HEAD",
            headers: getHeaders()
        });
        return res.ok;
    }
  },
  rooms: {
    create: async (storyId: string) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${storyId}/multiplayer/rooms/`, {
        method: "POST",
        headers: getHeaders()
      });
      return res.json();
    },
    join: async (storyId: string, roomCode: string) => {
      const res = await fetch(`${API_BASE_URL}//api/v1/adventures/${storyId}/multiplayer/rooms/${roomCode}/join/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ roomCode })
      });
      return res.json();
    }
  },
  store: {
    getProducts: async (storyId: string) => {
      const res = await fetch(`${API_BASE_URL}//api/v1/adventures/${storyId}/`, {
        headers: getHeaders()
      });
      return res.json();
    },
    verifyPurchase: async (storyId: string, receipt: string, userId: string, productId: string) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${storyId}/purchase/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receipt, userId, productId })
      });
      return res.json();
    }
  }
};
