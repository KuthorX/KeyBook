import React, { useState } from 'react';

function SearchArea(props) {
  const searchText = props.searchText;
  
  function onSearchTextChanged(e) {
    let value = e.target.value;
    props.onSearchTextChanged(value);
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

function Header(props) {
  return (
    <div class="container-fluid py-2 border-bottom bg-white">
      <div class="row h-100">
        <div class="col-sm order-1 order-sm-1 mt-1 mb-2 my-sm-auto text-center text-sm-left">
          <span class="text-primary">Password Manager</span>
        </div>
        <div class="col-sm order-2 order-sm-3 mb-2 my-sm-auto text-center text-sm-right">
          <span class="text-primary">Menu</span>
        </div>
        <div class="col-sm-6 order-3 order-sm-2 mt-sm-auto mt-1">
          <SearchArea
            searchText={props.searchText}
            onSearchTextChanged={props.onSearchTextChanged}
          />
        </div>
      </div>
    </div>
  )
}

export default Header;

