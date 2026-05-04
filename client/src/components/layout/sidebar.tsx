import { type Dispatch, type SetStateAction } from "react";
import { Logout } from "../../features/auth/api/logout";
import { useAuth } from "../../context/authContext";
import { errorToast, successToast } from "../ui/CustomToasts";
import { useNavigate } from "react-router";

export const Sidebar = ({ isRetracted, setIsRetracted }: { isRetracted: boolean, setIsRetracted: Dispatch<SetStateAction<boolean>> }) => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        const { success } = await Logout();
        if (success) {
            setAuth(null);
            successToast("You have been logged out");
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } else {
            errorToast("An error occurred");
        }

    };

    return (
        <aside className={`h-screen bg-lime-100 fixed justify-center items-center flex flex-col transition-all ease-in-out duration-300 text-black ${isRetracted ? "w-24" : "w-56"}`}>
            <button
                onClick={() => {
                    setIsRetracted((prev) => !prev)
                    console.log(isRetracted)
                }}
            >Retract</button>
            <button
                onClick={handleLogout}
            >
                Logout
            </button>
        </aside>
    )
}