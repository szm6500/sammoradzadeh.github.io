import {
  ArrowUpRight,
  ArrowUp,
  Mail,
  GraduationCap,
  Github,
  Linkedin,
  MapPin,
  Radio,
  TrendingDown,
  TrendingUp,
  Box,
  Database,
  ChartNoAxesCombined,
  Users,
  Layers,
  Award,
  X,
  Menu,
} from "lucide-react";

const icons = {
  "arrow-up-right": ArrowUpRight,
  "arrow-up": ArrowUp,
  mail: Mail,
  "graduation-cap": GraduationCap,
  github: Github,
  linkedin: Linkedin,
  "map-pin": MapPin,
  radio: Radio,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  box: Box,
  database: Database,
  "chart-no-axes-combined": ChartNoAxesCombined,
  users: Users,
  layers: Layers,
  award: Award,
  x: X,
  menu: Menu,
};

export default function Icon({ name }) {
  const Component = icons[name];
  return Component ? (
    <Component className="icon" strokeWidth={1.6} aria-hidden="true" />
  ) : null;
}
