import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import { SearchByText } from './Search';
import WarningToast from './toast/WarningToast';
import DeleteModal from './modal/DeleteModal';
import CloseModal from './modal/CloseModal';
import SetKeyModal from './modal/SetKeyModal';
import KeyBookModal from './modal/KeyBookModal';
import Spinners from './Spinners';
import $ from 'jquery';
import OpenFilePage from './OpenFilePage';
import { encrypt, decrypt, md5, getCurrentUTC, loadLocalFile } from "./Tools";
import { saveAs } from 'file-saver';
import { openAuthPage, openFileFromDropBox } from './save/DropBoxTools';
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
// - 密码锁(本地存储)
// TODO: 待添加功能/bug need to fixed
// - 云存储功能：DropBox
// - 中文语言支持
// - Electron

function App() {
  const warningToastId = "warningToastId";
  const [warningToastMsg, setWarningToastMsg] = useState({ "msg": "" });
  const saveToastId = "saveToastId";
  const [saveToastMsg, setSaveToastMsg] = useState({ "succeed": false, "msg": "" });
  const deleteModalId = "deleteModal";
  const [deleteModalAction, setDeleteModalAction] = useState({ "targetIndex": -1 });
  const closeModalId = "closeModal";
  const [ifSpinnersShow, setIfSpinnersShow] = useState(false);
  const setKetModalId = "setKeyModal";
  const keyBookModalId = "keyBookModal";

  function onKeyBookClick() {
    $(`#${keyBookModalId}`).modal('show');
  }

  const [fileData, setFileData] = useState(null);
  const [ifFileOpen, setFileOpen] = useState(false);
  const [encryptData, setEncryptData] = useState(null);
  function onOpenFileOkCb(content) {
    if (content) {
      setFileData(JSON.parse(content));
      setEncryptData(JSON.parse(content)["data"]);
      setFileOpen(true);
    }
  }
  function onOpenFileErrorCb(error) {
    console.log(error);
  }
  function onNewFileClick() {
    setAccountData([]);
    setShowAccountData([]);
    setUserKeyMd5(md5(""));
    setLock(false);
  }
  function onOpenFileClick() {
    loadLocalFile(onOpenFileOkCb, onOpenFileErrorCb);
  }
  function onPwOkClick() {
    let fileMd5 = fileData["md5"];
    let inputMd5 = md5(inputPw);
    if (fileMd5 === inputMd5) {
      setAccountData(JSON.parse(decrypt(fileData["data"], inputPw)));
      setShowAccountData(JSON.parse(decrypt(fileData["data"], inputPw)));
      setUserKeyMd5(decrypt(fileData["md5"], inputPw));
      setInputPw("");
      setLock(false);
      setFileOpen(false);
    } else {
      var animationEvent = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
      $("#inputPw").addClass('shake-horizontal');
      $("#inputPw > input").addClass('btn-outline-danger');
      $("#inputPw").one(animationEvent, function (event) {
        $("#inputPw").removeClass('shake-horizontal btn-danger');
        $("#inputPw > input").removeClass('btn-outline-danger');
      });
    }
  }
  function onPwCancelClick() {
    setEncryptData(null);
  }

  function onOpenDropBoxFileClick() {
    let hashStrings = window.location.hash.substring(1);
    let hashArgs = {}
    let items = hashStrings.length > 0 ? hashStrings.split("&") : [];
    let i = 0
    let len = items.length;
    for (i = 0; i < len; i++) {
      let item = items[i].split("=");
      let name = decodeURIComponent(item[0]);
      let value = decodeURIComponent(item[1]);
      if (name.length > 0) {
        hashArgs[name] = value;
      }
    }
    if (!hashArgs["access_token"]) {
      openAuthPage();
    } else {
      openFileFromDropBox();
    }
  }

  const [accountData, setAccountData] = useState(null);
  useEffect(() => {
    if (accountData) {
      setShowAccountData(SearchByText(searchText, accountData));
      setEncryptData(encrypt(JSON.stringify(accountData), userKeyRaw));
    }
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
      "dateCreate": new Date().toISOString(),
      "dateModify": new Date().toISOString(),
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

  function showCloseModal() {
    $(`#${closeModalId}`).modal('show');
  }
  function onCloseModalNoClick() {
  }
  function onCloseModalYesClick() {
    setLock(true);
    setFileOpen(false);
  }

  const [userKeyRaw, setUserKeyRaw] = useState("");
  const [userKeyMd5, setUserKeyMd5] = useState("");
  function onSetKeyClick() {
    $(`#${setKetModalId}`).modal('show');
  }
  function onSetKeyModalCancelClick() {

  }
  function onSetKeyModalConfirmClick() {
    setUserKeyMd5(md5(userKeyRaw));
    let newEncryptData = {
      "md5": md5(userKeyRaw),
      "data": encrypt(JSON.stringify(accountData), userKeyRaw),
      "date": getCurrentUTC(),
    }
    setEncryptData(encrypt(JSON.stringify(accountData), userKeyRaw));
    setFileData(newEncryptData);
  }
  function onUserKeyChange(value) {
    setUserKeyRaw(value);
  }

  function onSaveLocalClick() {
    let userMd5 = userKeyMd5;
    let saveData = {
      "md5": userMd5,
      "data": encryptData,
      "date": getCurrentUTC(),
    }
    let text = JSON.stringify(saveData);
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "keybook-data.txt");
  }

  function onSyncDropboxClick() {

  }

  function onCloseFileClick() {
    showCloseModal();
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
    if (accountData) {
      let newAccounts = SearchByText(searchText, accountData);
      setShowAccountData(newAccounts);
    }
  }, [searchText]);

  const [ifLock, setLock] = useState(true);
  const [fileName, setFileName] = useState("");
  const [inputPw, setInputPw] = useState("");
  function onInputPwChange(value) {
    setInputPw(value);
  }
  let page;
  if (!ifLock) {
    page = <>
      <header>
        <Header
          onKeyBookClick={onKeyBookClick}
          searchText={searchText}
          onSearchTextChanged={onSearchTextChanged}
          onSetKeyClick={onSetKeyClick}
          onSaveLocalClick={onSaveLocalClick}
          onSyncDropboxClick={onSyncDropboxClick}
          onCloseFileClick={onCloseFileClick}
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
        <Footer
        />
      </footer>
    </>;
  } else {
    page = <>
      <OpenFilePage
        onNewFileClick={onNewFileClick}
        onOpenFileClick={onOpenFileClick}
        onOpenDropBoxFileClick={onOpenDropBoxFileClick}
        ifFileOpen={ifFileOpen}
        fileName={fileName}
        inputPw={inputPw}
        onInputPwChange={onInputPwChange}
        onPwOkClick={onPwOkClick}
        onPwCancelClick={onPwCancelClick}
      />
    </>
  }

  return (
    <div className="App">
      {page}
      <KeyBookModal
        modalId={keyBookModalId}
      />
      <DeleteModal
        modalId={deleteModalId}
        onNoClick={onDeleteModalNoClick}
        onYesClick={onDeleteModalYesClick}
      />
      <CloseModal
        modalId={closeModalId}
        onNoClick={onCloseModalNoClick}
        onYesClick={onCloseModalYesClick}
      />
      <SetKeyModal
        modalId={setKetModalId}
        userKey={userKeyRaw}
        onUserKeyChange={onUserKeyChange}
        onCancelClick={onSetKeyModalCancelClick}
        onConfirmClick={onSetKeyModalConfirmClick}
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
