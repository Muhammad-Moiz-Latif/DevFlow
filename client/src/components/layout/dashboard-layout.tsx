import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { Outlet } from "react-router";

export const DashboardLayout = () => {
    const [isRetracted, setIsRetracted] = useState(false);
    return (
        <main className="max-w-screen min-h-screen">
            <Navbar isRetracted={isRetracted} />
            <Sidebar isRetracted={isRetracted} setIsRetracted={setIsRetracted} />
            <div className={`transition-all duration-300 pt-12 ${isRetracted ? "ml-24" : "ml-56"}`}>
                <Outlet />
            </div>
        </main>
    )
}