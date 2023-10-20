import React from "react";
import styles from "../styles/overlay.module.css";

const Overlay = ({ isOpen, onClose, children }) => {
  return isOpen ? (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.overlayContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default Overlay;
