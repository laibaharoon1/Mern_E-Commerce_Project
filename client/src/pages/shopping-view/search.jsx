import ProductDetailsDialog from "@/components/shopping-view/products-details";
import ShoppingProductTile from "@/pages/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"; // Added
import { fetchProductDetails } from "@/store/shop/products-slice"; // Added
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // Added
  
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts); // Added
  const { user } = useSelector((state) => state.auth); // Added

  // FIX: Sync state with URL on initial load
  useEffect(() => {
    const query = searchParams.get("keyword");
    if (query) setKeyword(query);
  }, []);

  useEffect(() => {
    if (keyword && keyword.trim().length > 3) {
      const timer = setTimeout(() => {
        setSearchParams({ keyword });
        dispatch(getSearchResults(keyword));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSearchParams({}); // Clear URL if keyword is deleted
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  // Handle opening product details
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // Handle adding to cart from search results
  function handleAddToCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }

  // Open dialog when product details are fetched
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <Input
          value={keyword}
          name="keyword"
          onChange={(event) => setKeyword(event.target.value)}
          className="py-6"
          placeholder="Search Products..."
        />
      </div>
      
      {/* Logic to show "No results" if search is finished */}
      {!searchResults.length && keyword.trim().length > 3 ? (
        <h1 className="text-5xl font-extrabold text-center">No result found!</h1>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id}
            product={item}
            handleAddToCart={handleAddToCart} // Pass the function
            handleGetProductDetails={handleGetProductDetails} // Pass the function
          />
        ))}
      </div>

      {/* RENDER THE DIALOG HERE */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;