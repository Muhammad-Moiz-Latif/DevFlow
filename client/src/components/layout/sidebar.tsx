import { type Dispatch, type SetStateAction } from "react";

export const Sidebar = ({ isRetracted, setIsRetracted }: { isRetracted: boolean, setIsRetracted: Dispatch<SetStateAction<boolean>> }) => {

    return (
        <aside className={`h-screen bg-lime-100 fixed justify-center items-center flex transition-all ease-in-out duration-300 text-black ${isRetracted ? "w-24" : "w-56"}`}>
            <button
                onClick={() => {
                    setIsRetracted((prev) => !prev)
                    console.log(isRetracted)
                }}
            >Retract</button>
            This is the sidebar
        </aside>
    )
}