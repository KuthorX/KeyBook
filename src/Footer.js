import React, { useState, useEffect } from 'react';
require('bootstrap');

function Footer() {
  return (
    <div class="border-top d-flex">
      <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
        Button with data-target
      </button>
      <div class="collapse" id="collapseExample">
        <div class="card card-body">
          Just test
        </div>
      </div>
    </div>
  )
}

export default Footer;