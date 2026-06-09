import { app as i, BrowserWindow as d, ipcMain as a, dialog as f } from "electron";
import s from "path";
import r from "fs";
import { fileURLToPath as p } from "url";
const l = s.dirname(p(import.meta.url)), m = process.env.NODE_ENV === "development";
let o;
function c() {
  o = new d({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 18 },
    webPreferences: {
      preload: s.join(l, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), m ? (o.loadURL("http://localhost:5173"), o.webContents.openDevTools()) : o.loadFile(s.join(l, "../dist/index.html")), o.on("closed", () => {
    o = null;
  });
}
i.whenReady().then(() => {
  c(), i.on("activate", () => {
    d.getAllWindows().length === 0 && c();
  });
});
i.on("window-all-closed", () => {
  process.platform !== "darwin" && i.quit();
});
const h = () => {
  const e = s.join(i.getPath("documents"), "AI-Notes");
  return r.existsSync(e) || r.mkdirSync(e, { recursive: !0 }), s.join(e, "notes.json");
};
a.handle("get-notes", async () => {
  const e = h();
  try {
    if (r.existsSync(e)) {
      const t = r.readFileSync(e, "utf-8");
      return JSON.parse(t);
    }
    return { version: "1.0", projects: [] };
  } catch (t) {
    return console.error("Error reading notes:", t), { version: "1.0", projects: [] };
  }
});
a.handle("save-notes", async (e, t) => {
  const n = h();
  try {
    return r.writeFileSync(n, JSON.stringify(t, null, 2), "utf-8"), !0;
  } catch (u) {
    return console.error("Error saving notes:", u), !1;
  }
});
a.handle("export-notes", async (e, t) => {
  const n = await f.showSaveDialog(o, {
    defaultPath: "ai-notes-export.json",
    filters: [{ name: "JSON Files", extensions: ["json"] }]
  });
  return !n.canceled && n.filePath ? (r.writeFileSync(n.filePath, JSON.stringify(t, null, 2), "utf-8"), !0) : !1;
});
a.handle("export-ai-prompt", async (e, t) => {
  const n = await f.showSaveDialog(o, {
    defaultPath: "ai-prompt.txt",
    filters: [{ name: "Text Files", extensions: ["txt"] }]
  });
  return !n.canceled && n.filePath ? (r.writeFileSync(n.filePath, t, "utf-8"), !0) : !1;
});
