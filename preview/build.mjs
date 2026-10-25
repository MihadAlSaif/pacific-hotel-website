// Builds preview/dist/index.html: the website as one self-contained page with sample availability.
// Run after `next build` (it reuses the compiled CSS):  node preview/build.mjs
import { build } from "esbuild";
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const js = await build({
  entryPoints: [root + "preview/entry.tsx"],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  target: "es2020",
  alias: { "@": root + "src" },
  define: { "process.env.NODE_ENV": '"production"', "process.env.NEXT_PUBLIC_DEMO": '"1"', "process.env.NEXT_PUBLIC_BEDSYNC_URL": '""' },
  logLevel: "warning",
});

const cssDir = root + ".next/static/css/";
let css = readdirSync(cssDir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(cssDir + f, "utf8")).join("\n");
css = css.replace(/@font-face\{[^}]*\}/g, (rule) => {
  const m = /url\(\/_next\/static\/media\/([^)]*-latin-\d{3}-normal\.[0-9a-f]+\.woff2)\)/.exec(rule);
  if (!m) return "";
  const b64 = readFileSync(root + ".next/static/media/" + m[1]).toString("base64");
  return rule.replace(/src:[^;}]*/, `src:url(data:font/woff2;base64,${b64}) format("woff2")`);
});

const html = `<title>Pacific Hotel Website</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
<div style="background:#fff4d6;padding:8px max(20px,env(safe-area-inset-left,0px));font:14px system-ui;color:#0f2a3d"><b>Preview.</b> Availability here is sample data; the live site uses BedSync. Some rooms still have placeholder photos.</div>
<div id="root"></div>
<script>${js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script>
`;
mkdirSync(root + "preview/dist", { recursive: true });
writeFileSync(root + "preview/dist/index.html", html);
// Photos sit next to the page, at the same relative paths as on the live site.
cpSync(root + "public", root + "preview/dist", { recursive: true });
console.log(`preview/dist/index.html: ${(html.length / 1024).toFixed(0)} KB`);
