import React from "react";
import styles from "../styles/overlay.module.css";

const Overlay = ({ isOpen, onClose, children }) => {
  return isOpen ? (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className="w-full lg:w-1/2 max-h-[80%]  overflow-auto bg-slate-600 p-[4px] rounded-lg md:w-2/3"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default Overlay;
