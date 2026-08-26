import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
    return(
        <div className="flex flex-col bg-white overflow-hidden">
        {/*common Header*/}
        <ShoppingHeader />
        <main className="flex flex-1 flex-col">
            <Outlet />
        </main>
    </div>
    )
    
}

export default ShoppingLayout;