import { useLocation } from "wouter";

// Use relative URL to hit our own backend proxy
export const API_BASE_URL = "";

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
  thumbnail: string;
  cover_image: string;
  tags: string[];
  category?: string;
  difficulty?: string;
  duration?: string;
  rating?: number;
  is_premium?: boolean;
  price: string;
  product_ids?: {
    apple?: string;
    google?: string;
  };
  name: {
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
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken })
      });
      return res.json();
    }
  },
  adventures: {
    list: async (): Promise<Adventure[]> => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures`, {
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
       const res = await fetch(`${API_BASE_URL}/api/v1/adventures/purchased`, {
        headers: getHeaders()
      });
      if (res.status === 401 || !res.ok) return [];
      
      const data = await res.json();
      return Array.isArray(data) ? data : (data.purchased_ids || []); 
    },
    checkUpdate: async (id: string, localVersion: number): Promise<UpdateCheckResponse> => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${id}/check-update/${localVersion}`, {
        headers: getHeaders()
      });
      if (!res.ok) return { update_available: false };
      return res.json();
    },
    getDownloadUrl: async (id: string): Promise<DownloadInfo> => {
      const res = await fetch(`${API_BASE_URL}/api/v1/adventures/${id}/download`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to get download URL");
      return res.json();
    }
  },
  stories: {
    getVersion: async (storyId: string) => {
      const res = await fetch(`https://gta.mysteryfy.com/stories/${storyId}/version.json`, {
        headers: getHeaders()
      });
      return res.json();
    },
    checkDownload: async (storyId: string) => {
        const res = await fetch(`https://gta.mysteryfy.com/stories/${storyId}/download`, {
            method: "HEAD",
            headers: getHeaders()
        });
        return res.ok;
    }
  },
  rooms: {
    create: async () => {
      const res = await fetch(`${API_BASE_URL}/api/rooms/create`, {
        method: "POST",
        headers: getHeaders()
      });
      return res.json();
    },
    join: async (roomCode: string) => {
      const res = await fetch(`${API_BASE_URL}/api/rooms/join`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ roomCode })
      });
      return res.json();
    }
  },
  store: {
    getProducts: async (storyId: string) => {
      const res = await fetch(`${API_BASE_URL}/api/store/products/${storyId}`, {
        headers: getHeaders()
      });
      return res.json();
    },
    verifyPurchase: async (receipt: string, userId: string, productId: string) => {
      const res = await fetch(`${API_BASE_URL}/api/purchases/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receipt, userId, productId })
      });
      return res.json();
    }
  }
};
