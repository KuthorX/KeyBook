import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import { saveEditDetail } from './BackgroundTask';
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

  const [savePreEditData, setSavePreEditData] = useState(JSON.parse(JSON.stringify(allData[0])));
  const [detailData, setDetailData] = useState(JSON.parse(JSON.stringify(savePreEditData)));
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

  async function onEDOkClick(detailData) {
    const saveResult = await saveEditDetail(detailData);
    if (saveResult) {
      setSavePreEditData(JSON.parse(JSON.stringify(detailData)));
      setDetailData(detailData);
      setEdit(false);
    }
  }
  function onEDCancelClick() {
    setEdit(false);
    // 写到这里的时候，经过测试发现先前需要存一份 detailData 才行，也就是 deepcopy 一下
    // 在 js 中，deepcopy 用 JSON 序列化方法是最快的
    // 参考：https://stackoverflow.com/questions/39241046/deepcopy-in-react
    // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/5344074#5344074
    setDetailData(savePreEditData);
    console.log(savePreEditData);
  }
  function onEDItemAddClick() {
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
  function onDetailEditClick() {
    setEdit(true);
  }
  function onDetailDeleteClick() {

  }

  // 是否为编辑态
  const [isEdit, setEdit] = useState(true);
  let detail;
  if (isEdit) {
    detail = <EditDetail
      detailData={detailData}
      onAddClick={onEDItemAddClick}
      onItemInputLabelChange={onEDItemInputLabelChange}
      onItemInputValueChange={onEDItemInputValueChange}
      onItemDeleteClick={onEDItemDeleteClick}
      onOkClick={onEDOkClick}
      onCancelClick={onEDCancelClick}
    />;
  } else {
    detail = <Detail
      detailData={detailData}
      onEditClick={onDetailEditClick}
      onDeleteClick={onDetailDeleteClick}
    />;
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
