import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import * as BackgroundTask from './BackgroundTask';
import $ from 'jquery';
require('bootstrap');

// TODO: 待添加功能
// - Copy value
// - Delete Account Item
// - tag 展示、编辑
// - 目录功能
// - 搜索功能
// - 云存储功能

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
  async function saveChanges(changeCurrenIndex, targetIndex) {
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
    } else {
      
    }
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
    // TODO: 这里需要判断
    // 1. 选择的元素是否已经是选中状态，如果是忽略，如果不是
    // 2. 当前被选择的Detail是否在编辑态，如果是，需要弹出提示框提示是否需要存储（存储、不存储、继续编辑）
    // 3. 如果需要存储，则等待存储完成才能跳转；如果存储失败，提示存储失败请重试不跳转；如果不存储直接跳转；如果继续编辑不跳转
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

function EditingModal(props) {
  const editingModalId = props.modalId;

  function onContinueEditClick() {
    props.onContinueEditClick();
  }

  function onDiscardClick() {
    props.onDiscardClick();
  }

  function onSaveClick() {
    props.onSaveClick();
  }

  return (
    <div>
      <div class="modal fade" id={editingModalId} tabIndex="-1" role="dialog" aria-labelledby="editingModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              You are editing account detail, what would you do with changes?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={onContinueEditClick}>Continue Edit</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={onDiscardClick}>Discard</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={onSaveClick}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const editingModalId = "editingModal";
  const [editingModalAction, setEditingModalAction] = useState({"what": "waiting", "targetIndex": -1});

  function showEditingModal(targetIndex) {
    const newEditingModalAction = {};
    newEditingModalAction.what = "waiting";
    newEditingModalAction.targetIndex = targetIndex;
    setEditingModalAction(newEditingModalAction);
    $("#" + editingModalId).modal('show');
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

  return (
    <div className="App">
      <Header />
      <Content
        editingModalAction={editingModalAction}
        showEditingModal={showEditingModal}
      />
      <EditingModal
        modalId={editingModalId}
        onContinueEditClick={onEditingModalContinueEditClick}
        onDiscardClick={onEditingModalDiscardClick}
        onSaveClick={onEditingModalSaveClick}
      />
    </div>
  )
}


export default App;
