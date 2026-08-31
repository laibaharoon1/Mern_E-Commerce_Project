import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { categoryOptionsMap, brandOptionsMap } from "@/config";
// import { useToast } from "../ui/use-toast"; 


function ShoppingProductTile({ product, handleGetProductDetails, handleAddToCart, user }) {
  return (
    <Card className="group mx-auto flex h-full w-full max-w-sm cursor-pointer flex-col overflow-hidden border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div onClick={() => handleGetProductDetails(product?._id)} >
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-[280px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="flex flex-1 flex-col p-5">
          <h2 className="mb-3 line-clamp-1 text-lg font-bold">{product?.title}</h2>
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="pt-0">
        <Button onClick={() => handleAddToCart(product?._id, user?.id)} className="w-full shadow-sm">
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
