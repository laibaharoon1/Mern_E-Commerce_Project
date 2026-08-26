import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";


function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateQuantity(typeOfAction) {
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: cartItem?.productId?._id,
        quantity:
          typeOfAction === "plus"
            ? cartItem?.quantity + 1
            : cartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item updated successfully");
      }
    });
  }

// 1. Pass 'event' into the function
function handleCartItemDelete(event) {
  event.stopPropagation(); // Stops the click from triggering parent redirects

  dispatch(
    deleteCartItem({ 
      userId: user?.id, 
      productId: cartItem?.productId._id // Usually just .productId, double check your Redux state
    })
  ).then((data) => {
    if (data?.payload?.success) {
      // 2. Using Sonner style (since you have the Sonner Toaster installed)
      toast.success("Cart item deleted successfully");
    }
  });
}

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <img
        src={cartItem?.productId?.image}
        alt={cartItem?.productId?.title}
        className="h-20 w-20 shrink-0 rounded-md object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.productId?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity("minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity("plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.productId?.salePrice > 0
              ? cartItem?.productId?.salePrice
              : cartItem?.productId?.price) * cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={(event) => handleCartItemDelete(event)}
          className="cursor-pointer mt-1 text-red-600"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
