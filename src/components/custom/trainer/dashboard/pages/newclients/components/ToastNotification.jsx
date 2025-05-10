import { Icon } from "@iconify/react";

export const ToastNotification = ({ show, message, type = "success" }) => {
    if (!show) return null;

    const bgColors = {
        success: "bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/20",
        error: "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/20",
        info: "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/20",
    };

    const icons = {
        success: "mdi:check-circle",
        error: "mdi:alert-circle",
        info: "mdi:information",
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className={`${bgColors[type]} text-white px-5 py-2.5 rounded-lg shadow-xl flex items-center gap-2`}>
                <Icon icon={icons[type]} className="text-white" width={18} height={18} />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
};

export default ToastNotification;
