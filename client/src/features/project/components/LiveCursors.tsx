export const LiveCursors = ({ combinedUsers, currentSocketId }: { combinedUsers: any, currentSocketId: string }) => {
    console.log(combinedUsers)
    return (
        <>
            {combinedUsers.map((user: any) => {

                // 1. Don't render a fake cursor for the person actually moving the mouse
                if (user.socketId === currentSocketId) return null;

                return (
                    <div
                        key={user.socketId}
                        style={{
                            // 2. Take the element out of the normal document flow
                            position: "fixed",
                            top: `${user.y}px`,
                            left: `${user.x}px`,

                            // 3. Nudge the pointer so the visible tip sits on the actual coordinates
                            transform: "translate(-2px, -32px)",

                            // 4. Smooth out the movement so it glides instead of jumping
                            transition: "transform 0.1s linear",

                            // 5. CRITICAL: Prevent the fake cursor from blocking real clicks!
                            pointerEvents: "none",

                            zIndex: 9999,
                        }}
                        className="flex flex-col items-center"
                    >
                        {/* The actual cursor shape */}
                        <svg
                            width="24"
                            height="36"
                            viewBox="0 0 24 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                                fill="black"
                            />
                        </svg>

                        {/* The user's name badge underneath the cursor */}
                        <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-md shadow-md mt-1">
                            {user.username}
                        </div>
                    </div>
                );
            })}
        </>
    );
};