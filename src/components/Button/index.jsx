import React from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import styles from "./styles.module.scss";

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
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

Button.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    variant: PropTypes.oneOf(["primary", "failure", "success"]),
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

export default Button;
