import { CloseIcon } from "../components";
import { DatabaseMenuPopupProps } from "../types";
import databases from "../../../config/databases";

export function DatabaseMenuPopup(props: DatabaseMenuPopupProps) {
    const databaseHref = (databaseName: string) => {
        if (process.env.NODE_ENV === "production") {
            return `/sql_schema_visualizer/databases/${databaseName}`;
        } else {
            return `/databases/${databaseName}`;
        }
    };

    return (
        <div className="info-popup">
            <div className="info-popup__inner">
                <CloseIcon
                    className="info-popup__close-icon"
                    onClick={() => {
                        props.onClose();
                    }}
                />

                <div className="info-popup__body">
                    {Object.keys(databases).map((databaseName) => {
                        return (
                            <div key={databaseName}>
                                <h3 className="info-popup__database-name">
                                    {/* design_notes/0001_using_regular_links.md */}
                                    <a href={databaseHref(databaseName)}>{databases[databaseName].name}</a>
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
