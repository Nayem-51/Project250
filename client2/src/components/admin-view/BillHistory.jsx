// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Badge } from "../ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { 
//   searchBillByNumber, 
//   clearSearchResults, 
//   deleteBillFromHistory 
// } from "@/store/admin/bill-slice";
// import { Search, Eye, Trash2, FileText } from "lucide-react";
// import BillGenerator from "./BillGenerator";

// function BillHistory() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [showBillDialog, setShowBillDialog] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
  
//   const dispatch = useDispatch();
//   const { billHistory, searchResults } = useSelector((state) => state.adminBill);

//   // Search function
//   const handleSearch = () => {
//     if (searchTerm.trim()) {
//       dispatch(searchBillByNumber(searchTerm.trim()));
//     } else {
//       dispatch(clearSearchResults());
//     }
//   };

//   // Clear search function
//   const clearSearch = () => {
//     setSearchTerm("");
//     dispatch(clearSearchResults());
//   };

//   // Delete bill function
//   const handleDeleteBill = (billId) => {
//     if (window.confirm('Are you sure you want to delete this bill?')) {
//       dispatch(deleteBillFromHistory(billId));
//     }
//   };

//   // View bill details function
//   const viewBillDetails = (bill) => {
//     setSelectedBill(bill);
//     setShowPreview(true);
//   };

//   // Re-generate bill function
//   const regenerateBill = (bill) => {
//     setSelectedBill(bill);
//     setShowBillDialog(true);
//   };

//   // Display data (search results বা সব bills)
//   const displayData = searchResults.length > 0 ? searchResults : billHistory;

//   useEffect(() => {
//     // Auto search on input change
//     if (searchTerm.trim()) {
//       const timeoutId = setTimeout(() => {
//         handleSearch();
//       }, 300);
//       return () => clearTimeout(timeoutId);
//     } else {
//       dispatch(clearSearchResults());
//     }
//   }, [searchTerm]);

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileText className="w-5 h-5" />
//             Bill History
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {/* Search Section */}
//           <div className="flex gap-2 mb-6">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search by bill number or order ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <Button variant="outline" onClick={handleSearch}>
//               Search
//             </Button>
//             {(searchTerm || searchResults.length > 0) && (
//               <Button variant="outline" onClick={clearSearch}>
//                 Clear
//               </Button>
//             )}
//           </div>

//           {/* Bills Table */}
//           {displayData.length > 0 ? (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Bill Number</TableHead>
//                     <TableHead>Order ID</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {displayData.map((bill) => (
//                     <TableRow key={bill.id}>
//                       <TableCell className="font-medium">
//                         {bill.billNumber}
//                       </TableCell>
//                       <TableCell>
//                         {bill.orderDetails?._id?.slice(-8) || 'N/A'}
//                       </TableCell>
//                       <TableCell>
//                         {bill.customerInfo?.name || 'Walk-in Customer'}
//                       </TableCell>
//                       <TableCell className="font-semibold">
//                         ${bill.orderDetails?.totalAmount || '0.00'}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           className={`${
//                             bill.orderDetails?.orderStatus === 'confirmed'
//                               ? 'bg-green-500'
//                               : bill.orderDetails?.orderStatus === 'rejected'
//                               ? 'bg-red-500'
//                               : 'bg-yellow-500'
//                           }`}
//                         >
//                           {bill.orderDetails?.orderStatus || 'pending'}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {new Date(bill.generatedAt).toLocaleDateString('en-GB')}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-1">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => viewBillDetails(bill)}
//                             title="View Details"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => regenerateBill(bill)}
//                             title="Re-generate Bill"
//                           >
//                             <FileText className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleDeleteBill(bill.id)}
//                             title="Delete Bill"
//                           >
//                             <Trash2 className="w-4 h-4 text-red-500" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <FileText className="mx-auto w-12 h-12 text-gray-300 mb-4" />
//               <p className="text-gray-500">
//                 {searchTerm ? 'No bills found matching your search.' : 'No bills generated yet.'}
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Bill Preview Dialog */}
//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
//           <DialogHeader>
//             <DialogTitle>Bill Preview - {selectedBill?.billNumber}</DialogTitle>
//           </DialogHeader>
//           {selectedBill && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <strong>Order ID:</strong> {selectedBill.orderDetails?._id?.slice(-8)}
//                 </div>
//                 <div>
//                   <strong>Customer:</strong> {selectedBill.customerInfo?.name || 'Walk-in'}
//                 </div>
//                 <div>
//                   <strong>Total Amount:</strong> ${selectedBill.orderDetails?.totalAmount}
//                 </div>
//                 <div>
//                   <strong>Generated:</strong> {new Date(selectedBill.generatedAt).toLocaleString()}
//                 </div>
//               </div>
              
//               <div>
//                 <h4 className="font-semibold mb-2">Items:</h4>
//                 <div className="space-y-2">
//                   {selectedBill.orderDetails?.cartItems?.map((item, index) => (
//                     <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <span>{item.title} x {item.quantity}</span>
//                       <span>${((item.salePrice > 0 ? item.salePrice : item.price) * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowPreview(false);
//                     regenerateBill(selectedBill);
//                   }}
//                 >
//                   Re-generate Bill
//                 </Button>
//                 <Button onClick={() => setShowPreview(false)}>
//                   Close
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Bill Generator Dialog */}
//       {selectedBill && (
//         <BillGenerator
//           isOpen={showBillDialog}
//           onClose={() => {
//             setShowBillDialog(false);
//             setSelectedBill(null);
//           }}
//           orderDetails={selectedBill.orderDetails}
//           customerInfo={selectedBill.customerInfo}
//         />
//       )}
//     </div>
//   );
// }

// export default BillHistory;