import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HotelIcon from "@mui/icons-material/Hotel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Storefront";

export const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "rooms",
    title: "Rooms",
    icon: <HomeIcon />,
  },
  {
    segment: "bookings",
    title: "Bookings",
    icon: <EventIcon />,
  },
  {
    segment: "payments",
    title: "Payments",
    icon: <PaymentIcon />,
  },
  {
    segment: "inventory",
    title: "Inventory",
    icon: <InventoryIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "bookingreport",
        title: "Booking",
        icon: <AttachMoneyIcon />,
      },
      {
        segment: "salary",
        title: "Salary",
        icon: <AccountBalanceWalletIcon />,
      },
    ],
  },

  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Bussiness",
  },
  {
    segment: "bussiness",
    title: "Bussiness",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "b2b",
        title: "B2B",
        icon: <AttachMoneyIcon />,
      },
      {
        segment: "listproperty",
        title: "List Property",
        icon: <AccountBalanceWalletIcon />,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Managemnet",
  },
  {
    segment: "hotel",
    title: "Hotels",
    icon: <HotelIcon />,
  },
  {
    segment: "admins",
    title: "Admin",
    icon: <AdminPanelSettingsIcon />,
  },
  {
    segment: "staff",
    title: "Staff",
    icon: <GroupIcon />,
  },
  {
    segment: "expence",
    title: "Expence",
    icon: <AccountBalanceWalletIcon />,
  },
];
