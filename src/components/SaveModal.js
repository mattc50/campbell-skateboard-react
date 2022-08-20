import React from "react";
import "./Modal.css";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const SaveModal = ({ brd, pri, sl, sec, nm, lnwk, isOtherOpen, setIsOtherOpen, setIsOpen }) => {
  //  uses the isOtherOpen prop to check if the "presets" Modal is open (if isOtherOpen is true).
  //  if it is, the function passed by the setIsOtherOpen prop is called to set isOtherOpen to false (closing the "presets" Modal).
  const currCount = localStorage.getItem('preset-count');

  if(isOtherOpen === true) {
    setIsOtherOpen(false);
  }
  
  //  initializes the state of formName, which is used to track the input for the name the user assigns to the preset.
  let [formName, setFormName] = useState('');

  //  parses the stringified JSON in the presets key stored in local storage and stores it in variable localJSON.
  const localJSON = JSON.parse(localStorage.getItem('presets'));

  //  handler function for when the value of the name input changes, saving the user's name input with each keystroke.
  function handleInput (e) {
    //  the value of the name input (e.target.value) is stored in variable val.
    var val = e.target.value;
    //  formName is set to val through the setter function.
    setFormName(val);
  }

  //  handler function triggered when the user clicks the "save" button of the saving form.
  function handleSubmit (e) {
    e.preventDefault();
    //  the save function is called, passing formName as an argument.
    save(formName);
  }

  //  facilitates the number assigned to preset keys.
  //  this was developed for cases where multiple presets are saved and a preset that isn't the last of the list gets removed.
  //  it increments/decrements the preset number to create a key and find the preset that was removed.
  //  it will either return a key that fills a previously-created key, or a key that follows the numerically-ascending key order.
  //  example: if a user makes preset0, preset1, and preset2, then deletes preset1, this function will ensure that the next preset is given a key of preset1.
  //           if another preset is then saved, it will be given a key of preset3.
  //  this ultimately makes sure that presets always have a unique key for the JSON object, preventing buggy overriding cases.
  function nameLogic (presetCount) {
    //  builds an initial preset key (presetName) containing the passed preset count (presetCount).
    let presetName = 'preset' + presetCount;

    //  the following logic is performed in the case that localJSON exists (that the user has saved presets already) and a preset with the key presetName exists.
    //  this won't hold true in cases where, for example: 
    //  --  preset0, preset1, and preset2 are created, with preset1 being deleted, leaving just preset0 and preset2.
    //  --  the number of presets is 2 (preset0, preset2), but a preset key using the preset count (thus a key of preset2) exists.
    if (localJSON !== null && Object.keys(localJSON).indexOf(presetName) !== -1) {
      //  the following 2 variables are modifiable copies of presetCount; one will be decremented, and 1 will be incremented.
      let decCount = presetCount;
      let incCount = presetCount;
      
      //  has a default value of false (the key is not empty); is to be changed to true if an empty key is found.
      let emptyKey = false;

      //  decCount will be decremented as long as it is at least 0 or no empty key is found.
      while (decCount >= 0 || emptyKey === false) {
        //  for each decrement, a new preset key is composed using the new count value.
        let tempPresetName = 'preset' + decCount;
        //  checks if the new preset key doesn't exist in localJSON (this would be the case if a preset that wasn't the last in the list was removed).
        //  if it is true (the preset key doesn't exist in localJSON), emptyKey is set to true (indicating that an empty key has been found) and decCount is returned.
        if (Object.keys(localJSON).indexOf(tempPresetName) === -1) {
          emptyKey = true;
          return decCount;
        }
        //  if the key with the current decCount number exists, decCount is decremented.
        decCount --;
      }

      // this will run if decCount has been decremented to 0 or less.
      if (decCount <= 0) {
        //  will run as long as an empty key is not found.
        while (emptyKey === false) {
          //  since incCount will be equal to the initial preset count, it is incremented before evaluation to prevent a default false case.
          incCount ++;
          //  a preset key will be composed using incCount.
          let tempPresetName = 'preset' + incCount;
          //  if the new preset key doesn't exist in localJSON, emptyKey is set to true since an empty key has been found.
          if (Object.keys(localJSON).indexOf(tempPresetName) === -1) {
            emptyKey = true;
          }
        }
      }
      //  incCount will be returned if a preset key with a number less than the preset count was not found.
      //  incCount will NOT be returned if a preset key with a number less than the preset count IS found.
      return incCount;
    //  if localJSON doesn't exist or a preset key with a number equal to the preset count doesn't exist, the initial presetCount is returned.
    } else {
      return presetCount;
    }
  }

  //  the result of passing the current number of presets to nameLogic is assigned the number to be given in the preset key.
  //  nameLogic will identify whether the current number is good for the name, or if a previous key was deleted and needs to be re-created.
  let numForName = nameLogic(currCount);

  //  facilitates the saving of a preset.
  //  takes in an entry name as a parameter.
  function save(nameEntry) {
    //  in cases where a name is empty or only consists of spaces, a default preset name is made.
    if(nameEntry === ''  || nameEntry.trim() === '' ) {
      nameEntry = "Preset " + numForName;
    }
    //  closes "save colors" Modal to not keep the form visible after submitting.
    setIsOpen(false);
    
    //  the preset name is created, which serves as the unique key for the preset and allows it to be retrieved.
    let presetName = 'preset' + numForName;

    //  the preset is created in the form of a JSON object.
    //  it is given a key of presetName and  a value of a nested JSON object.
    //  each key of the nested object contains a value of information related to that preset: the optional user-assigned name and the skateboard color sections.
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
    //  the preset is stringified for entry into the presets key in local storage.
    const stringified = JSON.stringify(preset);
    //  if there are no presets already, presets can be set to the stringified JSON with no modifications.
    if(currCount == 0) {
      localStorage.setItem('presets', stringified);
    //  if there already presets, this means that the existing steingified JSON in presets has to be modified to place the new preset in it.
    } else {
      const JSONstring = localStorage.getItem('presets');
      //  addToStringified is the modified JSON, which is composed as follows:
      //  --  a slice of the existing stringified JSON in presets is taken that excludes the last character ("}").
      //  --  a "," is appended to this string slice.
      //  --  finally, the new preset's stringified JSON has its first character ("{") removed and is then appended as well.
      //  this removal of brackets effectively makes sure that the new stringified JSON is a valid object once parsed that contains the new preset.
      const addToStringified = JSONstring.slice(0, -1) + "," + stringified.slice(1);
      //  the new stringified JSON is set as the value of presets in local storage.
      localStorage.setItem('presets', addToStringified);
    }
    //  since a new preset has been added, the incremented preset count is set as the value of preset-count in local storage.
    localStorage.setItem('preset-count', parseInt(currCount) + 1);
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
                {/* the name input, which contains an onInput event handler to update the stored form name with each keystroke. */}
                <input type="text" id="form-name" name="name" placeholder={"Preset " + numForName} value={formName} onInput={handleInput}></input>
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
                  {/* when the "cancel" button is clicked, the "save colors" form is closed.  */}
                  <button type="button" className={"save-form-btn"}
                    onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  
                  {/* when the "save" button is clicked, the logic for saving the preset will be performed.  */}
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