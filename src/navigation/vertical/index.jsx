import { FaRegUser, FaStoreAlt } from "react-icons/fa";
import { MdOutlineDashboardCustomize } from "react-icons/md";

export default [
  {
    id: "home",
    title: "Dashboard",
    path: "/",
    icon: <MdOutlineDashboardCustomize size={21} />,
  },
  {
    id: "vendor",
    title: "Vendors",
    path: "/vendors",
    icon: <FaStoreAlt size={21} />,
  },
  {
    id: "users",
    title: "Users",
    path: "/users",
    icon: <FaRegUser size={21} />,
  },
];
