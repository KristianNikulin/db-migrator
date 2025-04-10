import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";

import styles from "./styles.module.scss";

const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    children,
    leftBtnText,
    rightBtnText,
    isLeftBtnDisabled = false,
    isRightBtnDisabled = false,
    isCentered = false,
    width = "",
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={!!width ? { width: width } : {}}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.content} style={isCentered ? { display: "flex", justifyContent: "center" } : {}}>
                    {children}
                </div>
                <div className={styles.footer}>
                    <Button disabled={isLeftBtnDisabled} style={{ width: "100%" }} variant="failure" onClick={onClose}>
                        {leftBtnText}
                    </Button>
                    <Button
                        disabled={isRightBtnDisabled}
                        style={{ width: "100%" }}
                        variant="success"
                        onClick={onConfirm}
                    >
                        {rightBtnText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;
