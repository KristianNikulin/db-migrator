import React, { FC, ButtonHTMLAttributes } from "react";

import classNames from "classnames";
import styles from "./styles.module.scss";

interface MessageProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    message: string;
    variant: "error" | "warning";
}

const Message: FC<MessageProps> = ({ message, variant }) => {
    const messageClass = classNames(styles.message, variant === "error" ? styles.error : styles.warning);

    return (
        <div className={messageClass}>
            <p>⚠️ {message}</p>
        </div>
    );
};

export default Message;
