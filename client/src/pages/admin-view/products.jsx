import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment, useState } from "react";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch } from "react-redux";
import { addnewproduct, fetchAllProducts, deleteProduct, editProduct } from "@/store/admin/products-slice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner"
import AdminProductTile from "@/components/admin-view/product-tile";


const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: ''
}

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const { productList } = useSelector(state => state.adminProducts)
    const dispatch = useDispatch()

    function handleDelete(getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
                // Optional: Add a success toast here
            }
        });
    }

    function onSubmit(event) {
        event.preventDefault();

        currentEditedId !== null
            ? dispatch(
                editProduct({
                    id: currentEditedId,
                    formData,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                }
            })
            : dispatch(
                addnewproduct({
                    ...formData,
                    image: uploadedImageUrl,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    // Add toast success message here
                }
            });
    }

    function isFormValid(){
        return Object.keys(formData)
        .map(key=> formData[key] !== '')
        .every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])

    console.log(productList, "productList");

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>
                    Add New Product
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {productList && productList.length > 0
                    ? productList.map((productItem) => (
                        <AdminProductTile
                            key={productItem._id}
                            setFormData={setFormData}
                            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                            setCurrentEditedId={setCurrentEditedId}
                            product={productItem}
                            handleDelete={handleDelete}
                        />
                    ))
                    : null
                }
            </div>
            <Sheet open={openCreateProductsDialog}
                onOpenChange={() => {
                    setOpenCreateProductsDialog(false)
                    setCurrentEditedId(null)
                }}>
                <SheetContent side="right" className="overflow-auto bg-white p-6"> {/* Added p-6 here */}
                    <SheetHeader>
                        <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
                        <SheetDescription>Enter product details to create a new item.</SheetDescription>
                    </SheetHeader>
                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                        setCurrentEditedId={setCurrentEditedId}
                    />
                    <div className="py-6 px-2">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            formControls={addProductFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}
export default AdminProducts;

