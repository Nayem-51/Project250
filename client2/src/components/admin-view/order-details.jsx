// import BillGenerator from "./BillGenerator";
import { Receipt } from "lucide-react";

import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

// const [showBillGenerator, setShowBillGenerator] = useState(false);
// const initialFormData = {
//   status: "",
// };

// Customer info generate করার জন্য এই function add করুন:
// const customerInfo = {
//   name: orderDetails?.addressInfo?.fullName || 'Walk-in Customer',
//   email: orderDetails?.addressInfo?.email || orderDetails?.userId || 'customer@email.com',
//   address: orderDetails?.addressInfo ? 
//     `${orderDetails.addressInfo.address}, ${orderDetails.addressInfo.city}, ${orderDetails.addressInfo.state} ${orderDetails.addressInfo.pincode}` : 
//     'Customer Address',
//   phone: orderDetails?.addressInfo?.phone || 'N/A'
// };

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();


  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        {/* // Update Status form এর পরে এই button add করুন:
<div className="flex justify-between gap-2">
  <Button
    variant="outline"
    onClick={() => setShowBillGenerator(true)}
    className="flex items-center gap-2"
  >
    <Receipt className="w-4 h-4" />
    Generate Bill
  </Button>
</div>

// Component এর শেষে এই dialog add করুন:
<BillGenerator
  isOpen={showBillGenerator}
  onClose={() => setShowBillGenerator(false)}
  orderDetails={orderDetails}
  customerInfo={customerInfo}
/> */}

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;


// // components/admin-view/order-details.jsx
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "../ui/button";
// import CommonForm from "../common/form";
// import { DialogContent } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
// import { Badge } from "../ui/badge";
// import {
//   getAllOrdersForAdmin,
//   getOrderDetailsForAdmin,
//   updateOrderStatus,
// } from "@/store/admin/order-slice";
// import { useToast } from "../ui/use-toast";
// import BillGenerator from "./BillGenerator";
// import { Receipt } from "lucide-react";

// const initialFormData = {
//   status: "",
// };

// function AdminOrderDetailsView({ orderDetails }) {
//   const [formData, setFormData] = useState(initialFormData);
//   const [showBillGenerator, setShowBillGenerator] = useState(false);
  
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   // Customer info তৈরি করার function
//   const customerInfo = {
//     name: orderDetails?.addressInfo?.fullName || 'Walk-in Customer',
//     email: orderDetails?.addressInfo?.email || orderDetails?.userId || 'customer@email.com',
//     address: orderDetails?.addressInfo ? 
//       `${orderDetails.addressInfo.address}, ${orderDetails.addressInfo.city}, ${orderDetails.addressInfo.state} ${orderDetails.addressInfo.pincode}` : 
//       'Customer Address',
//     phone: orderDetails?.addressInfo?.phone || 'N/A'
//   };

//   function handleUpdateStatus(event) {
//     event.preventDefault();
//     const { status } = formData;

//     dispatch(
//       updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getOrderDetailsForAdmin(orderDetails?._id));
//         dispatch(getAllOrdersForAdmin());
//         setFormData(initialFormData);
//         toast({
//           title: data?.payload?.message,
//         });
//       }
//     });
//   }

//   return (
//     <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
//       <div className="grid gap-6">
//         {/* Order Information */}
//         <div className="grid gap-2">
//           <div className="flex mt-6 items-center justify-between">
//             <p className="font-medium">Order ID</p>
//             <Label>{orderDetails?._id}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Date</p>
//             <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Price</p>
//             <Label>${orderDetails?.totalAmount}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment method</p>
//             <Label>{orderDetails?.paymentMethod}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment Status</p>
//             <Label>{orderDetails?.paymentStatus}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Status</p>
//             <Label>
//               <Badge
//                 className={`py-1 px-3 ${
//                   orderDetails?.orderStatus === "confirmed"
//                     ? "bg-green-500"
//                     : orderDetails?.orderStatus === "rejected"
//                     ? "bg-red-600"
//                     : "bg-black"
//                 }`}
//               >
//                 {orderDetails?.orderStatus}
//               </Badge>
//             </Label>
//           </div>
//         </div>
        
//         <Separator />
        
//         {/* Order Items */}
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Order Details</div>
//             <ul className="grid gap-3">
//               {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
//                 ? orderDetails?.cartItems.map((item, index) => (
//                     <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                       <span>Title: {item.title}</span>
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Price: ${item.price}</span>
//                     </li>
//                   ))
//                 : null}
//             </ul>
//           </div>
//         </div>
        
//         {/* Shipping Info */}
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Shipping Info</div>
//             <div className="grid gap-0.5 text-muted-foreground">
//               <span>{orderDetails?.addressInfo?.fullName || user?.userName}</span>
//               <span>{orderDetails?.addressInfo?.address}</span>
//               <span>{orderDetails?.addressInfo?.city}</span>
//               <span>{orderDetails?.addressInfo?.pincode}</span>
//               <span>{orderDetails?.addressInfo?.phone}</span>
//               <span>{orderDetails?.addressInfo?.notes}</span>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         {/* Bill Generation Button */}
//         <div className="flex justify-between gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setShowBillGenerator(true)}
//             className="flex items-center gap-2"
//           >
//             <Receipt className="w-4 h-4" />
//             Generate Bill
//           </Button>
//         </div>

//         <Separator />

//         {/* Update Status Form */}
//         <div>
//           <CommonForm
//             formControls={[
//               {
//                 label: "Order Status",
//                 name: "status",
//                 componentType: "select",
//                 options: [
//                   { id: "pending", label: "Pending" },
//                   { id: "inProcess", label: "In Process" },
//                   { id: "inShipping", label: "In Shipping" },
//                   { id: "delivered", label: "Delivered" },
//                   { id: "rejected", label: "Rejected" },
//                   { id: "confirmed", label: "Confirmed" },
//                 ],
//               },
//             ]}
//             formData={formData}
//             setFormData={setFormData}
//             buttonText={"Update Order Status"}
//             onSubmit={handleUpdateStatus}
//           />
//         </div>
//       </div>

//       {/* Bill Generator Dialog */}
//       <BillGenerator
//         isOpen={showBillGenerator}
//         onClose={() => setShowBillGenerator(false)}
//         orderDetails={orderDetails}
//         customerInfo={customerInfo}
//       />
//     </DialogContent>
//   );
// }

// export default AdminOrderDetailsView;