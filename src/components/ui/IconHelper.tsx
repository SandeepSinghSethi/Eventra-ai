import React from "react";
import {
  Building2,
  Utensils,
  Camera,
  Flower2,
  Music,
  Mic,
  Shirt,
  Mail,
  Car,
  ShieldCheck,
  PiggyBank,
  Cake,
  Gift,
  Megaphone,
  Tent,
  Users,
  Package,
  LucideProps,
} from "lucide-react";
import { AllowedIcon } from "@/lib/types";

interface IconHelperProps extends LucideProps {
  name: AllowedIcon | string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, ...props }) => {
  switch (name) {
    case "building-2":
      return <Building2 {...props} />;
    case "utensils":
      return <Utensils {...props} />;
    case "camera":
      return <Camera {...props} />;
    case "flower-2":
      return <Flower2 {...props} />;
    case "music":
      return <Music {...props} />;
    case "mic":
      return <Mic {...props} />;
    case "shirt":
      return <Shirt {...props} />;
    case "mail":
      return <Mail {...props} />;
    case "car":
      return <Car {...props} />;
    case "shield-check":
      return <ShieldCheck {...props} />;
    case "piggy-bank":
      return <PiggyBank {...props} />;
    case "cake":
      return <Cake {...props} />;
    case "gift":
      return <Gift {...props} />;
    case "megaphone":
      return <Megaphone {...props} />;
    case "tent":
      return <Tent {...props} />;
    case "users":
      return <Users {...props} />;
    case "package":
    default:
      return <Package {...props} />;
  }
};

