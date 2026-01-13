import { UserRole } from "@/modules/shared/interfaces";
import { ReactNode } from "react";

export interface RoutesProps {
  path: string;
  name: string;
  breadcrumb: Array<{ label: string; path: string }>;
  element: ReactNode;
  roles: string[];
  requiresAuth: boolean;
}
