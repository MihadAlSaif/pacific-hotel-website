/**
 * Everything about the hotel that the website shows. Edit here to change wording, links or rooms.
 * Room names must match the names in BedSync exactly, so live availability lines up.
 */
export const HOTEL = {
  name: "Pacific Hotel",
  street: "7-9 Marine Parade East",
  town: "Clacton-on-Sea",
  postcode: "CO15 1PS",
  /** Leave empty until the hotel confirms them; empty values are hidden on the page. */
  phone: "",
  email: "",
  checkIn: "15:00 to 22:00",
  checkOut: "by 11:00",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pacific+Hotel+7-9+Marine+Parade+East+Clacton-on-Sea+CO15+1PS",
  /** The hotel's own Booking.com page. Check this opens the right listing. */
  bookingComUrl: "https://www.booking.com/hotel/gb/pacific-essex2.html",
  /** Airbnb listing for one of the sea view rooms. Empty hides the button. */
  airbnbUrl: "",
};

/** Where live availability and booking requests come from. */
export const BEDSYNC_URL = (process.env.NEXT_PUBLIC_BEDSYNC_URL || "https://bedsync.mihadalsaif2003.workers.dev").replace(/\/$/, "");

export interface Photo {
  /** Path inside public/, e.g. "rooms/king-sea-view/1". The page adds ".jpg" (large) or "-sm.jpg" (small). */
  src: string;
  alt: string;
}

export interface RoomInfo {
  /** Same name as in BedSync. */
  name: string;
  beds: string;
  sleeps: number;
  seaView: boolean;
  blurb: string;
  /** Room size in square metres, from the Booking.com listing. */
  size?: number;
  /** Short feature list shown under the description. */
  features?: string[];
  /** First photo is the main one. */
  photos?: Photo[];
  /** Not bookable right now, e.g. closed for renovation. */
  closedNote?: string;
}

const gallery = (folder: string, alts: string[]): Photo[] => alts.map((alt, i) => ({ src: `rooms/${folder}/${i + 1}`, alt }));

export const ROOMS: RoomInfo[] = [
  {
    name: "Deluxe Double Room with Sea View", beds: "1 double bed", sleeps: 2, seaView: true, size: 37,
    blurb: "One of our largest rooms, with big windows looking out over the seafront. There's a seating area and a desk, a flat-screen TV with streaming, and a fridge, minibar, microwave and kettle so tea, coffee and snacks are always to hand. The private bathroom has a walk-in shower, hairdryer and free toiletries.",
    features: ["Sea view", "Walk-in shower", "Streaming TV", "Fridge, microwave & kettle", "Desk & seating area", "Soundproofed", "Upstairs, stairs only"],
  },
  {
    name: "King Room with Sea View", beds: "1 large double bed", sleeps: 2, seaView: true, size: 37,
    blurb: "A large double bed, a private balcony and the sea right in front of you. The room has a seating area, desk and wardrobe, a flat-screen TV with streaming, and a fridge, minibar, microwave and tea and coffee tray. The private bathroom has a walk-in shower, hairdryer and free toiletries.",
    features: ["Balcony with sea view", "Walk-in shower", "Streaming TV", "Fridge, microwave & kettle", "Desk & seating area", "Soundproofed", "Upstairs, stairs only"],
    photos: gallery("king-sea-view", [
      "Bed with velvet headboard and large windows to the seafront",
      "Room with desk, bed and tea and coffee station",
      "Bed and wall-mounted TV, with wardrobe and kettle",
      "Bed facing the window and the trees along the seafront",
      "Bed with velvet and gold headboard",
      "Tea and coffee tray with kettle",
      "Balcony looking over Marine Parade East to the sea",
      "Private bathroom with walk-in shower",
      "Fresh towels and toiletries",
    ]),
  },
  { name: "Super King Room with Sea View", beds: "1 super king bed", sleeps: 2, seaView: true, blurb: "The biggest bed in the house, with the sea in front of you." },
  { name: "Family Room with Sea View", beds: "Bunk bed", sleeps: 1, seaView: true, blurb: "A sea view room for families.", closedNote: "Closed for renovation. Reopening soon." },
  { name: "Double Room", beds: "1 double bed", sleeps: 2, seaView: false, blurb: "A comfortable double on the town side, one minute from the sand." },
  { name: "Budget Double Room", beds: "1 double bed", sleeps: 2, seaView: false, blurb: "Everything you need for a night by the sea, for less." },
  { name: "Standard Single Room with Shower", beds: "1 single bed", sleeps: 1, seaView: false, blurb: "A tidy single with its own shower, for solo trips." },
  { name: "Triple Room with Shower", beds: "1 extra-large double + 1 single", sleeps: 3, seaView: false, blurb: "Room for three, with a private shower." },
  { name: "Family Room", beds: "1 king bed + 1 single bed", sleeps: 3, seaView: false, blurb: "Space for a small family, a short walk from the beach." },
];

/** From the hotel's listing. Keep to what every guest gets. */
export const FACILITIES = [
  "Private bathroom with walk-in shower",
  "Free WiFi",
  "Streaming TV",
  "Soundproofed rooms",
  "Non-smoking throughout",
  "Patio and outdoor seating",
];
