import React, { useState, useEffect } from 'react';
// https://github.com/whoisandy/react-rangeslider
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

function GeneratePasswordView() {
  const [v, setV] = useState(10);

  function onVChange(value) {
    setV(value);
  }

  return (
    <div class="collapse border-top" id="collapseExample">
      <div class="card-body">
        <div>
          <Slider 
          value={v}
          orientation="horizontal"
          onChange={onVChange}
          />
        </div>
      </div>
    </div>
  )
}

function Footer() {

  
  return (
    <div class="">
      <GeneratePasswordView />
      <div class="py-2 border-top">
        <button class="btn btn-link text-decoration-none" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
          Password Generate
        </button>
      </div>
    </div>
  )
}

export default Footer;