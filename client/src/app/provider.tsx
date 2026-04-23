import { RouterProvider } from "react-router"
import { router } from "./router"

export const CustomProvider = () => {
    return (
        <RouterProvider router={router} />
    )
}