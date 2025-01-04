import React, { FC, ButtonHTMLAttributes } from "react";

import * as styles from "./styles.module.scss";
import classNames from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "default" | "failure" | "success" | "warning";
    disabled?: boolean;
    className?: string;
}

const Button: FC<ButtonProps> = ({
    children,
    onClick,
    type = "button",
    variant = "success",
    disabled = false,
    className = "",
    ...props
}) => {
    const buttonClass = classNames(styles.button, styles[variant], className);

    return (
        <button type={type} onClick={onClick} className={buttonClass} disabled={disabled} {...props}>
            {children}
        </button>
    );
};

export default Button;
