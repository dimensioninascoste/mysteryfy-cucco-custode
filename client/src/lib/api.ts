import { useLocation } from "wouter";

// Updated with the real backend URL provided by the user
export const API_BASE_URL = "https://gta.mysteryfy.com";

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
      const res = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken })
      });
      return res.json();
    }
  },
  stories: {
    getVersion: async (storyId: string) => {
      const res = await fetch(`${API_BASE_URL}/stories/${storyId}/version.json`, {
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
    create: async () => {
      const res = await fetch(`${API_BASE_URL}/rooms/create`, {
        method: "POST",
        headers: getHeaders()
      });
      return res.json();
    },
    join: async (roomCode: string) => {
      const res = await fetch(`${API_BASE_URL}/rooms/join`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ roomCode })
      });
      return res.json();
    }
  },
  store: {
    getProducts: async (storyId: string) => {
      const res = await fetch(`${API_BASE_URL}/store/products/${storyId}`, {
        headers: getHeaders()
      });
      return res.json();
    },
    verifyPurchase: async (receipt: string, userId: string, productId: string) => {
      const res = await fetch(`${API_BASE_URL}/purchases/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receipt, userId, productId })
      });
      return res.json();
    }
  }
};
