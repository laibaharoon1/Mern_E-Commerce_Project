import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";

// Components
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";

// Assets
import img from "../../assets/account.jpg";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [];

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();

  // FIX: use cartItemsArray everywhere instead of cartItems directly
  const totalCartAmount =
    cartItemsArray.length > 0
      ? cartItemsArray.reduce(
          (sum, item) =>
            sum +
            (item?.productId?.salePrice > 0
              ? item?.productId?.salePrice
              : item?.productId?.price) *
              item?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItemsArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select an address");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartItems: cartItemsArray.map((item) => ({
        productId: item?.productId?._id,
        title: item?.productId?.title,
        image: item?.productId?.image,
        price:
          item?.productId?.salePrice > 0
            ? item?.productId?.salePrice
            : item?.productId?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <img src={img} alt="Checkout" className="h-full w-full object-cover object-center" />
      </div>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h1 className="mb-5 text-2xl font-bold">Order summary</h1>
          {cartItemsArray.length > 0
            ? cartItemsArray.map((item) => (
                <UserCartItemsContent
                  cartItem={item}
                  key={item.productId?._id}
                />
              ))
            : <p className="py-8 text-center text-muted-foreground">Your cart is empty.</p>}
          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-5 w-full">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full"
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
