import { HOTEL } from "@/site";

export default function NotFound() {
  return (
    <main className="gutter grid min-h-dvh place-items-center text-center">
      <div className="grid gap-4">
        <h1 className="text-5xl">Page not found</h1>
        <p className="text-drift">That page isn't here. The rooms and booking form are on the home page.</p>
        <a href="/" className="btn justify-self-center">Go to {HOTEL.name}</a>
      </div>
    </main>
  );
}
