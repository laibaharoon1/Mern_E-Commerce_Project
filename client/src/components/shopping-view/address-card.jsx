import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[2px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="font-bold text-lg">Address: {addressInfo?.address}</Label>
          <Label className="text-gray-600">City: {addressInfo?.city}</Label>
          <Label className="text-gray-600">Pincode: {addressInfo?.pincode}</Label>
          <Label className="text-gray-600">Phone: {addressInfo?.phone}</Label>
          {addressInfo?.notes && (
            <Label className="text-gray-400 italic">Notes: {addressInfo?.notes}</Label>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering the Card's onClick
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button 
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering the Card's onClick
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;