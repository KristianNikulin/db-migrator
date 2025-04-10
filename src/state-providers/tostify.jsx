import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// https://fkhadra.github.io/react-toastify/api/toast
export const toastDefaultOptions = {
    hideProgressBar: false,
    position: "bottom-right",
    pauseOnHover: true,
};

export const Toastify = ({ children }) => {
    return (
        <>
            <ToastContainer {...toastDefaultOptions} />
            {children}
        </>
    );
};

export { toast };
