import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg"; // Ensure this image exists in your assets
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account Banner"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            My Account
          </h1>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8 px-4 md:px-6">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="orders" className="text-lg">Orders</TabsTrigger>
              <TabsTrigger value="address" className="text-lg">Address</TabsTrigger>
            </TabsList>

            {/* Orders Content */}
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>

            {/* Address Content */}
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
