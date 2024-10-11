import { CloseIcon } from "../components";
import { PopupProps } from "../types";

export function InfoPopup(props: PopupProps) {
    return (
        <div className="info-popup">
            <div className="info-popup__inner">
                <CloseIcon
                    className="info-popup__close-icon"
                    onClick={() => {
                        props.onClose();
                    }}
                />

                <h1 className="info-popup__headline">Database SQL Migrator</h1>

                <div className="info-popup__body">
                    <h2>Description</h2>
                </div>
            </div>
        </div>
    );
}
