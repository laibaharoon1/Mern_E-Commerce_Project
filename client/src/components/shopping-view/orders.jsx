import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId } from "@/store/shop/order-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ShoppingOrders() {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    dispatch(getAllOrdersByUserId());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader><CardTitle>My Orders</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {orderList.length ? orderList.map((order) => (
          <div key={order._id} className="flex flex-wrap justify-between gap-2 border-b pb-3">
            <span>{order._id}</span>
            <span>{order.orderStatus}</span>
            <span>${order.totalAmount}</span>
          </div>
        )) : <p>No orders yet.</p>}
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
