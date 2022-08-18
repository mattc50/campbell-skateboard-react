import React from "react";
import "./Modal.css";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const SaveModal = ({ brd, pri, sl, sec, nm, lnwk, isOtherOpen, setIsOtherOpen, setIsOpen }) => {
  if(isOtherOpen === true) {
    setIsOtherOpen(false);
  }
  
  let [formName, setFormName] = useState('');

  const localJSON = JSON.parse(localStorage.getItem('presets'));

  function handleInput (e) {
    var val = e.target.value;
    setFormName(val);
  }

  function handleSubmit (e) {
    e.preventDefault();
    save(formName);
  }

  function nameLogic (presetCount) {
    // check if key exists
    let presetName = 'preset' + presetCount;
    if (localJSON !== null && Object.keys(localJSON).indexOf(presetName) !== -1) {
      //if key doesn't exist, change presetCount
      //const maintainCount = presetCount; // maintain presetCount for future reference
      let decCount = presetCount; // modifiable copies of presetCount
      let incCount = presetCount;
      //decrement presetCount (decCount) until decCount is less than 0 or the key is empty
      let emptyKey = false;
      while (decCount >= 0 || emptyKey === false) {
        let tempPresetName = 'preset' + decCount;
        if (Object.keys(localJSON).indexOf(tempPresetName) === -1) {
          emptyKey = true;
          return decCount;
        }
        decCount --;
        
      }

      // if decCount <=0, increment presetCount (incCount) until an empty key is found 
      if (decCount <= 0) {
        while (emptyKey === false) {
          incCount ++;
          let tempPresetName = 'preset' + incCount;
          if (Object.keys(localJSON).indexOf(tempPresetName) === -1) {
            emptyKey = true;
          }
        }
      }
      return incCount;
    } else {
      return presetCount;
    }
  }

  function save(nameEntry) {
    const presetCount = localStorage.getItem('preset-count');
    let numForName = nameLogic(presetCount);
    if(nameEntry === ''  || nameEntry.trim() === '' ) {
      nameEntry = "Preset " + numForName;
    }
    setIsOpen(false);
    localStorage.getItem('preset-count');
    let presetName = 'preset' + numForName;
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
    } else {
      const JSONstring = localStorage.getItem('presets');
      const addToStringified = JSONstring.slice(0, -1) + "," + stringified.slice (1);
      localStorage.setItem('presets', addToStringified);
    }
    localStorage.setItem('preset-count', parseInt(presetCount) + 1);
  }

  return (
      <>
       <div className="dark-bg" onClick={() => setIsOpen(false)} />
        <div className={"centered"}>
          <div className={"modal"}>
            <div className={"modal-header"}>
              <h5 className={"heading"}>Save Colors</h5>
            </div>
            <button className={"close-btn"} onClick={() => setIsOpen(false)}>
              <RiCloseLine />
            </button>
            <div className={"modal-content"}>
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
              <div className={"modal-actions"}>
                <div className={"actions-container"}>
                  <button type="button" className={"save-form-btn"}
                    onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={"save-form-btn"} 
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