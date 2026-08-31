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
      className={`cursor-pointer border transition-all hover:border-primary hover:shadow-sm ${
        selectedId?._id === addressInfo?._id
          ? "border-primary bg-secondary ring-1 ring-primary"
          : "border-border"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-base font-bold">{addressInfo?.address}</Label>
          <Label className="text-muted-foreground">{addressInfo?.city}, {addressInfo?.pincode}</Label>
          <Label className="text-muted-foreground">{addressInfo?.phone}</Label>
          {addressInfo?.notes && (
            <Label className="italic text-muted-foreground">Notes: {addressInfo?.notes}</Label>
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