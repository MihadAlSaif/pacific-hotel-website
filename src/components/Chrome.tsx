import { homeHref } from "@/links";
import { HOTEL } from "@/site";

/** Top bar shared by the home page and room pages. */
export function Header({ onHome }: { onHome?: boolean }) {
  const link = (section: string) => (onHome ? `#${section}` : homeHref(section));
  return (
    <header className="gutter sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-shore bg-chalk/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3" aria-label="Main">
        <a href={link("top")} className="font-display text-xl">{HOTEL.name}</a>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.95rem]">
          <a href={link("rooms")} className="hover:underline">Rooms</a>
          <a href={link("stay")} className="hover:underline">Your stay</a>
          <a href={link("find-us")} className="hover:underline">Find us</a>
          <a href={link("contact")} className="hover:underline">Contact</a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="gutter bg-sea text-white/85">
      <div className="mx-auto grid max-w-[1120px] gap-4 py-10 text-sm sm:grid-cols-[1fr_1.4fr]">
        <p><span className="font-display text-lg text-white">{HOTEL.name}</span><br />{HOTEL.street}, {HOTEL.town} {HOTEL.postcode}</p>
        <p className="max-w-[60ch]">Details you send through this website are used only to answer your request. © {year} {HOTEL.name}.</p>
      </div>
    </footer>
  );
}
