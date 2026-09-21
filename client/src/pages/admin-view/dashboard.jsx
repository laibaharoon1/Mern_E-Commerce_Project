import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, Package, ShoppingCart, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

function MetricCard({ label, value, icon: Icon, hint }) {
  return (
    <Card className="border bg-white py-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className="rounded-xl bg-secondary p-3 text-primary"><Icon className="h-6 w-6" /></span>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const products = productList || [];
  const orders = orderList || [];
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const revenue = paidOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
  const pendingOrders = orders.filter((order) => order.orderStatus === "pending").length;
  const lowStockProducts = products.filter((product) => Number(product.totalStock) <= 5);

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">A quick view of your store’s current activity.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Products" value={products.length} icon={Package} hint="Active catalog items" />
          <MetricCard label="Orders" value={orders.length} icon={ShoppingCart} hint={`${pendingOrders} pending`} />
          <MetricCard label="Paid revenue" value={`$${revenue.toFixed(2)}`} icon={DollarSign} hint="Confirmed payments" />
          <MetricCard label="Low stock" value={lowStockProducts.length} icon={TriangleAlert} hint="5 units or fewer" />
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <Card className="bg-white shadow-sm">
            <CardHeader><CardTitle>Recent orders</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {orders.length ? orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0"><p className="truncate font-medium">#{order._id}</p><p className="text-sm text-muted-foreground">{order.orderStatus || "pending"}</p></div>
                  <span className="font-semibold">${Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              )) : <p className="py-8 text-center text-muted-foreground">No orders yet.</p>}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader><CardTitle>Low-stock products</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {lowStockProducts.length ? lowStockProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <p className="min-w-0 truncate font-medium">{product.title}</p>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-sm font-medium">{product.totalStock} left</span>
                </div>
              )) : <p className="py-8 text-center text-muted-foreground">All products have healthy stock.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
