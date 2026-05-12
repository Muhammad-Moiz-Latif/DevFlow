import { Bell, Search, Settings, User } from "lucide-react";

export const Navbar = ({ isRetracted }: { isRetracted: boolean }) => {
    return (
        <nav className={`fixed top-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-border/60 transition-all duration-300 ${isRetracted ? "left-24" : "left-56"}`}>
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-xs">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="w-full h-9 pl-9 pr-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 ml-6">
                    <button className="p-2 hover:bg-surface transition-colors rounded-md text-muted-foreground hover:text-foreground group relative">
                        <Bell className="size-5" />
                        <span className="absolute top-1 right-1 size-2 bg-primary rounded-full" />
                    </button>

                    <button className="p-2 hover:bg-surface transition-colors rounded-md text-muted-foreground hover:text-foreground">
                        <Settings className="size-5" />
                    </button>

                    <div className="w-px h-6 bg-border/40 mx-1" />

                    <button className="p-2 hover:bg-surface transition-colors rounded-md text-muted-foreground hover:text-foreground">
                        <User className="size-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};