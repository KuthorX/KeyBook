import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
require('bootstrap');


function Content() {
  var allData = [
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

  allData = allData.map(data => {
    return {
      "name": data.name,
      "detailList": data.detailList.map(detail => {
        return {
            "id": Math.random(),
            "label": detail.label,
            "value": detail.value,
        }
      })
    }
  });

  // TODO: 目前是给 源数组 添加 随机数id 实现，但是经过 log 发现这个 添加 过程每次都会被调用
  //（虽然实际上不会影响到最终的 DOM 树，但还是很在意这一点，能不能只加载一次呢？）
  console.log(allData);

  const [detailData, setDetailData] = useState(allData[0]);
  function handlePwItemClick(name) {
    // TODO: 这里需要判断
    // 1. 选择的元素是否已经是选中状态，如果是忽略，如果不是
    // 2. 当前被选择的Detail是否在编辑态，如果是，需要弹出提示框提示是否需要存储（存储、不存储、继续编辑）
    // 3. 如果需要存储，则等待存储完成才能跳转；如果存储失败，提示存储失败请重试不跳转；如果不存储直接跳转；如果继续编辑不跳转
    for (let j = 0, len = allData.length; j < len; j++) {
      let d = allData[j];
      if (d.name === name) {
        setDetailData(d);
      }
    }
  }

  function onEDAddClick() {
    const newDetailList = [...detailData.detailList, {
      "id": Math.random(),
      "label": "",
      "value": "",
    }];
    const newName = detailData.name;
    const newDetailData = {
      "name": newName,
      "detailList": newDetailList
    }
    setDetailData(newDetailData);
  }
  function onEDItemInputLabelChange(value, index) {

  }
  function onEDItemInputValueChange(value, index) {
    
  }
  function onEDItemDeleteClick(index) {
    const newDetailList = detailData.detailList.filter((item, j) => {
      return j !== index
    });
    const newName = detailData.name;
    const newDetailData = {
      "name": newName,
      "detailList": newDetailList
    }
    setDetailData(newDetailData);
  }

  // 是否为编辑态
  const [isEdit, setEdit] = useState(true);
  let detail;
  if (isEdit) {
    detail = <EditDetail
      detailData={detailData}
      onAddClick={onEDAddClick}
      onItemInputLabelChange={onEDItemInputLabelChange}
      onItemInputValueChange={onEDItemInputValueChange}
      onItemDeleteClick={onEDItemDeleteClick}
    />;
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
