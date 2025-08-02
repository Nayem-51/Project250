// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   billHistory: [],
//   searchResults: [],
//   isLoading: false,
//   error: null
// };

// const billSlice = createSlice({
//   name: "adminBill",
//   initialState,
//   reducers: {
//     saveBillToHistory: (state, action) => {
//       const billData = {
//         ...action.payload,
//         billNumber: action.payload.billNumber,
//         generatedAt: new Date().toISOString(),
//         id: Date.now().toString()
//       };
      
//       const existingBillIndex = state.billHistory.findIndex(
//         bill => bill.billNumber === billData.billNumber
//       );
      
//       if (existingBillIndex !== -1) {
//         state.billHistory[existingBillIndex] = billData;
//       } else {
//         state.billHistory.unshift(billData);
//       }
      
//       if (state.billHistory.length > 100) {
//         state.billHistory = state.billHistory.slice(0, 100);
//       }
//     },
    
//     searchBillByNumber: (state, action) => {
//       const searchTerm = action.payload.toLowerCase();
//       state.searchResults = state.billHistory.filter(bill =>
//         bill.billNumber.toLowerCase().includes(searchTerm) ||
//         bill.orderDetails._id.toLowerCase().includes(searchTerm)
//       );
//     },
    
//     clearSearchResults: (state) => {
//       state.searchResults = [];
//     },
    
//     deleteBillFromHistory: (state, action) => {
//       state.billHistory = state.billHistory.filter(
//         bill => bill.id !== action.payload
//       );
//     },
    
//     clearBillHistory: (state) => {
//       state.billHistory = [];
//       state.searchResults = [];
//     }
//   }
// });

// export const {
//   saveBillToHistory,
//   searchBillByNumber,
//   clearSearchResults,
//   deleteBillFromHistory,
//   clearBillHistory
// } = billSlice.actions;

// export default billSlice.reducer;