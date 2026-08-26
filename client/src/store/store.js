import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import adminProductsReducer from "./admin/products-slice/index.js";
import shoppingProductsSlice from "./shop/products-slice/index.js";
import shoppingCartReducer from "./shop/cart-slice/index.js";
import shopOrderSlice from "./shop/order-slice/index.js";
import addressSlice from "./shop/address-slice/index.js";
import adminOrderSlice from "./admin/order-slice/index.js";
import shopSearchSlice from "./shop/search-slice/index.js";
import shopReviewSlice from "./shop/review-slice/index.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    adminOrder: adminOrderSlice,
    shopProducts: shoppingProductsSlice,
    shoppingCart: shoppingCartReducer,
    shopAddress: addressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
  }
})

export default store;
