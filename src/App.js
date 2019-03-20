import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import WarningToast from './toast/WarningToast';
import DeleteModal from './DeleteModal';
import SaveToast from './toast/SaveToast';
import Spinners from './Spinners';
import * as BackgroundTask from './BackgroundTask';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
require('bootstrap');

// DONE: 已添加功能
// - 账户 list 展示
// - 账户 detail 展示、编辑
// - 账户 list 编辑：添加、删除
// TODO: 待添加功能/bug need to fixed
// - Router
// - 密码锁：云密码、本机密码
// - 搜索功能
// - 云存储功能
// - tag 功能：展示、编辑
// - 目录功能
// - 中文语言支持

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
      "id": Math.random(),
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
        console.log(targetIndex)
        setCurrentDetailIndex(targetIndex);
      }
      onSaved();
    } else {
      onSaveFailed();
    }
    props.dismissSpinners();
    return saveResult;
  }

  function deleteAccount(targetIndex) {
    const newAllData = allData.filter((item, j) => {
      return j !== targetIndex
    });
    setAllData(newAllData);
    setCurrentDetailIndex(-1);
    setSavePreEditData(null);
    setDetailData(null);
  }
  function addAccount() {
    if (isEdit) {
      props.showWaringToast("Your current account is editing, please save or cancel editing status! ");
      return;
    }
    let newAllData = [{
      "id": Math.random(),
      "name": "NewAccount",
      "detailList": [{
        "id": Math.random(),
        "label": "",
        "value": "",
      }]
    }, ...allData];
    setAllData(newAllData);
    setCurrentDetailIndex(0);
    setSavePreEditData(JSON.parse(JSON.stringify(newAllData[0])));
    setDetailData(JSON.parse(JSON.stringify(newAllData[0])));
    setEdit(true);
  }

  const deleteModalAction = props.deleteModalAction;
  useEffect(() => {
    switch (deleteModalAction.what) {
      case "waiting":
        break;
      case "continue":
        break;
      case "delete":
        deleteAccount(deleteModalAction.targetIndex);
        break;
      default:
        throw Error("deleteModalAction.what is illegal");
    }
  }, [deleteModalAction]);

  function onAccountAddClick() {
    addAccount();
  }
  function onPwItemClick(name, index) {
    if (index === currentDetailIndex) {
      return;
    }
    if (isEdit) {
      props.showWaringToast("Your current account is editing, please save or cancel editing status! ");
      return;
    }
    setCurrentDetailIndex(index);
  }

  function onEDOkClick(detailData) {
    saveChanges(false, detailData);
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
    props.showDeleteModal(currentDetailIndex);
  }

  const [isEdit, setEdit] = useState(false);
  let detail;
  if (isEdit) {
    detail =
      <EditDetail
        detailData={detailData}
        onAddClick={onEDItemAddClick}
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
            onPwItemClick={onPwItemClick}
            activeIndex={currentDetailIndex}
            onAccountAddClick={onAccountAddClick}
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
  const warningToastId = "warningToastId";
  const [warningToastMsg, setWarningToastMsg] = useState({ "msg": "" });
  const saveToastId = "saveToastId";
  const [saveToastMsg, setSaveToastMsg] = useState({ "succeed": false, "msg": "" });
  const deleteModalId = "deleteModal";
  const [deleteModalAction, setDeleteModalAction] = useState({ "what": "waiting", "targetIndex": -1 });
  const [ifSpinnersShow, setIfSpinnersShow] = useState(false);

  function showWaringToast(msg) {
    let newToastMsg = { "msg": msg };
    setWarningToastMsg(newToastMsg);
    $(`#${warningToastId}`).toast({ "delay": 3000 }).toast('show');
  }

  function showDeleteModal(targetIndex) {
    const newAction = {};
    newAction.what = "waiting";
    newAction.targetIndex = targetIndex;
    setDeleteModalAction(newAction);
    $(`#${deleteModalId}`).modal('show');
  }

  function onDeleteModalNoClick() {
    const newAction = JSON.parse(JSON.stringify(deleteModalAction));
    newAction.what = "continue";
    setDeleteModalAction(newAction);
  }

  function onDeleteModalYesClick() {
    const newAction = JSON.parse(JSON.stringify(deleteModalAction));
    newAction.what = "delete";
    setDeleteModalAction(newAction);
  }

  function onContentSaved(msg) {
    let newSaveToastMsg = { "succeed": true, "msg": msg };
    setSaveToastMsg(newSaveToastMsg);
    $(`#${saveToastId}`).toast({ "delay": 2500 }).toast('show');
  }

  function onContentSaveFailed(msg) {
    let newSaveToastMsg = { "succeed": false, "msg": msg };
    setSaveToastMsg(newSaveToastMsg);
    $(`#${saveToastId}`).toast({ "delay": 2500 }).toast('show');
  }

  function showSpinners() {
    setIfSpinnersShow(true);
  }

  function dismissSpinners() {
    setIfSpinnersShow(false);
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Route path="/"
          render={
            () => {
              return (
                <Content
                  showWaringToast={showWaringToast}
                  deleteModalAction={deleteModalAction}
                  showDeleteModal={showDeleteModal}
                  onSaved={onContentSaved}
                  onSaveFailed={onContentSaveFailed}
                  showSpinners={showSpinners}
                  dismissSpinners={dismissSpinners}
                  saveToastMsg={saveToastMsg}
                />
              )
            }
          }
        />
        <DeleteModal
          modalId={deleteModalId}
          onNoClick={onDeleteModalNoClick}
          onYesClick={onDeleteModalYesClick}
        />
        <SaveToast
          toastId={saveToastId}
          ifSucceed={saveToastMsg.succeed}
          msg={saveToastMsg.msg}
        />
        <WarningToast
          toastId={warningToastId}
          msg={warningToastMsg.msg}
        />
        <Spinners
          ifShow={ifSpinnersShow}
        />
      </div>
    </Router>
  )
}


export default App;
