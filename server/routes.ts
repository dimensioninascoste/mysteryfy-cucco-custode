import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const MYSTERYFY_API_BASE = "https://gta.mysteryfy.com";

// Helper to forward requests to Mysteryfy API
async function proxyToMysteryfy(path: string, token?: string, method = "GET", body?: any) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    // Check if it's a dev token or regular token
    if (token.startsWith("Token ")) {
      headers["Authorization"] = token;
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${MYSTERYFY_API_BASE}${path}`, options);
  
  if (!response.ok) {
    throw new Error(`Mysteryfy API error: ${response.status}`);
  }

  return response.json();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Middleware to extract token from request
  const extractToken = (req: any) => {
    const authHeader = req.headers.authorization;
    return authHeader || undefined;
  };

  // GET /api/v1/adventures - List all adventures
  app.get("/api/v1/adventures", async (req, res) => {
    try {
      const token = extractToken(req);
      const adventures = await proxyToMysteryfy("/api/v1/adventures/", token);
      res.json(adventures);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/adventures/:id - Get single adventure
  app.get("/api/v1/adventures/:id", async (req, res) => {
    try {
      const token = extractToken(req);
      const adventure = await proxyToMysteryfy(`/api/v1/adventures/${req.params.id}`, token);
      res.json(adventure);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/v1/adventures/purchased - Get purchased adventures
  app.get("/api/v1/adventures/purchased", async (req, res) => {
    try {
      const token = extractToken(req);
      
      if (!token) {
        return res.json([]);
      }

      const purchased = await proxyToMysteryfy("/api/v1/adventures/purchased/", token);
      res.json(purchased);
    } catch (error: any) {
      // If not authenticated or error, return empty array
      res.json([]);
    }
  });

  // GET /api/v1/adventures/:id/check-update/:version - Check for updates
  app.get("/api/v1/adventures/:id/check-update/:version", async (req, res) => {
    try {
      const token = extractToken(req);
      const { id, version } = req.params;
      
      const updateInfo = await proxyToMysteryfy(
        `/api/v1/adventures/${id}/check-update/${version}/`,
        token
      );
      
      res.json(updateInfo);
    } catch (error: any) {
      // If check fails, assume no update available
      res.json({ update_available: false });
    }
  });

  // GET /api/v1/adventures/:id/download - Get download URL
  app.get("/api/v1/adventures/:id/download", async (req, res) => {
    try {
      const token = extractToken(req);
      const downloadInfo = await proxyToMysteryfy(
        `/api/v1/adventures/${req.params.id}/download/`,
        token
      );
      
      res.json(downloadInfo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/auth/verify - Verify authentication token
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
      const result = await proxyToMysteryfy("/auth/verify", undefined, "POST", { token });
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  // POST /api/rooms/create - Create multiplayer room
  app.post("/api/rooms/create", async (req, res) => {
    try {
      const token = extractToken(req);
      const room = await proxyToMysteryfy("/rooms/create", token, "POST");
      res.json(room);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/rooms/join - Join multiplayer room
  app.post("/api/rooms/join", async (req, res) => {
    try {
      const token = extractToken(req);
      const { roomCode } = req.body;
      const result = await proxyToMysteryfy("/rooms/join", token, "POST", { roomCode });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/store/products/:storyId - Get store products
  app.get("/api/store/products/:storyId", async (req, res) => {
    try {
      const token = extractToken(req);
      const products = await proxyToMysteryfy(`/store/products/${req.params.storyId}`, token);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/purchases/verify - Verify purchase
  app.post("/api/purchases/verify", async (req, res) => {
    try {
      const token = extractToken(req);
      const result = await proxyToMysteryfy("/purchases/verify", token, "POST", req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
