import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./features/Theme/themeSlice";
import userReducer from "./features/User/userSlice";
import addVendor from "./features/Vendor/addVendorSlice";
import getVendorSlice from "./features/Vendor/getVendorSlice";
import getCurrencySlice from "./features/currency/getCurrencySlice";
import getPaymentTermSlice from "./features/paymentTerms/getPaymentTermSlice";
import deleteVendorSlice from "./features/Vendor/deleteVendorSlice";
import updateVendorSlice from "./features/Vendor/updateVendorSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
  addVendor: addVendor,
  updateVendor: updateVendorSlice,
  deleteVendor: deleteVendorSlice,
  getVendor: getVendorSlice,
  getCurrency: getCurrencySlice,
  getPaymentTerm: getPaymentTermSlice,
});

export default rootReducer;
