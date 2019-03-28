import React, { useState, useEffect } from 'react';
// https://github.com/whoisandy/react-rangeslider
import Slider from 'react-rangeslider'
import './rangeslider/css/rangeslider.css'

function GeneratePasswordView(props) {
  const pwLen = props.pwLen;

  function onVChange(value) {
    props.setPwLen(value);
  }

  return (
    <div class="collapse border-top" id="collapseExample">
      <div class="card-body">
        <div>
          <Slider class=""
            value={pwLen}
            min={1}
            max={1024}
            orientation="horizontal"
            onChange={onVChange}
          />
        </div>
      </div>
    </div>
  )
}

function Footer() {

  const [pwLen, setPwLen] = useState(16);

  return (
    <div class="">
      <GeneratePasswordView
        pwLen={pwLen}
        setPwLen={setPwLen}
      />
      <div class="py-2 border-top">
        <button class="btn btn-link text-decoration-none" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
          Password Generate
        </button>
      </div>
    </div>
  )
}

export default Footer;