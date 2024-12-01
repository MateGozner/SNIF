import { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
}