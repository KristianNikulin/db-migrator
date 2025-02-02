import React from "react";
import PropTypes from "prop-types";
import * as styles from "./styles.module.scss";
import Button from "../Button";

const Modal = ({ isOpen, onClose, onConfirm, children, leftBtnText, rightBtnText }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.content}>{children}</div>
                <div className={styles.footer}>
                    <Button variant="failure" onClick={onClose}>
                        {leftBtnText}
                    </Button>
                    <Button variant="success" onClick={onConfirm}>
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
