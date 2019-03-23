import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import Search, { SearchByText } from './Search';
import WarningToast from './toast/WarningToast';
import DeleteModal from './DeleteModal';
import SaveToast from './toast/SaveToast';
import Spinners from './Spinners';
import * as BackgroundTask from './BackgroundTask';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { all } from 'q';
require('bootstrap');

// DONE: 已添加功能
// - 账户 list 展示
// - 账户 detail 展示、编辑
// - 账户 list 编辑：添加、删除
// - Router
// - tag 功能：展示、编辑
// TODO: 待添加功能/bug need to fixed
// - 云存储功能
// - 随机生成密码工具（max：128-256）
// - 搜索功能：account、tags
// - 目录功能
// - 关联文件功能
// - 中文语言支持

function Content(props) {

  const accountName = props.match.params.accountName;
  const allData = props.allData;
  useEffect(() => {
    if (allData && allData.length > 0) {
      setCurrentDetailIndex(0);
      setSavePreEditData(JSON.parse(JSON.stringify(allData[0])));
      setDetailData(JSON.parse(JSON.stringify(allData[0])));
    } else {
      setCurrentDetailIndex(-1);
      setSavePreEditData(null);
      setDetailData(null);
    }
  }, [allData]);

  let findIndex = -1;
  for (let i = 0; i < allData.length; i++) {
    const account = allData[i];
    const name = account.name;
    if (name === accountName) {
      findIndex = i;
      break;
    }
  }

  const [savePreEditData, setSavePreEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(findIndex);
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
  async function saveChanges(detailData) {
    props.showSpinners();
    const saveResult = await BackgroundTask.saveEditDetail(detailData);
    if (saveResult) {
      setSavePreEditData(JSON.parse(JSON.stringify(detailData)));
      setDetailData(detailData);
      allData[currentDetailIndex] = detailData;
      props.setAllData(JSON.parse(JSON.stringify(allData)));
      setEdit(false);
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
    props.setAllData(newAllData);
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
      "tags": [],
      "detailList": [{
        "id": Math.random(),
        "label": "",
        "value": "",
      }]
    }, ...allData];
    props.setAllData(newAllData);
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
    saveChanges(detailData);
  }
  function onEDCancelClick() {
    discardChanges();
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
    <Router>
      <div class="container-fluid pw-content py-1 border-bottom">
        <div class="row">
          <div class="col-sm-3 border-right">
            <Aside
              {...props}
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
    </Router>
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

  let recieveData = [
    {
      "name": "MyAccount-1",
      "tags": ["a", "b"],
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
      "tags": ["a", "c"],
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

  const [accountData, setAccountData] = useState(recieveData.map(data => {
    return {
      "id": Math.random(),
      "name": data.name,
      "tags": data.tags,
      "detailList": data.detailList.map(detail => {
        return {
          "id": Math.random(),
          "label": detail.label,
          "value": detail.value,
        }
      })
    }
  }));
  useEffect(() => {
    setShowAccountData(SearchByText(searchText, accountData));
  }, [accountData]);

  const [showAccountData, setShowAccountData] = useState(JSON.parse(JSON.stringify(accountData)));

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

  const [searchText, setSeacrhText] = useState("");
  function onSearchTextChanged(value) {
    setSeacrhText(value);
  }
  useEffect(() => {
    let newAccounts = SearchByText(searchText, accountData);
    setShowAccountData(newAccounts);
  }, [searchText]);

  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Header
            onSearchTextChanged={onSearchTextChanged}
          />
          <Route exact path="/account"
            render={
              (props) => {
                return (
                  <Content
                    {...props}
                    allData={showAccountData}
                    setAllData={setAllData}
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
          <Route path="/account/:accountName"
            render={
              (props) => {
                return (
                  <Content
                    {...props}
                    allData={showAccountData}
                    setAllData={setAllData}
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
      </ErrorBoundary>
    </Router>
  )
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default App;
