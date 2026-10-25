import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// AI Smart Creative Studio Endpoint
app.post("/api/ai/enhance-content", async (req, res) => {
  try {
    const { topic, mediaType, style, audience } = req.body;

    if (!aiClient) {
      // Fallback realistic smart generator if no key is supplied
      return res.json({
        caption: `✨ Dropping this right here! What do you think about ${topic || "this vibe"}? Let me know in the comments 👇`,
        hashtags: ["#LikeTop", "#ForYouPage", "#ViralReels", "#TrendingNow", "#CreatorHub"],
        suggestedFilter: style || "Ultraviolet Neon",
        musicMood: "Phonk Synthwave / 140 BPM",
        hookTip: "Start with an unexpected zoom in the first 0.8 seconds to boost retention by 3.4x",
        viralityScore: 94,
      });
    }

    const prompt = `You are the chief viral strategist and creative director for "LikeTop", a next-generation short-form video platform like TikTok with a sleek vibrant purple and deep navy aesthetic.
A creator is publishing a ${mediaType || "video"} about: "${topic || "lifestyle and creative vlog"}".
Chosen style or aesthetic: "${style || "modern energetic"}".
Target audience: "${audience || "Gen Z & creator community"}".

Generate a JSON response with:
1. "caption": A catchy, viral, high-converting short-form caption with emoji.
2. "hashtags": Array of 5 to 7 trending, high-traffic hashtags (including #LikeTop).
3. "suggestedFilter": The best matching aesthetic visual filter name (e.g., 'Ultraviolet Glow', 'Cyberpunk 2099', 'Prism 4D', 'Vintage 90s Grain', 'HDR Anime').
4. "musicMood": Recommended audio vibe / genre (e.g. 'Drift Phonk', 'Lofi Purple Dreams', 'Hyper-Pop Energy').
5. "hookTip": 1 actionable tip for the first 1.5 seconds to hook viewers and boost algorithm watch-time.
6. "viralityScore": Number between 85 and 99.

Respond strictly in valid JSON format with only these keys.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini AI error:", error);
    return res.json({
      caption: `🔥 ${req.body.topic || "Elevating the feed with LikeTop"}! Double tap if this hit your For You page 💜`,
      hashtags: ["#LikeTop", "#TrendingNow", "#ViralReels", "#AlgorithmBoost", "#FYP"],
      suggestedFilter: "Ultraviolet Neon",
      musicMood: "Cyber Synth Beat",
      hookTip: "Use dynamic text motion on screen in the first second.",
      viralityScore: 92,
    });
  }
});

// AI Script & Storyboard Generator
app.post("/api/ai/generate-script", async (req, res) => {
  try {
    const { idea, tone } = req.body;

    if (!aiClient) {
      return res.json({
        title: idea || "Viral LikeTop Trend",
        scenes: [
          { time: "0-2s", visual: "Immediate hook: quick camera snap with neon rim lighting", speech: "Stop scrolling if you want to know this secret..." },
          { time: "3-8s", visual: "Rapid demonstration with snappy text animations", speech: "Here is the exact method nobody is talking about right now." },
          { time: "9-15s", visual: "Final high-energy payoff and call to share for bonus storage", speech: "Save this and tap share to get your bonus cloud storage! Drop a comment below." },
        ],
        callToAction: "Follow for daily creator secrets & streak bonuses!",
      });
    }

    const prompt = `Create a 15-second viral short-form video script for LikeTop.
Idea: "${idea || "How to grow faster on social media"}".
Tone: "${tone || "Energetic and authentic"}".

Return a JSON object with:
- "title": short snappy title
- "scenes": array of 3 scenes, each with "time", "visual", "speech"
- "callToAction": viral CTA reminding viewers to share to earn bonus cloud storage.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err) {
    return res.json({
      title: "Viral Hook Blueprint",
      scenes: [
        { time: "0-2s", visual: "High contrast hook", speech: "You will not believe what just happened..." },
        { time: "3-10s", visual: "Core content reveal with upbeat soundtrack", speech: "Here is the breakthrough you need to know today." },
        { time: "11-15s", visual: "Engaging outro with LikeTop share badge", speech: "Share this to claim bonus cloud vault storage!" },
      ],
      callToAction: "Follow and share to unlock premium filters!",
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LikeTop server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
