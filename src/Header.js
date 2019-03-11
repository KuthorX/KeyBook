import React, { useState } from 'react';

function SearchArea() {
  const [searchText, setSeacrhText] = useState("");

  function onSearchTextChanged(e) {
    setSeacrhText(e.target.value);
  }

  return (
    <div class="input-group">
      <div class="container-fluid input-group-prepend">
        {/* <span class="input-group-text"></span> */}
        <input type="text" class="form-control text-center"
          placeholder="Search" aria-label="Search"
          value={searchText} onChange={onSearchTextChanged}
        />
      </div>
    </div>
  )
}

function Header() {
  return (
    <div class="container-fluid py-1 border-bottom">
      <div class="row">
        <div class="col-sm order-1 order-sm-1 my-auto text-center text-sm-left">
          <span class="text-primary">Password Manager</span>
        </div>
        <div class="col-sm order-2 order-sm-3 my-auto text-center text-sm-right">
          <span class="text-primary">Menu</span>
        </div>
        <div class="col-sm-6 order-3 order-sm-2 my-auto">
          <SearchArea />
        </div>
      </div>
    </div>
  )
}

export default Header;

