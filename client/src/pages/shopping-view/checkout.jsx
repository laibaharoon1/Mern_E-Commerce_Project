import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

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
    if (!paymentMethod) {
      toast.error("Please select a payment method");
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
      paymentMethod,
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
        <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <h1 className="mb-5 text-2xl font-bold">Order summary</h1>
          {cartItemsArray.length > 0
            ? cartItemsArray.map((item) => (
                <UserCartItemsContent
                  cartItem={item}
                  key={item.productId?._id}
                />
              ))
            : <div className="py-10 text-center text-muted-foreground"><p>Your cart is empty.</p><Link className="mt-3 inline-block text-primary hover:underline" to="/shop/listing">Continue shopping</Link></div>}
          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-5 w-full">
            <fieldset className="mb-5">
              <legend className="mb-3 font-semibold">Payment method</legend>
              <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === "paypal" ? "border-primary bg-secondary" : "hover:bg-slate-50"}`}>
                <input
                  type="radio"
                  name="payment-method"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span className="font-medium">PayPal</span>
                <span className="text-sm text-muted-foreground">Secure online payment</span>
              </label>
            </fieldset>
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full"
              disabled={isPaymentStart || cartItemsArray.length === 0 || !paymentMethod}
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
