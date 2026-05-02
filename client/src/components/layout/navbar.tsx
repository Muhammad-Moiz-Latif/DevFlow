
export const Navbar = ({ isRetracted }: { isRetracted: boolean }) => {

    return (
        <nav className={`fixed top-0 right-0 h-12 bg-pink-200 transition-all duration-300 ${isRetracted ? "left-24" : "left-56"}`}>
            <li>some</li>
        </nav>
    )
}