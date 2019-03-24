import React, { useState, useEffect } from 'react';
import './App.css';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
require('bootstrap');


function Content(props) {
  const allData = props.allData;
  const showAccountId = props.showAccountId;

  useEffect(() => {
    let finalIndex = 0;
    if (showAccountId !== null) {
      for (let i = 0; i < allData.length; i++) {
        if (showAccountId === allData[i].id) {
          finalIndex = i;
          break;
        }
      }
    }
    setCurrentDetailIndex(finalIndex);
    setDetailData(JSON.parse(JSON.stringify(allData[finalIndex])));
  }, [allData]);

  const [detailData, setDetailData] = useState(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(-1);

  function addAccount() {
    props.addAccount();
    setEdit(true);
  }

  const [isEdit, setEdit] = useState(false);
  let detail;
  if (isEdit) {
    detail =
      <EditDetail
        detailData={detailData}
      />;
  } else {
    detail =
      <Detail
        detailData={detailData}
      />;
  }

  return (
    <div class="container-fluid pw-content py-1 border-bottom">
      <div class="row">
        <div class="col-sm-3 border-right">
          <Aside
            {...props}
            data={allData}
            activeIndex={currentDetailIndex}
            onAccountAddClick={addAccount}
          />
        </div>
        <div class="col-sm d-none d-sm-block">
          {detail}
        </div>
      </div>
    </div>
  )
}

function App() {
  let recieveData = [
    {
      "name": "MyAccount-1",
      "tags": ["a", "b"]
    },
    {
      "name": "MyAccount-2",
      "tags": ["a", "c"]
    }
  ]

  const [accountData, setAccountData] = useState(recieveData.map(data => {
    return {
      "id": Math.random(),
      "name": data.name,
      "tags": data.tags,
    }
  }));

  const [showAccountId, setShownAccountId] = useState(null);
  function setAllData(data) {
    let newDict = {};
    data.map(account => {
      if (!newDict[account.id]) {
        newDict[account.id] = account;
      }
    });
    accountData.map(account => {
      if (!newDict[account.id]) {
        newDict[account.id] = account;
      }
    });

    let newArray = [];
    for (let id in newDict) {
      newArray.push(newDict[id]);
    }
    setAccountData(newArray);
  }

  function addAccount() {
    let newAccountId = Math.random();
    let newAllData = [...accountData, {
      "id": newAccountId,
      "name": "NewAccount",
      "tags": [],
      "detailList": [{
        "id": Math.random(),
        "label": "",
        "value": "",
      }]
    },];
    setAllData(newAllData);
    setShownAccountId(newAccountId);
  }
  return (
    <div className="App">
      <Content
        showAccountId={showAccountId}
        allData={accountData}
        setAllData={setAllData}
        addAccount={addAccount}
      />
    </div>
  )
}
export default App;
