import AdminHeader from "./header";
import AdminSidebar from "./sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function AdminLayout() {

    const[ openSidebar, setOpenSidebar ]= useState(false)
    return (
        <div className="flex min-h-screen w-full">
            {/*Admin Sidebar*/}
            <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
            <div className="flex flex-1 flex-col">
                {/*Admin Header*/}
                <AdminHeader setOpen={setOpenSidebar}/>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;