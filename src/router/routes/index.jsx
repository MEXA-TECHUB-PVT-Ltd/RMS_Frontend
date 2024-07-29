import Vendor from "../../views/Vendor/Vendor";
import Home from "../../views/Home";
import Users from "../../views/Users";
import AddVendor from "../../views/Vendor/AddVendor";
import VendorDetails from "../../views/Vendor/VendorDetails";
import EditVendor from "../../views/Vendor/EditVendor";
import Item from "../../views/Item/Item"
import AddItem from "../../views/Item/AddItem";
import EditItem from "../../views/Item/EditItem";
import ItemDetails from "../../views/Item/ItemDetails";
import Purchaseorder from "../../views/Purchaseorder/Purchaseorder"
import PurchaseorderDetails from "../../views/Purchaseorder/PurchaseorderDetails"

export default [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/vendors",
    element: <Vendor />,
  },
  {
    path: "/add-vendor",
    element: <AddVendor />,
  },
  {
    path: "/edit-vendor",
    element: <EditVendor />,
  },
  {
    path: "/vendor-details",
    element: <VendorDetails />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/items",
    element: <Item />,
  },
  {
    path: "/add-item",
    element: <AddItem />,
  },
  {
    path: "/edit-item",
    element: <EditItem />,
  },
  {
    path: "/item-detail",
    element: <ItemDetails />,
  },
  {
    path: "/puchase-order",
    element: <Purchaseorder />,
  },
  {
    path: "/puchase-order-details",
    element: <PurchaseorderDetails />,
  },
];
