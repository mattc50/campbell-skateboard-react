import React from "react";
import styles from "./Modal.module.css";
import { useState } from "react";
import { RiCloseLine, RiFileUploadFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";

const Modal = ({ setIsOpen, brd, pri, sl, sec, nm, lnwk }) => {
  let [formName, setFormName] = useState('');

  function handleInput (e) {
    var val = e.target.value;
    setFormName(val);
    console.log(val);
  }
  

  function handleSubmit (e) {
    e.preventDefault();
    //save(formName);
  }

  const localJSON = JSON.parse(localStorage.getItem('presets'));
  //console.log(localJSON.keys);
  let keysArray = [];
  for (var key of Object.keys(localJSON)) {
    //console.log(key);
    keysArray.push(key);
  }
  //console.log(keysArray);

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
              Load some colors!
            </div>
            {keysArray.map((key, index) => {
            return (
              <li className="preset-container" key={index}>
                <p className="preset-title">{localJSON[key].name}</p>
                <div className="preset-body">
                  <div className="colors-set">
                    <div className="load-swatch" style={{backgroundColor: localJSON[key]['primary-color']}}></div>
                    <div className="load-swatch" style={{backgroundColor: localJSON[key]['secondary-color']}}></div>
                    <div className="load-swatch" style={{backgroundColor: localJSON[key]['name-color']}}></div>
                    <div className="load-swatch" style={{backgroundColor: localJSON[key]['seal-color']}}></div>
                    <div className="load-swatch" style={{backgroundColor: localJSON[key]['linework-color']}}></div>
                    <div className="load-swatch" style={{backgroundColor: localJSON[key]['board-color']}}></div>
                  </div>
                  <div className="icon-container">
                    <RiFileUploadFill />
                    <FaTrash />
                  </div>
                </div>
              </li>
            );
          })}
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button type="button" className={styles.saveFormBtn}
                onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.saveFormBtn} 
                onClick={handleSubmit}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default Modal;