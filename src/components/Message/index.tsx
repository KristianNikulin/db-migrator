import React, { FC, ButtonHTMLAttributes } from "react";

import * as styles from "./styles.module.scss";
import classNames from "classnames";

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
