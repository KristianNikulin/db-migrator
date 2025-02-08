import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import styles from "./styles.module.scss";

const Select = ({
    id,
    label = "",
    options,
    value,
    onChange,
    renderOption,
    renderValue,
    placeholder = "",
    disabled,
    style = {},
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const formContext = useFormContext();
    const isInsideForm = id && formContext;
    const { setValue, watch } = formContext || {};

    const selectedValue = isInsideForm ? watch(id) : value;

    const handleSelect = (selectedValue) => {
        if (isInsideForm) {
            setValue(id, selectedValue, { shouldDirty: true });
        } else {
            onChange(selectedValue);
        }
        setIsDropdownOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {label && <label style={{ cursor: "default" }}>{label}:</label>}
            <div ref={dropdownRef} className={styles.dropdown} style={style}>
                <button
                    disabled={disabled}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={styles.button}
                    style={disabled ? { color: "gray", cursor: "default" } : {}}
                >
                    <span className={styles.buttonText}>
                        {selectedValue ? renderValue(selectedValue) : placeholder}
                    </span>
                    <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ""}`}>
                        ▼
                    </span>
                </button>
                {isDropdownOpen && (
                    <ul className={styles.menu}>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={styles.menuItem}
                            >
                                {renderOption(option)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Select;
