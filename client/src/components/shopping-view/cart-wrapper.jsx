import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  // Calculate the total amount
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.productId?.salePrice > 0
              ? currentItem?.productId?.salePrice
              : currentItem?.productId?.price || 0) *
              (currentItem?.quantity || 0),
          0
        )
      : 0;

  return (
    <SheetContent className="w-full max-w-[480px] bg-white p-6 sm:max-w-[480px]">
      <SheetHeader className="border-b px-0 pb-4">
        <SheetTitle className="text-xl">Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent key={item.productId?._id} cartItem={item} />
            ))
          : <p className="py-10 text-center text-muted-foreground">Your cart is empty.</p>}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="mt-5 w-full"
        disabled={!cartItems?.length}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
