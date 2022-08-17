import React from "react";
import styles from "./Modal.module.css";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const SaveModal = ({ setIsOpen, brd, pri, sl, sec, nm, lnwk }) => {
  let [formName, setFormName] = useState('');

  function handleInput (e) {
    var val = e.target.value;
    setFormName(val);
    console.log(val);
  }
  

  function handleSubmit (e) {
    e.preventDefault();
    save(formName);
  }

  function save(nameEntry) {
    const presetCount = localStorage.getItem('preset-count');
    if(nameEntry === ''  || nameEntry.trim() === '' ) {
      nameEntry = "Preset " + presetCount;
    }
    setIsOpen(false);
    localStorage.getItem('preset-count');
    let presetName = 'preset' + presetCount;
    let preset = {
      [presetName]: 
        { 
          "name": nameEntry,
          "board-color": brd, 
          "primary-color": pri,
          "seal-color": sl,
          "secondary-color": sec,
          "name-color": nm,
          "linework-color": lnwk
        }
    };
    const stringified = JSON.stringify(preset);
    if(presetCount == 0) {
      localStorage.setItem('presets', stringified);
      console.log(stringified);
      console.log(JSON.parse(stringified))
    } else {
      const JSONstring = localStorage.getItem('presets');
      const addToStringified = JSONstring.slice(0, -1) + "," + stringified.slice (1);
      localStorage.setItem('presets', addToStringified);
      console.log(addToStringified);
      console.log(JSON.parse(addToStringified))
    }
    localStorage.setItem('preset-count', parseInt(presetCount) + 1);
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
            <form className="save-form">
              <div className="form-section">
                <label className="form-name" htmlFor="form-name">Name</label>
                <input type="text" id="form-name" name="name" value={formName} onInput={handleInput}></input>
              </div>
              <div className="form-section">
                <p className="color-display-title">Colors:</p>
                <div className="swatch">
                  <label className="swatch-label">Primary:</label>
                  <input type="hidden" value={pri}></input>
                  <div className="swatch-face" style={{backgroundColor: pri}}></div>
                </div>
                <div className="swatch">
                  <label className="swatch-label">Secondary:</label>
                  <input type="hidden" value={sec}></input>
                  <div className="swatch-face" style={{backgroundColor: sec}}></div>
                </div>
                <div className="swatch">
                  <label className="swatch-label">Name:</label>
                  <input type="hidden" value={nm}></input>
                  <div className="swatch-face" style={{backgroundColor: nm}}></div>
                </div>
                <div className="swatch">
                  <label className="swatch-label">Seal:</label>
                  <input type="hidden" value={sl}></input>
                  <div className="swatch-face" style={{backgroundColor: sl}}></div>
                </div>
                <div className="swatch">
                  <label className="swatch-label">Linework:</label>
                  <input type="hidden" value={lnwk}></input>
                  <div className="swatch-face" style={{backgroundColor: lnwk}}></div>
                </div>
                <div className="swatch">
                  <label className="swatch-label">Board:</label>
                  <input type="hidden" value={brd}></input>
                  <div className="swatch-face" style={{backgroundColor: brd}}></div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button type="button" className={styles.saveFormBtn}
                    onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveFormBtn} 
                    onClick={handleSubmit}>
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
  );
};

export default SaveModal;