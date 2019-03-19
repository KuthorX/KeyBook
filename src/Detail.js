import React, { useState } from 'react';
import { copyTextToClipboard } from './Tools';
import CopyToast from './toast/CopyToast';
import $ from 'jquery';
require('bootstrap');

function DetailItem(props) {
    const label = props.label;
    const value = props.value;

    const copyToastId = "copyToastId";
    const [copyToastMsg, setCopyToastMsg] = useState({ "ifSucceed": false, "msg": "" });

    function onCopyClick() {
        let result = copyTextToClipboard(value);
        if (result) {
            setCopyToastMsg({ "ifSucceed": true, "msg": "Copy Succeed" });
        } else {
            setCopyToastMsg({ "ifSucceed": false, "msg": "Copy Fail" });
        }
        $(`#${copyToastId}`).toast({ "delay": 2500 }).toast('show');
    }

    return (
        <div class="row py-1 border-top">
            <div class="col-2 my-auto text-secondary p-0">
                {label}
            </div>
            <div id={props.copyKey} class="col my-auto text-secondary">
                {value}
            </div>
            <div class="col-4 my-auto p-0">
                <button type="button" class="btn btn-outline-secondary btn-sm w-100" onClick={onCopyClick}>Copy</button>
            </div>
            <CopyToast
                toastId={copyToastId}
                ifSucceed={copyToastMsg.ifSucceed}
                msg={copyToastMsg.msg}
            />
        </div>
    )
}

function DetailList(props) {
    const textArray = props.data;

    const DetailItems = textArray.map((dItem) =>
        <DetailItem key={dItem.id}
            copyKey={dItem.id}
            label={dItem.label}
            value={dItem.value} />
    )

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
        </div>
    )
}

function DetailHeader(props) {
    return (
        <div>
            <p class="my-auto py-2 text-secondary font-italic">{props.name}</p>
        </div>
    )
}

function DetailFooter(props) {
    function onEditClick() {
        props.onEditClick();
    }

    function onDeleteClick() {
        props.onDeleteClick();
    }

    return (
        <div>
            <button type="button" class="btn btn-outline-primary btn-sm w-100 my-1" onClick={onEditClick}>Edit</button>
            <button type="button" class="btn btn-outline-danger btn-sm w-100 my-1" onClick={onDeleteClick}>Delete</button>
        </div>
    )
}

function Detail(props) {
    const detailData = props.detailData;

    let detail;

    function onEditClick() {
        props.onEditClick();
    }

    function onDeleteClick() {
        props.onDeleteClick();
    }

    if (detailData) {
        detail = <div>
            <DetailHeader name={detailData.name} />
            <DetailList data={detailData.detailList} />
            <DetailFooter
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
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

export default Detail;
