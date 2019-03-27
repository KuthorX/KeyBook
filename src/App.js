import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';
import { SearchByText } from './Search';
import WarningToast from './toast/WarningToast';
import DeleteModal from './DeleteModal';
import Spinners from './Spinners';
import $ from 'jquery';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
require('bootstrap');

// DONE: 已添加功能
// - 账户 list 展示
// - 账户 detail 展示、编辑
// - 账户 list 编辑：添加、删除
// - Router
// - tag 功能：展示、编辑
// - 搜索功能：account、tags
// - 小屏适配
// TODO: 待添加功能/bug need to fixed
// - 云存储功能
// - 随机生成密码工具（max：128-256）
// - 密码锁
// - 关联文件功能
// - 中文语言支持
// - 目录功能

function Content(props) {
  const allData = props.allData;
  const showAccountId = props.showAccountId;
  const showOption = props.showOption;

  useEffect(() => {
    if (allData.length === 0) {
      setCurrentDetailIndex(-1);
      setDetailData(null);
      setSavePreEditData(null);
    } else {
      let finalIndex = -1;
      if (showAccountId !== null) {
        for (let i = 0; i < allData.length; i++) {
          if (showAccountId === allData[i].id) {
            finalIndex = i;
            break;
          }
        }
      }
      setCurrentDetailIndex(finalIndex);
      if (finalIndex >= 0) {
        setSavePreEditData(JSON.parse(JSON.stringify(allData[finalIndex])));
        setDetailData(JSON.parse(JSON.stringify(allData[finalIndex])));
      }
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
    props.setEdit(false);
    setDetailData(JSON.parse(JSON.stringify(savePreEditData)));
    allData[currentDetailIndex] = JSON.parse(JSON.stringify(savePreEditData));
    props.setShowAccountId(savePreEditData.id);
    props.setAllData(JSON.parse(JSON.stringify(allData)));
  }
  function saveChanges(detailData) {
    props.setEdit(false);
    setSavePreEditData(JSON.parse(JSON.stringify(detailData)));
    allData[currentDetailIndex] = JSON.parse(JSON.stringify(detailData));
    props.setShowAccountId(detailData.id);
    props.setAllData(JSON.parse(JSON.stringify(allData)));
  }

  function addAccount() {
    if (isEdit) {
      props.showWaringToast("Your current account is editing, please save or cancel editing status! ");
      return;
    }
    props.addAccount();
    props.setEdit(true);
  }

  function onAccountAddClick() {
    addAccount();
  }
  function onPwItemClick(name, index) {
    if (index === currentDetailIndex) {
      props.setShowOption("detail");
      return;
    }
    if (isEdit) {
      props.showWaringToast("Your current account is editing, please save or cancel editing status! ");
      return;
    }
    setCurrentDetailIndex(index);
    props.setShowOption("detail");
  }
  function onBackClick() {
    props.setShowOption("account");
  }

  function onItemAddClick() {
    const newDetailList = [...detailData.detailList, {
      "id": Math.random(),
      "label": "",
      "value": "",
    }];
    const newDetailData = {
      "name": detailData.name,
      "id": detailData.id,
      "tags": detailData.tags,
      "detailList": newDetailList
    }
    setDetailData(newDetailData);
  }
  function onItemDeleteClick(index) {
    const newDetailList = detailData.detailList.filter((item, j) => {
      return j !== index
    });
    const newDetailData = {
      "name": detailData.name,
      "tags": detailData.tags,
      "detailList": newDetailList
    }
    setDetailData(newDetailData);
  }
  function onEDOkClick(detailData) {
    saveChanges(detailData);
  }
  function onEDCancelClick() {
    discardChanges();
  }
  function onDetailEditClick() {
    props.setEdit(true);
  }
  function onDetailDeleteClick() {
    props.showDeleteModal(currentDetailIndex);
  }
  function onItemInputLabelChange(value, index) {
    detailData.detailList[index].label = value;
    setDetailData(JSON.parse(JSON.stringify(detailData)));
  }
  function onItemInputValueChange(value, index) {
    detailData.detailList[index].value = value;
    setDetailData(JSON.parse(JSON.stringify(detailData)));
  }
  function onItemInputTagsChange(value) {
    detailData.tags = value;
    setDetailData(JSON.parse(JSON.stringify(detailData)));
  }
  function onItemNameChange(value) {
    detailData.name = value;
    setDetailData(JSON.parse(JSON.stringify(detailData)));
  }

  const isEdit = props.isEdit
  let detail;
  if (isEdit) {
    detail =
      <EditDetail
        detailData={detailData}
        onOkClick={onEDOkClick}
        onCancelClick={onEDCancelClick}
        onItemAddClick={onItemAddClick}
        onItemDeleteClick={onItemDeleteClick}
        onItemNameChange={onItemNameChange}
        onItemInputLabelChange={onItemInputLabelChange}
        onItemInputValueChange={onItemInputValueChange}
        onItemInputTagsChange={onItemInputTagsChange}
      />;
  } else {
    detail =
      <Detail
        detailData={detailData}
        onEditClick={onDetailEditClick}
        onDeleteClick={onDetailDeleteClick}
        onBackClick={onBackClick}
      />;
  }

  let finalShow;
  if (showOption === "account") {
    finalShow = <div class="row">
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
  } else if (showOption === "detail") {
    finalShow = <div class="row">
      <div class="col-sm-3 d-none d-sm-block border-right">
        <Aside
          {...props}
          data={allData}
          onPwItemClick={onPwItemClick}
          activeIndex={currentDetailIndex}
          onAccountAddClick={onAccountAddClick}
        />
      </div>
      <div class="col-sm d-sm-block">
        {detail}
      </div>
    </div>
  }

  return (
    <Router>
      <div class="container-fluid pw-content border-bottom">
        {finalShow}
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
      "tags": "a b",
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
      "tags": "a c",
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

  recieveData = [...recieveData, ...recieveData]
  recieveData = [...recieveData, ...recieveData]
  recieveData = [...recieveData, ...recieveData]

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
  const [showAccountId, setShowAccountId] = useState(null);
  const [isEdit, setEdit] = useState(false);
  // account: 显示列表
  // detail: 显示详情
  const [showOption, setShowOption] = useState("account");
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
      "name": "New Account",
      "tags": "",
      "detailList": []
    }, ...accountData];
    setSeacrhText("");
    setAllData(newAllData);
    setShowAccountId(newAccountId);
    setShowOption("detail");
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
    setShowOption("account");
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
    if (isEdit) {
      showWaringToast("Your current account is editing, please save or cancel editing status! ");
      return;
    }
    setShowAccountId(null);
    setSeacrhText(value);
  }
  useEffect(() => {
    setShowOption("account");
    let newAccounts = SearchByText(searchText, accountData);
    setShowAccountData(newAccounts);
  }, [searchText]);

  return (
    <div className="App">
      <header>
        <Header
          searchText={searchText}
          onSearchTextChanged={onSearchTextChanged}
        />
      </header>
      <main>
        <Content
          isEdit={isEdit}
          setEdit={setEdit}
          showAccountId={showAccountId}
          allData={showAccountData}
          setAllData={setAllData}
          setShowAccountId={setShowAccountId}
          showWaringToast={showWaringToast}
          showDeleteModal={showDeleteModal}
          addAccount={addAccount}
          showOption={showOption}
          setShowOption={setShowOption}
        />
      </main>
      <footer>
        <Footer />
      </footer>
      <DeleteModal
        modalId={deleteModalId}
        onNoClick={onDeleteModalNoClick}
        onYesClick={onDeleteModalYesClick}
      />
      <WarningToast
        toastId={warningToastId}
        msg={warningToastMsg.msg}
      />
      <Spinners
        ifShow={ifSpinnersShow}
      />
    </div>
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
