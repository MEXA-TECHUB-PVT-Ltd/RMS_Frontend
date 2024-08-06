import { FaRegUser, FaStoreAlt, FaProductHunt, FaViacoin, FaAlipay } from "react-icons/fa";
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
  {
    id: "items",
    title: "Items",
    path: "/items",
    icon: <FaProductHunt size={21} />,
  },
  {
    id: "purchaserequisition",
    title: "Purchase Requistion",
    path: "/puchase-requisition",
    icon: <FaAlipay size={21} />,
  },
  {
    id: "purchaseorder",
    title: "Purchase Order",
    path: "/puchase-order",
    icon: <FaViacoin size={21} />,
  },
];
