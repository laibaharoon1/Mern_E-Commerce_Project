import { Link } from "react-router-dom";
import { useState } from "react";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { toast } from "sonner"


const initialState = {
    email: '',
    password: ''
}

function AuthLogin() {

    const [formData, setFormData] = useState(initialState);
    const [loginAs, setLoginAs] = useState("user");
    const dispatch = useDispatch();

    function onSubmit(event) {
        event.preventDefault();

        dispatch(loginUser({ ...formData, requestedRole: loginAs })).then((data) => {
            if (data?.payload?.success) {
                toast(data?.payload?.message)
            } else {
                toast.error(data?.payload?.message);
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl fnt-bld tracking-tight text-foreground">Sign into your Account</h1>
                <p className="mt-2">Don't have an account
                    <Link className="font-medium ml-2 text-primary hover:underline"
                        to='/auth/register'> Register </Link>
                </p>
            </div>
            <div className="grid grid-cols-2 rounded-lg bg-secondary p-1">
                <button
                    type="button"
                    onClick={() => setLoginAs("user")}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${loginAs === "user" ? "bg-white shadow-sm" : "text-muted-foreground"}`}
                >
                    Customer
                </button>
                <button
                    type="button"
                    onClick={() => setLoginAs("admin")}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${loginAs === "admin" ? "bg-white shadow-sm" : "text-muted-foreground"}`}
                >
                    Administrator
                </button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
                {loginAs === "admin" ? "Use an account that has been assigned the admin role." : "Sign in to shop and manage your orders."}
            </p>
            <CommonForm
                formControls={loginFormControls}
                buttonText={'Sign In'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthLogin;
