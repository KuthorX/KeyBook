import React from 'react';
require('bootstrap');

function EditDetailItem(props) {

    const label = props.label;
    const value = props.value;

    function onLabelChange(event) {
        let value = event.target.value;
        props.onLabelChange(value, props.index);
    }

    function onValueChange(event) {
        let value = event.target.value;
        props.onValueChange(value, props.index);
    }

    function onDeleteClick() {
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
                    Label
                </div>
                <div class="col my-auto text-secondary font-weight-bold">
                    Value
                </div>
                <div class="col-4 my-auto text-secondary font-weight-bold p-0">
                    Operation
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
    const name = props.name;

    function onNameChange(event) {
        let value = event.target.value;
        props.onNameChange(value);
    }

    return (
        <div class="input-group my-2 pb-2 border-bottom">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Name</span>
            </div>
            <input type="text" aria-label="Label" value={name} onChange={onNameChange} class="form-control" />
        </div>
    )
}

function EditDetailTags(props) {
    const tags = props.tags;

    function onTagsChange(event) {
        let value = event.target.value;
        props.onTagsChange(value);
    }

    return (
        <div class="input-group my-2">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Tags</span>
            </div>
            <input type="text" aria-label="Label" value={tags} onChange={onTagsChange} class="form-control" />
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
    const detailData = props.detailData;
    let detail;

    function onItemNameChange(value) {
        props.onItemNameChange(value);
    }

    function onItemInputTagsChange(value) {
        props.onItemInputTagsChange(value);
    }

    function onItemInputLabelChange(value, index) {
        props.onItemInputLabelChange(value, index);
    }

    function onItemInputValueChange(value, index) {
        props.onItemInputValueChange(value, index);
    }

    function onAddClick() {
        props.onItemAddClick();
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
                onNameChange={onItemNameChange}
            />
            <EditDetailTags
                tags={detailData.tags}
                onTagsChange={onItemInputTagsChange}
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
};

export default EditDetail;
