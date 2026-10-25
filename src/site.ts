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

/** One line in "What this room offers". `icon` is a key in components/Amenities.tsx. */
export interface Amenity {
  icon: string;
  label: string;
}

export interface AmenityGroup {
  title: string;
  items: Amenity[];
}

export interface RoomInfo {
  /** Same name as in BedSync. */
  name: string;
  beds: string;
  sleeps: number;
  seaView: boolean;
  /** Short line for the room list. */
  blurb: string;
  /** Full description for the room page. Paragraphs separated by a blank line. */
  description?: string;
  /** Room size in square metres, from the Booking.com listing. */
  size?: number;
  /** Two or three standout points shown near the top of the room page. */
  highlights?: { icon: string; title: string; text: string }[];
  /** Everything in the room, grouped. The first few items show on the page; the rest open in "Show all". */
  amenities?: AmenityGroup[];
  /** First photo is the main one. The first five fill the photo grid on the room page. */
  photos?: Photo[];
  /** Not bookable right now, e.g. closed for renovation. */
  closedNote?: string;
}

/** "King Room with Sea View" → "king-room-with-sea-view", used in the room page address. */
export const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const photo = (folder: string, n: number, alt: string): Photo => ({ src: `rooms/${folder}/${n}`, alt });

// What every upstairs room has, from the Booking.com and Airbnb listings.
const BATHROOM: AmenityGroup = {
  title: "Bathroom",
  items: [
    { icon: "shower", label: "Private bathroom with walk-in shower" },
    { icon: "bottle", label: "Free toiletries" },
    { icon: "wind", label: "Hairdryer" },
    { icon: "towel", label: "Towels and toilet paper" },
  ],
};
const ENTERTAINMENT: AmenityGroup = {
  title: "Entertainment and internet",
  items: [
    { icon: "tv", label: "Flat-screen TV with streaming (like Netflix)" },
    { icon: "wifi", label: "Free WiFi" },
    { icon: "desk", label: "Desk for working" },
  ],
};
const FOOD: AmenityGroup = {
  title: "Food and drink",
  items: [
    { icon: "kettle", label: "Electric kettle with tea and coffee" },
    { icon: "fridge", label: "Fridge and minibar" },
    { icon: "microwave", label: "Microwave" },
    { icon: "dining", label: "Dining area" },
  ],
};
const COMFORT: AmenityGroup = {
  title: "Room comfort",
  items: [
    { icon: "volume", label: "Soundproofed walls" },
    { icon: "sofa", label: "Seating area" },
    { icon: "wardrobe", label: "Wardrobe and clothes rack" },
    { icon: "heat", label: "Heating" },
    { icon: "fan", label: "Fan" },
    { icon: "air", label: "Air purifier" },
    { icon: "iron", label: "Iron" },
    { icon: "plug", label: "Socket by the bed" },
    { icon: "bed", label: "Bed linen" },
  ],
};
const SAFETY: AmenityGroup = {
  title: "Safety",
  items: [
    { icon: "lock", label: "Lock on the bedroom door" },
    { icon: "alarm", label: "Smoke alarm and carbon monoxide alarm" },
    { icon: "extinguisher", label: "Fire extinguisher" },
    { icon: "firstaid", label: "First aid kit" },
    { icon: "sanitiser", label: "Hand sanitiser" },
    { icon: "camera", label: "Security cameras outside the building only" },
  ],
};
const GOOD_TO_KNOW: AmenityGroup = {
  title: "Good to know",
  items: [
    { icon: "stairs", label: "Upstairs, reached by stairs only (no lift)" },
    { icon: "nosmoking", label: "No smoking" },
    { icon: "noac", label: "No air conditioning" },
  ],
};

export const ROOMS: RoomInfo[] = [
  {
    name: "Deluxe Double Room with Sea View", beds: "1 double bed", sleeps: 2, seaView: true, size: 37,
    blurb: "One of our largest rooms, with big windows looking out over the seafront.",
    description:
      "One of our largest rooms, with big windows looking straight out over the seafront to the sea. Clacton Pier is 200 metres away and the beach is a minute's walk.\n\nThere's a seating area and a desk, a flat-screen TV with streaming, and a fridge, minibar, microwave and kettle, so tea, coffee and snacks are always to hand. The walls are soundproofed, so the seafront stays outside when you want to sleep.\n\nThe private bathroom has a walk-in shower, hairdryer and free toiletries.",
    highlights: [
      { icon: "waves", title: "Sea view", text: "Big windows looking out over the seafront to the sea." },
      { icon: "ruler", title: "37 m²", text: "One of our largest rooms, with a seating area and desk." },
      { icon: "beach", title: "A minute to the beach", text: "Clacton Pier is 200 metres away." },
    ],
    amenities: [
      { title: "View and outdoors", items: [{ icon: "waves", label: "Sea view" }, { icon: "patio", label: "Patio" }] },
      BATHROOM, ENTERTAINMENT, FOOD, COMFORT, SAFETY, GOOD_TO_KNOW,
    ],
  },
  {
    name: "King Room with Sea View", beds: "1 large double bed", sleeps: 2, seaView: true, size: 37,
    blurb: "A large double bed, a private balcony and the sea right in front of you.",
    description:
      "A large double bed, a private balcony and the sea right in front of you. Step outside to watch the seafront from Marine Parade East, then walk a minute to the beach or 200 metres to Clacton Pier, with its arcades, shops and restaurants close by.\n\nInside there's a seating area, a desk and a wardrobe, a flat-screen TV with streaming, and a fridge, minibar, microwave and tea and coffee tray. The walls are soundproofed for a quiet night.\n\nThe private bathroom has a walk-in shower, hairdryer and free toiletries.",
    highlights: [
      { icon: "balcony", title: "Private balcony", text: "Step outside with a view over the seafront to the sea." },
      { icon: "ruler", title: "37 m²", text: "Room for a seating area, desk and wardrobe." },
      { icon: "beach", title: "A minute to the beach", text: "Clacton Pier is 200 metres away." },
    ],
    amenities: [
      { title: "View and outdoors", items: [{ icon: "waves", label: "Sea view" }, { icon: "balcony", label: "Private balcony" }, { icon: "patio", label: "Outdoor furniture and dining area" }] },
      BATHROOM, ENTERTAINMENT, FOOD, COMFORT, SAFETY, GOOD_TO_KNOW,
    ],
    photos: [
      photo("king-sea-view", 1, "Bed with velvet headboard and large windows to the seafront"),
      photo("king-sea-view", 2, "Room with desk, bed and tea and coffee station"),
      photo("king-sea-view", 7, "Balcony looking over Marine Parade East to the sea"),
      photo("king-sea-view", 8, "Private bathroom with walk-in shower"),
      photo("king-sea-view", 3, "Bed and wall-mounted TV, with wardrobe and kettle"),
      photo("king-sea-view", 4, "Bed facing the window and the trees along the seafront"),
      photo("king-sea-view", 5, "Bed with velvet and gold headboard"),
      photo("king-sea-view", 6, "Tea and coffee tray with kettle"),
      photo("king-sea-view", 9, "Fresh towels and toiletries"),
    ],
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
