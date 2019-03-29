import React, { useState, useEffect } from 'react';
import Aside from './Aside';
import Detail from './Detail';
import EditDetail from './EditDetail';

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
        <div class="container-fluid pw-content border-bottom">
            {finalShow}
        </div>
    )
}

export default Content;