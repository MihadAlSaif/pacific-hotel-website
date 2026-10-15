// Preview build: the real website with sample availability instead of BedSync. Built with esbuild into one HTML page.
import { createRoot } from "react-dom/client";
import { Site } from "@/components/Site";

createRoot(document.getElementById("root")!).render(<Site />);
