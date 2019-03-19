import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import EditingModal from './EditingModal';
import DeleteModal from './DeleteModal';
import SaveToast from './SaveToast';
import Spinners from './Spinners';
import * as BackgroundTask from './BackgroundTask';
import $ from 'jquery';
require('bootstrap');

// DONE: 已添加功能
// - 账户 list 展示
// - 账户 detail 展示、编辑
// TODO: 待添加功能/bug need to fixed
// - 账户 list 编辑：添加、删除
// - Router
// - 密码锁：云密码、本机密码
// - 搜索功能
// - 云存储功能
// - tag 功能：展示、编辑
// - 目录功能
// - 中文语言支持

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
  const editingModalAction = props.editingModalAction;
  useEffect(() => {
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
  const deleteModalAction = props.deleteModalAction;
  useEffect(() => {
    switch (deleteModalAction.what) {
      case "waiting":
        break;
      case "continue":
        break;
      case "delete":
        // TODO: Delete
        break;
      default:
        throw Error("deleteModalAction.what is illegal");
    }
  }, [editingModalAction]);
  function onAccountAddClick() {
    // TODO: Add
    if (isEdit) {
      props.showEditingModal(-1);
      return;
    }
    let newAllData = [{
      "name": "NewAccount",
      "detailList": [{
        "label": "",
        "value": "",
      }]
    }, ...allData];
    let newAllDataWithId = newAllData.map(data => {
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
    })
    setAllData(newAllDataWithId);
    setCurrentDetailIndex(0);
    setSavePreEditData(JSON.parse(JSON.stringify(newAllDataWithId[0])));
    setDetailData(JSON.parse(JSON.stringify(newAllDataWithId[0])));
    setEdit(true);
  }
  function onPwItemClick(name, index) {
    if (index === currentDetailIndex) {
      return;
    }
    if (isEdit) {
      props.showEditingModal(index);
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
    props.showDeleteModal(currentDetailIndex);
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
  const editingModalId = "editingModal";
  const deleteModalId = "deleteModal";
  const [editingModalAction, setEditingModalAction] = useState({ "what": "waiting", "targetIndex": -1 });
  const [deleteModalAction, setDeleteModalAction] = useState({ "what": "waiting", "targetIndex": -1 });
  const [saveAlertMsg, setSaveToastMsg] = useState({ "succeed": false, "msg": "" });
  const [ifSpinnersShow, setIfSpinnersShow] = useState(false);

  function showEditingModal(targetIndex) {
    const newAction = {};
    newAction.what = "waiting";
    newAction.targetIndex = targetIndex;
    setEditingModalAction(newAction);
    $(`#${editingModalId}`).modal('show');
  }

  function onEditingModalContinueEditClick() {
    const newAction = JSON.parse(JSON.stringify(editingModalAction));
    newAction.what = "continue";
    setEditingModalAction(newAction);
  }

  function onEditingModalDiscardClick() {
    const newAction = JSON.parse(JSON.stringify(editingModalAction));
    newAction.what = "discard";
    setEditingModalAction(newAction);
  }

  function onEditingModalSaveClick() {
    const newAction = JSON.parse(JSON.stringify(editingModalAction));
    newAction.what = "save";
    setEditingModalAction(newAction);
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
    $('.toast').toast({ "delay": 3000 }).toast('show');
  }

  function onContentSaveFailed(msg) {
    let newSaveToastMsg = { "succeed": false, "msg": msg };
    setSaveToastMsg(newSaveToastMsg);
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
        deleteModalAction={deleteModalAction}
        showDeleteModal={showDeleteModal}
        onSaved={onContentSaved}
        onSaveFailed={onContentSaveFailed}
        showSpinners={showSpinners}
        dismissSpinners={dismissSpinners}
        saveAlertMsg={saveAlertMsg}
      />
      <EditingModal
        modalId={editingModalId}
        onContinueEditClick={onEditingModalContinueEditClick}
        onDiscardClick={onEditingModalDiscardClick}
        onSaveClick={onEditingModalSaveClick}
      />
      <DeleteModal
        modalId={deleteModalId}
        onNoClick={onDeleteModalNoClick}
        onYesClick={onDeleteModalYesClick}
      />
      <SaveToast
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
