// import { useRef } from "react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { useDispatch } from "react-redux";
// import { saveBillToHistory } from "@/store/admin/bill-slice";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function BillGenerator({ 
//   isOpen, 
//   onClose, 
//   orderDetails, 
//   customerInfo = {} 
// }) {
//   const billRef = useRef();
//   const dispatch = useDispatch();
  
//   // Generate unique bill number
//   const generateBillNumber = () => {
//     const orderIdLast6 = orderDetails?._id?.slice(-6) || '000000';
//     const timestamp = Date.now().toString().slice(-4);
//     return `BILL-${orderIdLast6}-${timestamp}`;
//   };
  
//   const billNumber = generateBillNumber();

//   const generatePDF = async () => {
//     // Save bill to history before generating PDF
//     const billData = {
//       billNumber,
//       orderDetails,
//       customerInfo,
//       generatedAt: new Date().toISOString()
//     };
//     dispatch(saveBillToHistory(billData));
    
//     const element = billRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });
    
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
    
//     const imgWidth = 210;
//     const pageHeight = 295;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
    
//     let position = 0;
    
//     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;
    
//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }
    
//     // PDF download করুন
//     pdf.save(`${billNumber}.pdf`);
//   };

//   const currentDate = new Date().toLocaleDateString('en-GB');

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
//         <DialogHeader>
//           <DialogTitle>Bill Generate</DialogTitle>
//         </DialogHeader>
        
//         <div ref={billRef} className="p-6 bg-white">
//           {/* Header */}
//           <div className="text-center mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
//             <p className="text-gray-600">Your Company Name</p>
//             <p className="text-sm text-gray-500">Address, Phone, Email</p>
//           </div>

//           {/* Invoice Info */}
//           <div className="flex justify-between mb-6">
//             <div>
//               <h3 className="font-semibold text-gray-700">Bill To:</h3>
//               <p className="text-gray-600">{customerInfo.name || 'Customer Name'}</p>
//               <p className="text-gray-600">{customerInfo.email || 'customer@email.com'}</p>
//               <p className="text-gray-600">{customerInfo.address || 'Customer Address'}</p>
//             </div>
//             <div className="text-right">
//               <p><span className="font-semibold">Bill #:</span> {billNumber}</p>
//               <p><span className="font-semibold">Order #:</span> {orderDetails?._id?.slice(-8) || 'ORD-001'}</p>
//               <p><span className="font-semibold">Date:</span> {currentDate}</p>
//               <p><span className="font-semibold">Status:</span> 
//                 <span className={`ml-2 px-2 py-1 rounded text-sm ${
//                   orderDetails?.orderStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
//                   orderDetails?.orderStatus === 'rejected' ? 'bg-red-100 text-red-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {orderDetails?.orderStatus || 'Pending'}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Products Table */}
//           <div className="mb-6">
//             <table className="w-full table-auto border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-3 text-left">Product</th>
//                   <th className="border p-3 text-center">Quantity</th>
//                   <th className="border p-3 text-center">Price</th>
//                   <th className="border p-3 text-center">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderDetails?.cartItems?.map((item, index) => (
//                   <tr key={index}>
//                     <td className="border p-3">
//                       <div className="flex items-center">
//                         <img 
//                           src={item.image} 
//                           alt={item.title}
//                           className="w-12 h-12 object-cover rounded mr-3"
//                         />
//                         <div>
//                           <p className="font-medium">{item.title}</p>
//                           {item.salePrice > 0 && (
//                             <p className="text-sm text-red-600">Sale Price Applied</p>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="border p-3 text-center">{item.quantity}</td>
//                     <td className="border p-3 text-center">
//                       ${item.salePrice > 0 ? item.salePrice : item.price}
//                     </td>
//                     <td className="border p-3 text-center">
//                       ${((item.salePrice > 0 ? item.salePrice : item.price) * item.quantity).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary */}
//           <div className="flex justify-end mb-6">
//             <div className="w-64">
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal:</span>
//                 <span>${orderDetails?.totalAmount || '0.00'}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span>Tax (0%):</span>
//                 <span>$0.00</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span>Shipping:</span>
//                 <span>Free</span>
//               </div>
//               <hr className="my-2" />
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total:</span>
//                 <span>${orderDetails?.totalAmount || '0.00'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center text-sm text-gray-500 mt-8">
//             <p>Thank you for your business!</p>
//             <p>Terms & Conditions Apply</p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-2 mt-4">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//           <Button onClick={generatePDF}>
//             Download PDF
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default BillGenerator;