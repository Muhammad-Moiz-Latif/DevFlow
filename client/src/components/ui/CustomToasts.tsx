import toast from "react-hot-toast";

const toastStyles = {
    style: {
        background: "oklch(0.20 0.013 270)",
        color: "oklch(0.96 0.005 270)",
        border: "1px solid oklch(0.27 0.013 270)",
        borderRadius: "8px",
        padding: "13px 16px",
        fontSize: "13.5px",
        fontWeight: "500",
        boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        maxWidth: "360px",
    },
};

export const successToast = (message: string) => {
    toast.success(message, {
        ...toastStyles,
        iconTheme: {
            primary: "oklch(0.68 0.16 150)",
            secondary: "oklch(0.20 0.013 270)",
        },
    });
};

export const errorToast = (message: string) => {
    toast.error(message, {
        ...toastStyles,
        iconTheme: {
            primary: "oklch(0.62 0.22 25)",
            secondary: "oklch(0.20 0.013 270)",
        },
    });
};