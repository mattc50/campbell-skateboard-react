import React from "react";
import styles from "./Modal.module.css";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const Modal = ({ setIsOpen, primary }) => {
  let [formName, setFormName] = useState('');

  function handleInput (e) {
    var val = e.target.value;
    setFormName(val);
    console.log(val);
  }

  return (
      <>
        <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
        <div className={styles.centered}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Save Colors</h5>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <RiCloseLine />
            </button>
            <div className={styles.modalContent}>
              Name and save your board!
            </div>
            <label className="form-name" htmlFor="form-name">Name</label>
            <input type="text" id="form-name" name="name" onInput={handleInput}></input>
            <div className="color-display">
              <p className="color-display-title">Colors:</p>
              <div className="swatch">
                <label className="swatch-label">Board:</label>
                <div className="swatch-face" style={{backgroundColor: primary}}></div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                <button className={styles.deleteBtn} onClick={() => setIsOpen(false)}>
                  Delete
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Modal;