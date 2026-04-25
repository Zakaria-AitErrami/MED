import { writeFileSync } from "node:fs";

const config = {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  doctor: {
    email: process.env.DOCTOR_EMAIL || "medecin@mici.local",
    password: process.env.DOCTOR_PASSWORD || "demo1234",
  },
  showDemoHelpers: process.env.SHOW_DEMO_HELPERS === "true",
};

writeFileSync(
  "config.js",
  `window.MICI_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
  "utf8",
);

console.log("Generated config.js for deployment.");
