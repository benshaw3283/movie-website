import React from "react";
import styles from "../styles/overlay.module.css";

const Overlay = ({ isOpen, onClose, type, children }) => {
  return isOpen ? (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={
          type === "review"
            ? "w-full lg:w-1/2 max-h-[80%]  overflow-auto bg-slate-600 p-[4px] rounded-lg md:w-2/3"
            : "w-20 h-20 overflow-auto"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default Overlay;
