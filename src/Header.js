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
        <input type="text" class="form-control text-center"
          placeholder="Search" aria-label="Search"
          value={searchText} onChange={onSearchTextChanged}
        />
      </div>
    </div>
  )
}

function Header(props) {
  function onKeyBookClick() {
    props.onKeyBookClick();
  }

  function onSetKeyClick() {
    props.onSetKeyClick();
  }

  function onSaveLocalClick() {
    props.onSaveLocalClick();
  }

  function onSyncDropboxClick() {
    props.onSyncDropboxClick();
  }

  function onCloseFileClick() {
    props.onCloseFileClick();
  }

  return (
    <div class="container-fluid py-2 border-bottom bg-white">
      <div class="row h-100">
        <div class="col-6 col-sm order-1 order-sm-1 my-auto text-center text-sm-left">
          <button class="btn btn-link text-decoration-none" type="button" onClick={onKeyBookClick}>
            KeyBook
          </button>
        </div>
        <div class="col-6 col-sm order-2 order-sm-3 my-auto text-center text-sm-right">
          <button class="btn btn-link dropdown-toggle text-decoration-none" type="button"
            id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Menu
          </button>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <button type="button" class="btn-info dropdown-item" onClick={onSetKeyClick}>Set Key</button>
            <button type="button" class="btn-info dropdown-item" onClick={onSaveLocalClick}>Save Local</button>
            <button type="button" class="btn-info dropdown-item" onClick={onSyncDropboxClick}>Save to Dropbox</button>
            <button type="button" class="btn-danger dropdown-item" onClick={onCloseFileClick}>Close File</button>
          </div>
        </div>
        <div class="col-sm-6 order-3 order-sm-2 mt-2 mt-sm-auto mt-1">
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

