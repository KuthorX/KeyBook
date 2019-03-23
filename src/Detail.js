import React, { useState } from 'react';
import { copyTextToClipboard } from './Tools';
import CopyToast from './toast/CopyToast';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
            <h5 class="my-auto py-2 text-secondary font-italic border-bottom">{props.name}</h5>
        </div>
    )
}

function DetailTag(props) {
    return (
        <span class="text-decoration-none mx-1">{props.value}</span>
    )
}

function DetailTags(props) {
    const tags = props.tags;
    const detailTags = tags.map((tag) =>
        <DetailTag key={tag.id}
            value={tag} />
    )
    return (
        <div>
            <p class="my-auto py-2 text-secondary">Tags <span> {detailTags} </span></p>
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

// Performance Optimizations
const Detail = React.memo((props) => {
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
            <DetailTags tags={detailData.tags} />
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
}, (prevProps, nextProps) => {
    let checkResult = (prevProps.detailData !== null && nextProps.detailData !== null)
        && (prevProps.detailData.id === nextProps.detailData.id);
    return checkResult;
});

export default Detail;
