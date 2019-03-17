import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import EditingModal from './EditingModal';
import SaveAlert from './SaveAlert';
import Spinners from './Spinners';
import * as BackgroundTask from './BackgroundTask';
import $ from 'jquery';
require('bootstrap');

// DONE: 已添加功能
// - 账户 list 展示
// - 账户 detail 展示、编辑
// TODO: 待添加功能/bug need to fixed
// - toast 在不显示的时候挡住了搜索框focus，初步查明是 父级 div 元素拦截了点击事件
// - 加载中 功能 函数 提取为 Context
// - Copy value
// - 账户 list 编辑：添加、删除
// - 搜索功能
// - 云存储功能
// - tag 功能：展示、编辑
// - 目录功能
// - 中文语言支持
// - 

/**
 * @param {props.editingModalAction} 在Detail为编辑态并切换account时触发
 */
function Content(props) {

  var recieveData = [
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

  const [allData, setAllData] = useState(recieveData.map(data => {
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
  }));

  const [savePreEditData, setSavePreEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  useEffect(() => {
    if (currentDetailIndex >= 0) {
      setSavePreEditData(JSON.parse(JSON.stringify(allData[currentDetailIndex])));
      setDetailData(JSON.parse(JSON.stringify(allData[currentDetailIndex])));
    }
  }, [currentDetailIndex]);

  function discardChanges() {
    setEdit(false);
    setDetailData(savePreEditData);
  }
  function onSaved() {
    const msg = detailData.name + " saved";
    props.onSaved(msg);
  }
  function onSaveFailed() {
    const msg = detailData.name + " save failed";
    props.onSaveFailed(msg);
  }
  async function saveChanges(changeCurrenIndex, targetIndex) {
    props.showSpinners();
    const saveResult = await BackgroundTask.saveEditDetail(detailData);
    if (saveResult) {
      setSavePreEditData(JSON.parse(JSON.stringify(detailData)));
      setDetailData(detailData);
      allData[currentDetailIndex] = detailData;
      setAllData(JSON.parse(JSON.stringify(allData)));
      setEdit(false);
      if (changeCurrenIndex) {
        setCurrentDetailIndex(targetIndex);
      }
      onSaved();
    } else {
      onSaveFailed();
    }
    props.dismissSpinners();
    return saveResult;
  }
  const editingModalAction = props.editingModalAction;
  useEffect(() => {
    console.log(editingModalAction);
    switch (editingModalAction.what) {
      case "waiting":
        break;
      case "continue":
        break;
      case "discard":
        discardChanges();
        setCurrentDetailIndex(editingModalAction.targetIndex);
        break;
      case "save":
        saveChanges(true, editingModalAction.targetIndex);
        break;
      default:
        throw Error("editingModalAction.what is illegal");
    }
  }, [editingModalAction]);
  function handlePwItemClick(name, index) {
    if (index === currentDetailIndex) {
      console.log("isCurrentIndex");
      return;
    }
    if (isEdit) {
      console.log("isEdit");
      props.showEditingModal(index);
      return;
    }
    console.log("handlePwItemClick if out");
    setCurrentDetailIndex(index);
  }

  function onEDOkClick(detailData) {
    saveChanges(detailData);
  }
  function onEDCancelClick() {
    discardChanges();
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
  const [isEdit, setEdit] = useState(false);
  let detail;
  if (isEdit) {
    detail =
      <EditDetail
        detailData={detailData}
        onAddClick={onEDItemAddClick}
        onItemInputLabelChange={onEDItemInputLabelChange}
        onItemInputValueChange={onEDItemInputValueChange}
        onItemDeleteClick={onEDItemDeleteClick}
        onOkClick={onEDOkClick}
        onCancelClick={onEDCancelClick}
      />;
  } else {
    detail =
      <Detail
        detailData={detailData}
        onEditClick={onDetailEditClick}
        onDeleteClick={onDetailDeleteClick}
      />;
  }

  return (
    <div class="container-fluid pw-content py-1 border-bottom">
      <div class="row">
        <div class="col-sm-3 border-right">
          <Aside
            data={allData}
            handlePwItemClick={handlePwItemClick}
            activeIndex={currentDetailIndex}
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
  const editingModalId = "editingModal";
  const [editingModalAction, setEditingModalAction] = useState({ "what": "waiting", "targetIndex": -1 });
  const [saveAlertMsg, setSaveAlertMsg] = useState({ "succeed": false, "msg": "" });
  const [ifSpinnersShow, setIfSpinnersShow] = useState(false);

  function showEditingModal(targetIndex) {
    const newEditingModalAction = {};
    newEditingModalAction.what = "waiting";
    newEditingModalAction.targetIndex = targetIndex;
    setEditingModalAction(newEditingModalAction);
    $(`#${editingModalId}`).modal('show');
  }

  function onEditingModalContinueEditClick() {
    const newEditingModalAction = JSON.parse(JSON.stringify(editingModalAction));
    newEditingModalAction.what = "continue";
    setEditingModalAction(newEditingModalAction);
  }

  function onEditingModalDiscardClick() {
    const newEditingModalAction = JSON.parse(JSON.stringify(editingModalAction));
    newEditingModalAction.what = "discard";
    setEditingModalAction(newEditingModalAction);
  }

  function onEditingModalSaveClick() {
    const newEditingModalAction = JSON.parse(JSON.stringify(editingModalAction));
    newEditingModalAction.what = "save";
    setEditingModalAction(newEditingModalAction);
  }

  function onContentSaved(msg) {
    let newSaveAlertMsg = { "succeed": true, "msg": msg };
    setSaveAlertMsg(newSaveAlertMsg);
    $('.toast').toast({ "delay": 3000 }).toast('show');
  }

  function onContentSaveFailed(msg) {
    let newSaveAlertMsg = { "succeed": false, "msg": msg };
    setSaveAlertMsg(newSaveAlertMsg);
    $('.toast').toast({ "delay": 3000 }).toast('show');
  }

  function showSpinners() {
    setIfSpinnersShow(true);
  }

  function dismissSpinners() {
    setIfSpinnersShow(false);
  }

  return (
    <div className="App">
      <Header />
      <Content
        editingModalAction={editingModalAction}
        showEditingModal={showEditingModal}
        onSaved={onContentSaved}
        onSaveFailed={onContentSaveFailed}
        showSpinners={showSpinners}
        dismissSpinners={dismissSpinners}
      />
      <EditingModal
        modalId={editingModalId}
        onContinueEditClick={onEditingModalContinueEditClick}
        onDiscardClick={onEditingModalDiscardClick}
        onSaveClick={onEditingModalSaveClick}
      />
      <SaveAlert
        ifSucceed={saveAlertMsg.succeed}
        msg={saveAlertMsg.msg}
      />
      <Spinners
        ifShow={ifSpinnersShow}
      />
    </div>
  )
}


export default App;
