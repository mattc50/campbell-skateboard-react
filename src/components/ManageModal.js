import React from "react";
import styles from "./Modal.module.css";
import { RiCloseLine, RiFileUploadFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const ManageModal = ({ setIsOpen }) => {
  const elementSections = ["board", "primary", "seal", "secondary", "name", "linework"];
  const localJSON = JSON.parse(localStorage.getItem('presets'));
  let keysArray = [];
  if(localJSON != null) {
    for (var key of Object.keys(localJSON)) {
      keysArray.push(key);
    }
  }
  let [keySize, setKeySize] = useState(keysArray.length);

  /*useEffect(() => {
    // This code only fires on length change
  }, [keysArray.length]);*/



  function loadPreset (chosenPreset) {
    let pri = localJSON[chosenPreset]['primary-color'];
    let sec = localJSON[chosenPreset]['secondary-color'];
    let nm = localJSON[chosenPreset]['name-color'];
    let sl = localJSON[chosenPreset]['seal-color'];
    let lnwk = localJSON[chosenPreset]['linework-color'];
    let brd = localJSON[chosenPreset]['board-color'];
    let colorArray = [brd, pri, sl, sec, nm, lnwk];
    for (let i = 0; i < colorArray.length; i++) {
      changeStyles (elementSections[i], colorArray[i])
    }
    setIsOpen(false);
  }

  function deletePreset (chosenPreset, keySize) {
    const count = localStorage.getItem('preset-count');
    const subCount = parseInt(count) - 1;
    let JSONtoModify = localJSON;
    delete JSONtoModify[chosenPreset];
    let stringifyNew = JSON.stringify(JSONtoModify);
    localStorage.setItem('presets', stringifyNew);
    localStorage.setItem('preset-count', subCount);
    setKeySize(keySize - 1);
  }

  function changeStyles (cls, color) {
    const clsName = "." + cls;
    const els = document.querySelectorAll(clsName);
    els.forEach(el => {
      el.style.fill = color;
    });
  }

  function renderPresets (keysArray) {
    if(keysArray.length == 0) return <p className="no-presets">You have no presets.</p>
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
              Load some colors!
            </div>
            <div className="presets">
              {renderPresets(keysArray)};
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
                        <div className="load" onClick={() => loadPreset(key)}>
                          <RiFileUploadFill />
                        </div>
                        <div className="delete" onClick={() => deletePreset(key, keySize)}>
                          <FaTrash />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            {/*document.querySelectorAll(".load").forEach(el => el.addEventListener("click", loadPreset(key)))*/};
          </div>
        </div>
        </div>
      </>
  );
};

export default ManageModal;