import { RoutesProps } from "./types";
import Dashboard from "../modules/dashboard/pages/Dashboard";
import Login from "../modules/auth/pages/Login";
import Register from "../modules/auth/pages/Register";
import RiderRegister from "../modules/auth/pages/RiderRegister";
import TenantRegister from "../modules/auth/pages/TenantRegister";
import TripList from "../modules/trip/pages/TripList";
import BusesPage from "../modules/fleet/pages/BusesPage";
import BusDetailsPage from "../modules/fleet/pages/BusDetailsPage";
import DriversPage from "../modules/fleet/pages/DriversPage";
import MakesPage from "../modules/fleet/pages/MakesPage";
import ModelsPage from "../modules/fleet/pages/ModelsPage";
import RoutesPage from "../modules/route/pages/RoutesPage";
import StopsPage from "../modules/route/pages/StopsPage";


// Public routes (accessible without authentication)
export const publicRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    breadcrumb: [{ label: "Login", path: "/auth/login" }],
    element: <Login />,
    roles: [],
    requiresAuth: false,
  },
  {
    path: "/auth/register",
    name: "Register",
    breadcrumb: [{ label: "Register", path: "/auth/register" }],
    element: <Register />,
    roles: [],
    requiresAuth: false,
  },
  {
    path: "/auth/register-rider",
    name: "Rider Registration",
    breadcrumb: [{ label: "Rider Registration", path: "/auth/register-rider" }],
    element: <RiderRegister />,
    roles: [],
    requiresAuth: false,
  },
  {
    path: "/auth/register-tenant",
    name: "Tenant Registration",
    breadcrumb: [{ label: "Tenant Registration", path: "/auth/register-tenant" }],
    element: <TenantRegister />,
    roles: [],
    requiresAuth: false,
  },
];

// Protected routes (require authentication but no specific layout)
export const protectedRoutes: RoutesProps[] = [
  // Add any protected routes that don't need the admin layout here
];

// Admin routes (require authentication and use AdminLayout)
export const adminRoutes: RoutesProps[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    breadcrumb: [{ label: "Dashboard", path: "/dashboard" }],
    element: <Dashboard />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/trips",
    name: "Trips",
    breadcrumb: [{ label: "Trips", path: "/trips" }],
    element: <TripList />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/fleet/buses/:id",
    name: "Bus Details",
    breadcrumb: [
      { label: "Fleet", path: "/fleet/buses" },
      { label: "Buses", path: "/fleet/buses" },
      { label: "Bus Details", path: "/fleet/buses/:id" },
    ],
    element: <BusDetailsPage />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/fleet/buses",
    name: "Buses",
    breadcrumb: [{ label: "Fleet", path: "/fleet/buses" }, { label: "Buses", path: "/fleet/buses" }],
    element: <BusesPage />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/fleet/drivers",
    name: "Drivers",
    breadcrumb: [{ label: "Fleet", path: "/fleet/drivers" }, { label: "Drivers", path: "/fleet/drivers" }],
    element: <DriversPage />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/fleet/makes",
    name: "Makes",
    breadcrumb: [{ label: "Fleet", path: "/fleet/makes" }, { label: "Makes", path: "/fleet/makes" }],
    element: <MakesPage />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/fleet/models",
    name: "Models",
    breadcrumb: [{ label: "Fleet", path: "/fleet/models" }, { label: "Models", path: "/fleet/models" }],
    element: <ModelsPage />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/routes",
    name: "Routes",
    breadcrumb: [{ label: "Routes", path: "/routes" }],
    element: <RoutesPage />,
    roles: [],
    requiresAuth: true,
  },
  {
    path: "/stops",
    name: "Stops",
    breadcrumb: [{ label: "Stops", path: "/stops" }],
    element: <StopsPage />,
    roles: [],
    requiresAuth: true,
  },
];
