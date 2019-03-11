import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside'
require('bootstrap');


function DetailItem(props) {
  return (
    <div className="container-fluid py-1 border-top">
      <div class="row">
        <div class="col-2 my-auto text-secondary font-weight-bold p-0">
          {props.label}
        </div>
        <div class="col my-auto text-secondary">
          {props.value}
        </div>
        <div class="col-4 my-auto p-0">
          <button type="button" class="btn btn-outline-secondary btn-sm w-100">Copy</button>
        </div>
      </div>
    </div>
  )
}

function DetailList(props) {
  const textArray = props.data;

  const DetailItems = textArray.map((dItem) =>
    <DetailItem key={dItem.label}
      label={dItem.label}
      value={dItem.value} />
  )

  return (
    <div>
      {DetailItems}
    </div>
  )
}

function DetailHeader(props) {
  return (
    <div>
      <p class="my-auto py-2 text-secondary font-italic">{props.name}</p>
    </div>
  )
}

function DetailFooter() {
  return (
    <div>
      <button type="button" class="btn btn-outline-primary btn-sm w-100 my-1">Edit</button>
      <button type="button" class="btn btn-outline-danger btn-sm w-100 my-1">Delete</button>
    </div>
  )
}

function Detail(props) {
  const detailData = props.detailData;
  let detail;

  if (detailData) {
    detail = <div>
      <DetailHeader name={detailData.name} />
      <DetailList data={detailData.detailList} />
      <DetailFooter />
    </div>;
  } else {
    detail = <div class="text-center">
      <h5 class="my-1 text-secondary">Please choose an account :)</h5>
    </div>;
  }

  return (
    <div>
      {detail}
    </div>
  )
}

function Content() {
  let allData = [
    {
      "name": "MyAccount-1",
      "detailList": [{
        "label": "UserName",
        "value": "Sora",
      },
      {
        "label": "Password",
        "value": "Okay",
      }]
    },
    {
      "name": "MyAccount-2",
      "detailList": [{
        "label": "UserName",
        "value": "Ghost",
      },
      {
        "label": "Password",
        "value": "Fine",
      },
      {
        "label": "Password 2",
        "value": "Fined",
      }]
    }
  ]

  const [detailData, setDetailData] = useState();
  function handlePwItemClick(name) {
    for (let j = 0, len = allData.length; j < len; j++) {
      let d = allData[j];
      if (d.name === name) {
        setDetailData(d);
      }
    }
  }

  const [isEdit, setEdit] = useState(false);
  let detail;
  if (isEdit) {
    detail = <div>
      {/* TODO: edit */}
    </div>;
  } else {
    detail = <Detail detailData={detailData} />;
  }

  return (
    <div class="container-fluid pw-content py-1 border-bottom">
      <div class="row">
        <div class="col-sm-3 border-right">
          <Aside data={allData} handlePwItemClick={handlePwItemClick} />
        </div>
        <div class="col-sm d-none d-sm-block">
          {detail}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Header />
      <Content />
    </div>
  )
}


export default App;
