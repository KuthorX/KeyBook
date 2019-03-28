import React, { useState, useEffect } from 'react';
// https://github.com/whoisandy/react-rangeslider
import Slider from 'react-rangeslider';
import { generatePassword } from './Tools';
import './rangeslider/css/rangeslider.css';
import { copyTextToClipboard } from './Tools';

function GeneratePasswordView(props) {
  const pwLen = props.pwLen;
  const genResult = props.genResult;

  function onVChange(value) {
    props.setPwLen(value);
  }

  function onLabelChange(event) {
    let value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      if (value > 1024) {
        value = 1024;
      }
      props.setPwLen(value);
    }
  }

  const [copyStatus, setCopyStatus] = useState("normal");
  let copyButton;
  switch (copyStatus) {
    case "normal":
      copyButton =
        <button type="button" class="btn btn-outline-info text-center text-break w-100" onClick={onCopyClick}>
          {genResult}</button>;
      break;
    case "success":
      copyButton =
        <button type="button" class="btn btn-success text-center text-break w-100" onClick={onCopyClick}>
          {genResult}</button>;
      break;
    case "fail":
      copyButton =
        <button type="button" class="btn btn-danger text-center text-break w-100" onClick={onCopyClick}>
          {genResult}</button>;
      break;
    default:
      break;
  }
  function onCopyClick() {
    let result = copyTextToClipboard(genResult);
    if (result) {
      setCopyStatus("success");
    } else {
      setCopyStatus("fail")
    }
    setTimeout(() => {
      setCopyStatus("normal")
    }, 500);
  }

  return (
    <div class="collapse show" id="collapseExample">
      <div class="mx-4 mt-2">
        <div>
          <Slider
            value={pwLen}
            min={0}
            max={1024}
            orientation="horizontal"
            onChange={onVChange}
          />
          <div class="input-group mt-3 mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">Len</span>
            </div>
            <input class="vw-10" type="text" aria-label="Label" value={pwLen} onChange={onLabelChange} class="form-control" />
          </div>
          {copyButton}
        </div>
      </div>
    </div>
  )
}

function Footer() {

  const [pwLen, setPwLen] = useState(16);
  const [genResult, setGenResult] = useState("GenerateResult");
  useEffect(() => {
    if (pwLen > 0) {
      setGenResult(generatePassword(pwLen));
    } else {
      setGenResult("GenerateResult");
    }
  }, [pwLen])


  return (
    <div class="">
      <div class="py-2 border-top">
        <GeneratePasswordView
          pwLen={pwLen}
          genResult={genResult}
          setPwLen={setPwLen}
        />
        <div class="mx-4 my-2 d-flex flex-row-reverse">
          <div>
            <a class="text-info text-decoration-none" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              Password Generate
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;