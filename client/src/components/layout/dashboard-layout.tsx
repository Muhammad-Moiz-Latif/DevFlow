import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { Outlet } from "react-router";

export const DashboardLayout = () => {
    const [isRetracted, setIsRetracted] = useState(false);

    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden">
            {/* Ambient drafting grid — ties every screen back to the same sheet as the landing page */}
            <div
                className="fixed inset-0 -z-10 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                        linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Viewport registration marks — persist across navigation */}
            {[
                "top-3 left-3 border-t border-l",
                "top-3 right-3 border-t border-r",
                "bottom-3 left-3 border-b border-l",
                "bottom-3 right-3 border-b border-r",
            ].map((pos) => (
                <div
                    key={pos}
                    className={`fixed ${pos} size-2.5 border-primary/30 -z-10 pointer-events-none`}
                />
            ))}

            <Navbar isRetracted={isRetracted} />
            <Sidebar isRetracted={isRetracted} setIsRetracted={setIsRetracted} />

            <main className={`transition-all duration-300 pt-14 min-h-screen ${isRetracted ? "ml-24" : "ml-56"}`}>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
};