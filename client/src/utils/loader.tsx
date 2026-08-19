import loader from "./../assets/sync.png";

export const GeneralLoader = ({ label }: { label: string }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75">
            {/* Drafting grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Registration marks — primary */}
            {[
                "top-5 left-5 border-t border-l",
                "top-5 right-5 border-t border-r",
                "bottom-5 left-5 border-b border-l",
                "bottom-5 right-5 border-b border-r",
            ].map((pos) => (
                <div
                    key={pos}
                    className={`absolute ${pos} size-2.5 border-primary/50`}
                />
            ))}

            {/* Plate */}
            <div className="relative flex flex-col items-center gap-5 px-8 py-7 border border-border/70 bg-card/90">
                {/* Annotation */}
                <div className="inline-flex items-center gap-3 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                    <span className="w-4 h-px bg-border" />
                    Fig. 09 — Loading
                    <span className="w-4 h-px bg-border" />
                </div>

                {/* Spinner + label */}
                <div className="flex items-center gap-4">
                    {/* Primary-accented spinner frame */}
                    <div className="size-10 border border-primary/40 flex items-center justify-center">
                        <img
                            src={loader}
                            alt=""
                            className="size-5 object-contain opacity-80 animate-spin"
                            style={{ animationDuration: "1.4s" }}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-medium tracking-tight text-foreground/90">
                            {label}
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.12em] text-primary/70 uppercase">
                            Please wait
                        </span>
                    </div>
                </div>

                {/* Scale bar — primary ticks */}
                <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-end gap-0.5">
                        {Array.from({ length: 11 }).map((_, i) => (
                            <span
                                key={i}
                                className={"bg-muted-foreground/30"}
                                style={{
                                    width: "1px",
                                    height: i % 4 === 0 ? "9px" : i % 2 === 0 ? "5px" : "3px",
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-[8px] font-mono tracking-[0.18em] text-muted-foreground/50 uppercase">
                        Initializing
                    </span>
                </div>
            </div>
        </div>
    );
};