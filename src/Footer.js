import React, { useState, useEffect } from 'react';
require('bootstrap');

function Footer() {
  return (
    <div class="">
      <div class="collapse border-top" id="collapseExample">
        <div class="card-body">
          Just test
        </div>
      </div>
      <div class="py-2 border-top">
        <button class="btn btn-link text-decoration-none" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
          Button with data-target
        </button>
      </div>
    </div>
  )
}

export default Footer;