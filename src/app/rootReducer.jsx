import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./features/Theme/themeSlice";
import userReducer from "./features/User/userSlice";
import addVendor from "./features/Vendor/addVendorSlice";
import getVendorSlice from "./features/Vendor/getVendorSlice";
import getCurrencySlice from "./features/currency/getCurrencySlice";
import getPaymentTermSlice from "./features/paymentTerms/getPaymentTermSlice";
import deleteVendorSlice from "./features/Vendor/deleteVendorSlice";
import updateVendorSlice from "./features/Vendor/updateVendorSlice";

import getItemSlice from "./features/Item/getItemSlice";
import getPurchaseOrderSlice from "./features/Purchaseorder/getPurchaseOrderSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
  addVendor: addVendor,
  updateVendor: updateVendorSlice,
  deleteVendor: deleteVendorSlice,
  getVendor: getVendorSlice,
  getCurrency: getCurrencySlice,
  getPaymentTerm: getPaymentTermSlice,
  getItem: getItemSlice,
  getPO: getPurchaseOrderSlice
});

export default rootReducer;
