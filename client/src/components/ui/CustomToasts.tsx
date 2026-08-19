import toast from "react-hot-toast";

const baseStyle: React.CSSProperties = {
    background: "oklch(0.18 0.012 270)",
    color: "oklch(0.95 0.005 270)",
    border: "1px solid oklch(0.28 0.012 270)",
    borderRadius: "4px",                 // sharper, less soft
    padding: "11px 14px",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "none",                   // no soft glow
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "340px",
    letterSpacing: "-0.01em",
};

export const successToast = (message: string) => {
    toast.success(message, {
        style: baseStyle,
        iconTheme: {
            primary: "oklch(0.70 0.15 155)",   // calm green
            secondary: "oklch(0.18 0.012 270)",
        },
        duration: 3200,
    });
};

export const errorToast = (message: string) => {
    toast.error(message, {
        style: {
            ...baseStyle,
            borderColor: "oklch(0.45 0.12 25 / 0.5)", // subtle red edge
        },
        iconTheme: {
            primary: "oklch(0.62 0.20 25)",
            secondary: "oklch(0.18 0.012 270)",
        },
        duration: 4200,
    });
};

// Optional: info / neutral toast if you need it later
export const infoToast = (message: string) => {
    toast(message, {
        style: baseStyle,
        icon: "·",                         // minimal mark
        duration: 3000,
    });
};