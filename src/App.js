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
  const allData = props.allData;
  const showAccountId = props.showAccountId;

  useEffect(() => {
    if (allData.length === 0) {
      setCurrentDetailIndex(-1);
      setDetailData(null);
      setSavePreEditData(null);
    } else {
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
      setSavePreEditData(JSON.parse(JSON.stringify(allData[finalIndex])));
      setDetailData(JSON.parse(JSON.stringify(allData[finalIndex])));
    }
  }, [allData]);

  const [savePreEditData, setSavePreEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(-1);
  useEffect(() => {
    if (currentDetailIndex >= 0) {
      setSavePreEditData(JSON.parse(JSON.stringify(allData[currentDetailIndex])));
      setDetailData(JSON.parse(JSON.stringify(allData[currentDetailIndex])));
    } else {
      setDetailData(null);
      setSavePreEditData(null);
    }
  }, [currentDetailIndex]);

  function discardChanges() {
    setEdit(false);
    setDetailData(savePreEditData);
  }
  function saveChanges(detailData) {
    setEdit(false);
    setDetailData(detailData);
    setSavePreEditData(JSON.parse(JSON.stringify(detailData)));
    allData[currentDetailIndex] = detailData;
    props.setAllData(JSON.parse(JSON.stringify(allData)));
  }

  function addAccount() {
    if (isEdit) {
      props.showWaringToast("Your current account is editing, please save or cancel editing status! ");
      return;
    }
    props.addAccount();
    setEdit(true);
  }

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
  const [deleteModalAction, setDeleteModalAction] = useState({ "targetIndex": -1 });
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
  function showWaringToast(msg) {
    let newToastMsg = { "msg": msg };
    setWarningToastMsg(newToastMsg);
    $(`#${warningToastId}`).toast({ "delay": 3000 }).toast('show');
  }

  function addAccount() {
    let newAccountId = Math.random();
    let newAllData = [{
      "id": newAccountId,
      "name": "NewAccount",
      "tags": [],
      "detailList": [{
        "id": Math.random(),
        "label": "",
        "value": "",
      }]
    }, ...accountData];
    setSeacrhText("");
    setAllData(newAllData);
    setShownAccountId(newAccountId);
  }

  function showDeleteModal(targetIndex) {
    const newAction = {};
    newAction.targetIndex = targetIndex;
    setDeleteModalAction(newAction);
    $(`#${deleteModalId}`).modal('show');
  }
  function onDeleteModalNoClick() {
  }
  function onDeleteModalYesClick() {
    let deleteIndex = deleteModalAction.targetIndex;
    let deleteItem = showAccountData[deleteIndex];
    const newAllArray = accountData.filter((item) => {
      return item.id !== deleteItem.id;
    });
    setAccountData(newAllArray);
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
            searchText={searchText}
            onSearchTextChanged={onSearchTextChanged}
          />
          <Route path="/"
            render={
              (props) => {
                return (
                  <Content
                    {...props}
                    showAccountId={showAccountId}
                    allData={showAccountData}
                    setAllData={setAllData}
                    showWaringToast={showWaringToast}
                    showDeleteModal={showDeleteModal}
                    addAccount={addAccount}
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
