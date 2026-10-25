import {
  AirVent, AlarmSmoke, Armchair, Bath, BedDouble, BriefcaseMedical, Cctv, CigaretteOff, Coffee, DoorClosed, Droplet, Droplets,
  Fan, Fence, FireExtinguisher, Footprints, Heater, Laptop, Lock, Microwave, PlugZap, Refrigerator, Ruler, Sailboat, Shirt,
  ShowerHead, Sofa, ThermometerSnowflake, Tv, Utensils, VolumeX, Waves, Wifi, Wind, type LucideIcon,
} from "lucide-react";

/** Icons used in room highlights and "What this room offers", by the key used in site.ts. */
const ICONS: Record<string, LucideIcon> = {
  shower: ShowerHead, bottle: Droplet, wind: Wind, towel: Bath, tv: Tv, wifi: Wifi, desk: Laptop, kettle: Coffee,
  fridge: Refrigerator, microwave: Microwave, dining: Utensils, volume: VolumeX, sofa: Sofa, wardrobe: DoorClosed,
  heat: Heater, fan: Fan, air: AirVent, iron: Shirt, plug: PlugZap, bed: BedDouble, lock: Lock, alarm: AlarmSmoke,
  extinguisher: FireExtinguisher, firstaid: BriefcaseMedical, sanitiser: Droplets, camera: Cctv, stairs: Footprints,
  nosmoking: CigaretteOff, noac: ThermometerSnowflake, waves: Waves, patio: Armchair, balcony: Fence, ruler: Ruler, beach: Sailboat,
};

export function Icon({ name, className = "size-6" }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Waves;
  return <C className={className} strokeWidth={1.6} aria-hidden="true" />;
}
