import React, { useState } from 'react';
require('bootstrap');

function EditDetailItem(props) {

    const [label, setLabel] = useState(props.label);
    const [value, setValue] = useState(props.value);

    // Explanation: 目前 input 标签改动并不向上传递事件切重新赋值 props，因为这么做会导致 input 重置 focus 状态
    // 当前做法在编辑态只在该组件更新 lable、value，提交数据时请求网络，存储成功后退回阅读态时再更新 props
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
    const name = props.data.name;
    const detaiiList = props.data.detailList;

    function onItemInputLabelChange(value, index) {
        console.log(value, index);
        props.onItemInputLabelChange(value, index);
    }

    function onItemInputValueChange(value, index) {
        props.onItemInputValueChange(value, index);
    }

    function onItemDeleteClick(index) {
        props.onItemDeleteClick(index);
    }

    const DetailItems = detaiiList.map((dItem, index) =>
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
        <div>
            <input type="text" aria-label="Label" value={name} onChange={onNameChange} class="form-control" />
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
    let detailData = props.detailData;
    let detail;

    function onAddClick() {
        props.onAddClick();
    }

    function onInputNameChange(value) {
        detailData.name = value;
    }

    function onItemInputLabelChange(value, index) {
        // props.onItemInputLabelChange(value, index);
        detailData.detailList[index].label = value;
    }

    function onItemInputValueChange(value, index) {
        // props.onItemInputValueChange(value, index);
        detailData.detailList[index].value = value;
    }

    function onItemDeleteClick(index) {
        props.onItemDeleteClick(index);
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
            <EditDetailList
                data={detailData}
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
