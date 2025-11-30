import { useLocation } from "wouter";

export const API_BASE_URL = "https://gta.mysteryfy.com";

// Helper for headers
const getHeaders = () => {
  const devToken = localStorage.getItem("mysteryfy_dev_token");
  
  if (devToken) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Token ${devToken}`
    };
  }

  const token = localStorage.getItem("mysteryfy_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export interface Adventure {
  id: string;
  slug?: string;
  thumbnail: string;    // Changed from thumbnail_url
  cover_image: string;  // Changed from cover_url
  tags: string[];
  category?: string;
  difficulty?: string;
  duration?: string;
  rating?: number;
  is_premium?: boolean; // We might need to derive this from price
  price: string;        // "0.00" for free
  product_ids?: {
    apple?: string;
    google?: string;
  };
  // Localized fields
  name: {               // Changed from title
    en: string;
    it: string;
  };
  short_description: {
    en: string;
    it: string;
  };
  long_description: {
    en: string;
    it: string;
  };
}

export interface UpdateCheckResponse {
  update_available: boolean;
  update_description?: string;
  size?: string;
  destroy_save_slot?: boolean;
  version?: number;
}

export interface DownloadInfo {
  version: number;
  url: string;
}

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
  adventures: {
    list: async (): Promise<Adventure[]> => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch adventures");
      return res.json();
    },
    get: async (id: string): Promise<Adventure> => {
       const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${id}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to fetch adventure");
      return res.json();
    },
    getPurchased: async (): Promise<string[]> => {
       // Returns array of adventure IDs
       const res = await fetch(`${API_BASE_URL}/api/v1/adventures/purchased/`, {
        headers: getHeaders()
      });
      // If authenticated but empty/error, return empty array
      if (res.status === 401 || !res.ok) return [];
      
      // Assuming the API returns { purchased_adventure_ids: string[] } or similar
      // For now, let's assume it returns a list of purchased items or IDs
      // Adjust based on actual API response structure if known
      const data = await res.json();
      return Array.isArray(data) ? data : (data.purchased_ids || []); 
    },
    checkUpdate: async (id: string, localVersion: number): Promise<UpdateCheckResponse> => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${id}/check-update/${localVersion}/`, {
        headers: getHeaders()
      });
      if (!res.ok) return { update_available: false };
      return res.json();
    },
    getDownloadUrl: async (id: string): Promise<DownloadInfo> => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${id}/download/`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to get download URL");
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
