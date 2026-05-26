import {
  Home,
  Droplet,
  Bath,
  Search,
  Wrench,
  Thermometer,
  CloudRain,
  Layers,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/content/schema";

const map: Record<Service["iconKey"], LucideIcon> = {
  roof: Home,
  tank: Droplet,
  bath: Bath,
  leak: Search,
  wrench: Wrench,
  thermal: Thermometer,
  water: CloudRain,
  foam: Layers,
  pool: Waves,
};

type Props = {
  iconKey: Service["iconKey"];
  className?: string;
  strokeWidth?: number;
};

export function ServiceIcon({ iconKey, className, strokeWidth = 1.75 }: Props) {
  const I = map[iconKey];
  return <I className={className} strokeWidth={strokeWidth} aria-hidden />;
}
