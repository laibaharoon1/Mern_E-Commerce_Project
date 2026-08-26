import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10 flex flex-col items-center justify-center max-w-md mx-auto mt-20">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl text-green-600 font-extrabold mb-4">
          Payment Successful!
        </CardTitle>
      </CardHeader>
      <p className="text-lg text-center text-muted-foreground mb-6">
        Thank you for your purchase. Your order has been confirmed and is being processed.
      </p>
      <Button 
        className="w-full py-6 text-lg" 
        onClick={() => navigate("/shop/account")}
      >
        View Your Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;