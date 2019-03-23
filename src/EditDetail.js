import React, { useState } from 'react';
require('bootstrap');

function EditDetailItem(props) {

    const [label, setLabel] = useState(props.label);
    const [value, setValue] = useState(props.value);

    function onLabelChange(event) {
        let value = event.target.value;
        setLabel(value);
        props.onLabelChange(value, props.index);
    }

    function onValueChange(event) {
        let value = event.target.value;
        setValue(value);
        props.onValueChange(value, props.index);
    }

    function onDeleteClick(event) {
        props.onDeleteClick(props.index);
    }

    return (
        <div class="row py-1 border-top">
            {/* TODO：调整输入框高度 */}
            <div class="input-group input-group-sm">
                <div class="col-2 my-auto text-secondary p-0">
                    <input type="text" aria-label="Label" value={label} onChange={onLabelChange} class="form-control" />
                </div>
                <div class="col my-auto text-secondary">
                    <input type="text" aria-label="Value" value={value} onChange={onValueChange} class="form-control" />
                </div>
                <div class="col-4 my-auto p-0">
                    <button type="button" class="btn btn-outline-secondary btn-sm w-100" onClick={onDeleteClick}>Delete</button>
                </div>
            </div>
        </div>
    )
}

function EditDetailList(props) {
    const detailList = props.detailList;

    function onItemInputLabelChange(value, index) {
        props.onItemInputLabelChange(value, index);
    }

    function onItemInputValueChange(value, index) {
        props.onItemInputValueChange(value, index);
    }

    function onItemDeleteClick(index) {
        props.onItemDeleteClick(index);
    }

    const DetailItems = detailList.map((dItem, index) =>
        <EditDetailItem key={dItem.id}
            label={dItem.label}
            value={dItem.value}
            index={index}
            onLabelChange={onItemInputLabelChange}
            onValueChange={onItemInputValueChange}
            onDeleteClick={onItemDeleteClick}
        />
    )

    function onAddClick() {
        props.onAddClick();
    }

    return (
        <div className="container-fluid">
            <div class="row py-1 border-top">
                <div class="col-2 my-auto text-secondary font-weight-bold p-0">
                    label
                </div>
                <div class="col my-auto text-secondary font-weight-bold">
                    value
                </div>
                <div class="col-4 my-auto text-secondary font-weight-bold p-0">
                    operation
                </div>
            </div>
            {DetailItems}
            <div class="row py-1 border-top">
                <div class="col-2 my-auto text-secondary font-weight-bold p-0">

                </div>
                <div class="col my-auto text-secondary">

                </div>
                <div class="col-4 my-auto p-0">
                    <button type="button" class="btn btn-outline-secondary btn-sm w-100" onClick={onAddClick}>Add</button>
                </div>
            </div>
        </div>
    )
}

function EditDetailHeader(props) {
    const [name, setName] = useState(props.name);

    function onNameChange(event) {
        let value = event.target.value;
        setName(value);
        props.onNameChange(value);
    }

    return (
        <div class="my-2 pb-2 border-bottom">
            <input type="text" aria-label="Label" value={name} onChange={onNameChange} class="form-control" />
        </div>
    )
}

function EditDetailTags(props) {
    const tags = props.tags;
    let tempStr = "";
    for (let i = 0; i < tags.length; i++) {
        tempStr += tags[i] + ";";
    }
    const [tagStr, setTagStr] = useState(tempStr);

    function onTagChange(event) {
        let value = event.target.value;
        setTagStr(value);
        props.onTagChange(value);
    }

    return (
        <div class="my-2">
            <input type="text" aria-label="Label" value={tagStr} onChange={onTagChange} class="form-control" />
        </div>
    )
}

function DetailFooter(props) {

    function onOkClick() {
        props.onOkClick();
    }

    function onCancelClick() {
        props.onCancelClick();
    }

    return (
        <div>
            <button type="button" class="btn btn-outline-primary btn-sm w-100 my-1" onClick={onOkClick}>OK</button>
            <button type="button" class="btn btn-outline-danger btn-sm w-100 my-1" onClick={onCancelClick}>Cancel</button>
        </div>
    )
}

function EditDetail(props) {
    const [detailData, setDetailData] = useState(JSON.parse(JSON.stringify(props.detailData)));
    let detail;

    function onInputNameChange(value) {
        detailData.name = value;
    }

    function onInputTagChange(value) {
        let newSet = new Set();
        let newArray = [];
        let tags = value.split(";")
        for (let i = 0; i < tags.length; i++) {
            let temp = tags[i];
            if (temp !== "") {
                newSet.add(temp);
            }
        }
        newSet.forEach(item => {
            newArray.push(item);
        });
        detailData.tags = newArray;
    }

    function onItemInputLabelChange(value, index) {
        detailData.detailList[index].label = value;
    }

    function onItemInputValueChange(value, index) {
        detailData.detailList[index].value = value;
    }

    function onAddClick() {
        const newDetailList = [...detailData.detailList, {
            "id": Math.random(),
            "label": "",
            "value": "",
        }];
        const newName = detailData.name;
        const newDetailData = {
            "name": newName,
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
        const newName = detailData.name;
        const newDetailData = {
            "name": newName,
            "tags": detailData.tags,
            "detailList": newDetailList
        }
        setDetailData(newDetailData);
    }

    function onOkClick() {
        props.onOkClick(detailData);
    }

    function onCancelClick() {
        props.onCancelClick();
    }

    if (detailData) {
        detail = <div>
            <EditDetailHeader
                name={detailData.name}
                onNameChange={onInputNameChange}
            />
            <EditDetailTags
                tags={detailData.tags}
                onTagChange={onInputTagChange}
            />
            <EditDetailList
                detailList={detailData.detailList}
                onAddClick={onAddClick}
                onItemInputLabelChange={onItemInputLabelChange}
                onItemInputValueChange={onItemInputValueChange}
                onItemDeleteClick={onItemDeleteClick}
            />
            <DetailFooter
                onOkClick={onOkClick}
                onCancelClick={onCancelClick}
            />
        </div>;
    } else {
        detail = <div class="text-center">
            <h5 class="my-1 text-secondary">Please choose an account :)</h5>
        </div>;
    }

    return (
        <div>
            {detail}
        </div>
    )
}

export default EditDetail;
