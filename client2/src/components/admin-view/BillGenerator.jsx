// import { useRef } from "react";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { useDispatch } from "react-redux";
// import { saveBillToHistory } from "@/store/admin/bill-slice";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { Printer, Download, Save } from "lucide-react";

// function BillGenerator({ 
//   isOpen, 
//   onClose, 
//   orderDetails, 
//   customerInfo = {} 
// }) {
//   const billRef = useRef();
//   const dispatch = useDispatch();
  
//   // Unique bill number generate করার function
//   const generateBillNumber = () => {
//     const orderIdLast6 = orderDetails?._id?.slice(-6) || '000000';
//     const timestamp = Date.now().toString().slice(-4);
//     return `BILL-${orderIdLast6}-${timestamp}`;
//   };
  
//   const billNumber = generateBillNumber();

//   // Bill save করার function
//   const saveBill = () => {
//     const billData = {
//       billNumber,
//       orderDetails,
//       customerInfo,
//       generatedAt: new Date().toISOString()
//     };
//     dispatch(saveBillToHistory(billData));
//     alert('Bill saved successfully!');
//   };

//   // PDF generate এবং download করার function
//   const generatePDF = async () => {
//     saveBill();
    
//     const element = billRef.current;
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: '#ffffff'
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
    
//     pdf.save(`${billNumber}.pdf`);
//   };

//   // Print করার function
//   const printBill = () => {
//     saveBill();
    
//     const printContent = billRef.current;
//     const printWindow = window.open('', '_blank');
    
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Bill - ${billNumber}</title>
//           <style>
//             body { 
//               font-family: Arial, sans-serif; 
//               margin: 0; 
//               padding: 20px;
//               color: #333;
//             }
//             table { 
//               width: 100%; 
//               border-collapse: collapse; 
//               margin: 20px 0;
//             }
//             th, td { 
//               border: 1px solid #ddd; 
//               padding: 12px; 
//               text-align: left;
//             }
//             th { 
//               background-color: #f5f5f5; 
//               font-weight: bold;
//             }
//             .text-center { text-align: center; }
//             .text-right { text-align: right; }
//             .font-bold { font-weight: bold; }
//             .text-lg { font-size: 18px; }
//             .text-3xl { font-size: 24px; }
//             .mb-6 { margin-bottom: 24px; }
//             .mb-2 { margin-bottom: 8px; }
//             @media print {
//               body { margin: 0; }
//             }
//           </style>
//         </head>
//         <body>
//           ${printContent.innerHTML}
//         </body>
//       </html>
//     `);
    
//     printWindow.document.close();
//     printWindow.focus();
    
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//   };

//   const currentDate = new Date().toLocaleDateString('en-GB');

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
//         <DialogHeader>
//           <DialogTitle>Bill Generator</DialogTitle>
//         </DialogHeader>
        
//         <div ref={billRef} className="p-6 bg-white">
//           {/* Header */}
//           <div className="text-center mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
//             <p className="text-gray-600 font-semibold">Your Company Name</p>
//             <p className="text-sm text-gray-500">123 Business Street, City, State 12345</p>
//             <p className="text-sm text-gray-500">Phone: (555) 123-4567 | Email: info@company.com</p>
//           </div>

//           {/* Invoice Info */}
//           <div className="flex justify-between mb-6">
//             <div>
//               <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
//               <div className="text-gray-600">
//                 <p className="font-medium">{customerInfo.name || 'Walk-in Customer'}</p>
//                 <p>{customerInfo.email || 'customer@email.com'}</p>
//                 <p>{customerInfo.address || 'Customer Address'}</p>
//                 <p>{customerInfo.phone || 'Phone: N/A'}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="bg-gray-50 p-4 rounded">
//                 <p className="mb-1"><span className="font-semibold">Bill #:</span> {billNumber}</p>
//                 <p className="mb-1"><span className="font-semibold">Order #:</span> {orderDetails?._id?.slice(-8) || 'ORD-001'}</p>
//                 <p className="mb-1"><span className="font-semibold">Date:</span> {currentDate}</p>
//                 <p><span className="font-semibold">Status:</span> 
//                   <span className={`ml-2 px-2 py-1 rounded text-sm ${
//                     orderDetails?.orderStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
//                     orderDetails?.orderStatus === 'rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {orderDetails?.orderStatus || 'Pending'}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Products Table */}
//           <div className="mb-6">
//             <table className="w-full table-auto border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-3 text-left">Product</th>
//                   <th className="border p-3 text-center">Quantity</th>
//                   <th className="border p-3 text-center">Unit Price</th>
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
//                           <p className="text-sm text-gray-500">{item.category}</p>
//                           {item.salePrice > 0 && (
//                             <p className="text-sm text-red-600">Sale Price Applied</p>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="border p-3 text-center font-medium">{item.quantity}</td>
//                     <td className="border p-3 text-center">
//                       <div>
//                         {item.salePrice > 0 ? (
//                           <>
//                             <span className="line-through text-gray-400">${item.price}</span>
//                             <br />
//                             <span className="text-red-600 font-medium">${item.salePrice}</span>
//                           </>
//                         ) : (
//                           <span>${item.price}</span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border p-3 text-center font-semibold">
//                       ${((item.salePrice > 0 ? item.salePrice : item.price) * item.quantity).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary */}
//           <div className="flex justify-end mb-6">
//             <div className="w-80">
//               <div className="bg-gray-50 p-4 rounded">
//                 <div className="flex justify-between mb-2">
//                   <span>Subtotal:</span>
//                   <span>${orderDetails?.totalAmount || '0.00'}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Tax (0%):</span>
//                   <span>$0.00</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Shipping:</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//                 <hr className="my-3 border-gray-300" />
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total Amount:</span>
//                   <span className="text-blue-600">${orderDetails?.totalAmount || '0.00'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center text-sm text-gray-500 mt-8 border-t pt-4">
//             <p className="font-semibold mb-1">Thank you for your business!</p>
//             <p>For any queries, please contact us at info@company.com</p>
//             <p className="mt-2">Terms & Conditions Apply | Return Policy: 7 Days</p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-2 mt-4 border-t pt-4">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//           <Button variant="outline" onClick={saveBill} className="flex items-center gap-2">
//             <Save className="w-4 h-4" />
//             Save Bill
//           </Button>
//           <Button variant="outline" onClick={printBill} className="flex items-center gap-2">
//             <Printer className="w-4 h-4" />
//             Print
//           </Button>
//           <Button onClick={generatePDF} className="flex items-center gap-2">
//             <Download className="w-4 h-4" />
//             Download PDF
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default BillGenerator;