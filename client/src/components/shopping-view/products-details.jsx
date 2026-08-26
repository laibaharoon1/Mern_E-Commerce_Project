import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"; // Import your actions
import { toast } from "sonner"; // Ensure you are using Sonner
import { setProductDetails } from "@/store/shop/products-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();

  // 1. Get the current user from auth state
  const { user } = useSelector((state) => state.auth);

  function handleAddToCart(getCurrentProductId) {
    console.log(user?.id);
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast.success("Product added to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false)
    dispatch(setProductDetails())
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] overflow-y-auto max-h-[90vh]">

        <DialogHeader className="sr-only">
          <DialogTitle>{productDetails?.title || "Product Details"}</DialogTitle>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through text-muted-foreground text-xl' : ''}`}>
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-primary">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-muted-foreground">(4.5)</span>
          </div>
          <div className="mt-5 mb-5">
            <Button
              className="w-full"
              onClick={() => handleAddToCart(productDetails?._id)}
              disabled={productDetails?.totalStock === 0} // Optional: Disable if out of stock
            >
              {productDetails?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 mt-4">Reviews</h2>
            <div className="grid gap-6">
              {/* Existing Static Review */}
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>LB</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Laiba Beyg</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">This product is awesome!</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Input placeholder="Write a review....." />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
