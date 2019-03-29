import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import { SearchByText } from './Search';
import WarningToast from './toast/WarningToast';
import DeleteModal from './DeleteModal';
import Spinners from './Spinners';
import $ from 'jquery';
import OpenFilePage from './OpenFilePage';
require('bootstrap');

// DONE: 已添加功能
// - 账户 list 展示
// - 账户 detail 展示、编辑
// - 账户 list 编辑：添加、删除
// - Router
// - tag 功能：展示、编辑
// - 搜索功能：account、tags
// - 小屏适配
// - 随机生成密码工具
// TODO: 待添加功能/bug need to fixed
// - 云存储功能
// - 密码锁
// - 关联文件功能
// - 中文语言支持
// - 目录功能

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
      <OpenFilePage 
        
      />
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

export default App;
