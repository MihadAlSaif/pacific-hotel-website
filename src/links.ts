import { slugOf } from "./site";

/**
 * The live site has a page per room (/rooms/king-room-with-sea-view/). The one-file preview
 * can't have separate pages, so it switches views with #room-… links instead.
 */
const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

/** A file from public/, e.g. asset("rooms/king-sea-view/1.jpg"). */
export const asset = (path: string) => (DEMO ? path : `/${path}`);
export const roomHref = (name: string) => (DEMO ? `#room-${slugOf(name)}` : `/rooms/${slugOf(name)}/`);
/** A section of the home page, e.g. homeHref("rooms"). */
export const homeHref = (section = "top") => (DEMO ? `#${section}` : `/#${section}`);
