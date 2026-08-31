import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems({ setOpenMobileMenu }) {
  const navigate = useNavigate();

  function handleNavigate(getCurrentMenuItem) {
    if (getCurrentMenuItem.id === "products") sessionStorage.removeItem("filters");

    if (setOpenMobileMenu) {
      setOpenMobileMenu(false);
    }

    navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="mb-3 flex flex-col gap-2 lg:mb-0 lg:flex-row lg:items-center lg:gap-1">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <span
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary"
        >
          {menuItem.label}
        </span>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shoppingCart);
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [];

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      {/* 
        FIX: Removed the nested SheetContent from here.
        UserCartWrapper already has its own SheetContent inside it.
        We just open the Sheet and pass cartItems directly to UserCartWrapper.
      */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative rounded-full shadow-sm"
        >
          <ShoppingCart className="w-6 h-6" />
          {/* FIX: Badge now correctly reads cartItemsArray.length */}
          <span className="absolute top-[-5px] right-[2px] font-bold text-xs bg-red-600 text-white rounded-full px-1 min-w-[18px] h-5 flex items-center justify-center">
            {cartItemsArray.length}
          </span>
          <span className="sr-only">User cart</span>
        </Button>

        {/* FIX: UserCartWrapper brings its own SheetContent — no wrapper needed here */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItemsArray}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.username ? user.username[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56 bg-white">
          <DropdownMenuLabel>Logged in as {user?.username || "User"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2 rounded-md font-bold transition-opacity hover:opacity-80">
          <span className="rounded-md bg-primary p-1.5 text-primary-foreground"><House className="h-4 w-4" /></span>
          <span>Ecommerce</span>
        </Link>

        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Access categories and account settings.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col h-full py-6">
              <MenuItems setOpenMobileMenu={setOpenMobileMenu} />
              <div className="mt-6 border-t pt-6">
                <HeaderRightContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          {isAuthenticated ? <HeaderRightContent /> : null}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
