import React from "react";
import "./Modal.css";
import { RiCloseLine, RiFileUploadFill } from "react-icons/ri";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const ManageModal = ({ sBrd, sPri, sSl, sSec, sNm, sLnwk, isOtherOpen, setIsOtherOpen, setIsOpen }) => {
  //  uses the isOtherOpen prop to check if the "save colors" Modal is open (if isOtherOpen is true).
  //  if it is, the function passed by the setIsOtherOpen prop is called to set isOtherOpen to false (closing the "save colors" Modal).
  if(isOtherOpen === true) {
    setIsOtherOpen(false);
  }

  //  array of skateboard color sections.
  const elementSections = ["board", "primary", "seal", "secondary", "name", "linework"];
  //  parses the stringified JSON in the presets key stored in local storage and stores it in variable localJSON.
  const localJSON = JSON.parse(localStorage.getItem('presets'));
  let keysArray = [];
  //  if localJSON (the parsed JSON string in presets) is not null, each key of the JSON object is added to the key array.
  if(localJSON != null) {
    for (var key of Object.keys(localJSON)) {
      keysArray.push(key);
    }
  }

  //  used just to update state; fixes bug where last item remaining in list doesn't delete
  let [keySize, setKeySize] = useState(0);

  //  facilitates the loading of a saved preset.
  //  takes in a key (chosenPreset) as a parameter, which identifies the preset chosen by the user.
  function loadPreset (chosenPreset) {
    //  each color (hex-value) under the chosen key (chosenPreset) in localJSON is stored in a variable.
    let pri = localJSON[chosenPreset]['primary-color'];
    let sec = localJSON[chosenPreset]['secondary-color'];
    let nm = localJSON[chosenPreset]['name-color'];
    let sl = localJSON[chosenPreset]['seal-color'];
    let lnwk = localJSON[chosenPreset]['linework-color'];
    let brd = localJSON[chosenPreset]['board-color'];

    //  an array is composed from the color variables.
    let colorArray = [brd, pri, sl, sec, nm, lnwk];
    //  an array is composed from the setter function props.
    let setArray = [sBrd, sPri, sSl, sSec, sNm, sLnwk];

    //  each color section is run as an index of the color array and is subject to the following operations:
    //  --  its color is changed by passing the following arguments to the changeStyles function: 
    //      --  the respective element section (from the elementSections array),
    //      --  the respective color (from the color array).
    //  --  the corresponding setter function is called to set the section's color to the corresponding color of the color array.
    //  --  to set the new color in local storage, the key name is composed from the corresponding element section and stored in variable keyName.
    //  --  the corresponding color is stored in the key (keyName) in local storage, which will cause them to appear to the user.
    for (let i = 0; i < colorArray.length; i++) {
      changeStyles (elementSections[i], colorArray[i])
      setArray[i](colorArray[i]);
      let keyName = elementSections[i] + '-color';
      localStorage.setItem(keyName, colorArray[i]);
    }
    // once the load operation is done, the "presets" Modal is closed to make the new displayed colors apparent to the user.
    setIsOpen(false);
  }

  //  facilitates the deleting of a saved preset.
  //  takes in a key (chosenPreset) as a parameter; keySize is only used and changed for re-rendering purposes.
  function deletePreset (chosenPreset, keySize) {
    //  the number of saved presets is retrieved from the preset-count key in local storage.
    const count = localStorage.getItem('preset-count');
    //  since the number of presets in local storage is a string:
    //  --  the string is parsed to get the integer,
    //  --  and then the integer is decremented, since deleting a preset will reduce the amount of saved presets by 1.
    const subCount = parseInt(count) - 1;
    //  in order to not modify localJSON, it is copied to a variable which can be modified.
    let JSONtoModify = localJSON;
    //  the key of the selected preset (chosenPreset) is deleted from the JSON object, removing its value.
    delete JSONtoModify[chosenPreset];
    //  the modified JSON (now with the chosen key deleted) is (re-)stringified to prepare for passing into local storage.
    let stringifyNew = JSON.stringify(JSONtoModify);
    //  the modified JSON is stored as the value of the presets key in local storage.
    localStorage.setItem('presets', stringifyNew);
    //  the decremented number of presets (subCount) is set as the new value under the preset-count key in local storage.
    localStorage.setItem('preset-count', subCount);
    //  the keySize state variable is set to itself, decremented by 1.
    setKeySize(keySize - 1);

    //  this condition deals with the case that the last preset is removed, which will cause the stringified JSON object to just be "{}".
    //  if parsed, this would be an invalid JSON; therefore, if "{}" is the value of the stringified JSON object in presets, its value is set to null.
    //  this eliminates errors from coming up in the future.
    if (localStorage.getItem('presets') == "{}") {
      localStorage.setItem("presets" , null)
    }
  }

  //  change the styles when the value (color) of the color input is changed.
  //  this function works in the same way as the documented changeStyles function in App.js .
  function changeStyles (cls, color) {
    const clsName = "." + cls;
    const els = document.querySelectorAll(clsName);
    els.forEach(el => {
      el.style.fill = color;
    });
  }

  //  renders the saved presets.
  function renderPresets (keysArray) {
    //  if there are no keys in localJSON (keys array has a length of 0), a p element is rendered that tells the user that there are no presets.
    //  if this returns (if-condition is met), the inner return (right after where the function is called) will not run.
    if(keysArray.length === 0) return <p className="no-presets">You have no presets.</p>
  }

  return (
      <>
        <div className="dark-bg" onClick={() => setIsOpen(false)} />
        <div className={"centered"}>
          <div className={"modal"}>
            <div className={"modal-header"}>
              <h5 className={"heading"}>Presets</h5>
            </div>
            <button className={"close-btn"} onClick={() => setIsOpen(false)}>
              <RiCloseLine />
            </button>
            <div className={"modal-content"}>
              Load or Delete any shown presets!
            </div>
            <div className="presets">
              {/*
              renderPresets is run with the keys array passed as an argument.
              it will check if keys array has any items (keys to be enumerated).
              if it does, the function call will do nothing.
              if it doesn't, it will return a p element and terminate the outer return (the subsequent code will not run).
              */}
              {renderPresets(keysArray)};
              {/*
              if renderPresets doesn't return anything, then the keys array is enumerated.
              this will run for each preset that exists (their keys will be in the keys array).
              each item in the keys array is mapped to a key and index:
              --  key: the value of the index in the keys array.
              --  index: the number of the index itself.
              */}
              {keysArray.map((key, index) => {
                return (
                  //  a list item container with a key of the index (number of list placement of item being enumerated)
                  <li className="preset-container" key={index}>
                    {/* p element with text (inner HTML) being the name value of the JSON sub-object, identified with key, within localJSON */}
                    <p className="preset-title">{localJSON[key].name}</p>
                    <div className="preset-body">
                      <div className="colors-set">
                        {/* divs that are given background colors of their respective color sections of the JSON sub-object, identified with key, within localJSON */}
                        <div className="load-swatch" style={{backgroundColor: localJSON[key]['primary-color']}}></div>
                        <div className="load-swatch" style={{backgroundColor: localJSON[key]['secondary-color']}}></div>
                        <div className="load-swatch" style={{backgroundColor: localJSON[key]['name-color']}}></div>
                        <div className="load-swatch" style={{backgroundColor: localJSON[key]['seal-color']}}></div>
                        <div className="load-swatch" style={{backgroundColor: localJSON[key]['linework-color']}}></div>
                        <div className="load-swatch" style={{backgroundColor: localJSON[key]['board-color']}}></div>
                      </div>
                      {/*
                      each preset container has 2 buttons: 1 for loading, 1 for deleting.
                      */}
                      <div className="icon-container">
                        {/*
                        when the "load" button is clicked, it will trigger the loadPreset function, passing the preset's key as an argument.
                        this key serves to identify which preset is being generated, so that its load button will load the correct preset.
                        */}
                        <button className="load" onClick={() => loadPreset(key)}>
                          <RiFileUploadFill />
                        </button>

                        {/*
                        when the "delete" button is clicked, it will trigger the deletePreset function, passing the preset's key as an argument.
                        the keySize argument is used to change the state of keySize in the function, which only serves re-rendering purposes.
                        the key serves to identify which preset is being generated, so that its delete button will delete the correct preset.
                        */}
                        <button className="delete" onClick={() => deletePreset(key, keySize)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
          </div>
        </div>
        </div>
      </>
  );
};

export default ManageModal;