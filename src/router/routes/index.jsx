import Vendor from "../../views/Vendor/Vendor";
import Home from "../../views/Home";
import Users from "../../views/Users";
import AddVendor from "../../views/Vendor/AddVendor";
import VendorDetails from "../../views/Vendor/VendorDetails";
import EditVendor from "../../views/Vendor/EditVendor";

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
];
