import React, { useState, useEffect } from 'react';
import { copyTextToClipboard } from './Tools';

function DetailItem(props) {
    const label = props.label;
    const value = props.value;

    function onCopyClick() {
        let result = copyTextToClipboard(value);
        if (result) {
            setCopyStatus("success");
        } else {
            setCopyStatus("fail")
        }
        setTimeout(() => {
            setCopyStatus("normal")
        }, 500);
    }

    const [copyStatus, setCopyStatus] = useState("normal");
    let copyButton;

    switch (copyStatus) {
        case "normal":
            copyButton =
                <button type="button" class="btn btn-outline-secondary btn-sm w-100" onClick={onCopyClick}>Copy</button>;
            break;
        case "success":

            copyButton =
                <button type="button" class="btn btn-success btn-sm w-100" onClick={onCopyClick}>Copy</button>;
            break;
        case "fail":
            copyButton =
                <button type="button" class="btn btn-danger btn-sm w-100" onClick={onCopyClick}>Copy</button>;
            break;
        default:
            break;
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
                {copyButton}
            </div>
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
            <div class="row py-1 border-top text-secondary font-weight-bold">
                <div class="col-2 my-auto p-0">
                    Label
                </div>
                <div class="col my-auto">
                    Value
                </div>
                <div class="col-4 my-auto p-0">
                    Operation
                </div>
            </div>
            {DetailItems}
        </div>
    )
}

function DetailHeader(props) {
    return (
        <div class="my-auto py-2 border-bottom overflow-auto d-flex align-items-center">
            <h5 class="my-0 text-secondary font-italic"
            >{props.name}</h5>
            <button type="button"
                class="btn btn-link d-sm-none float-right text-decoration-none position-absolute"
                style={{ "right": "2px" }}
                onClick={props.onBackClick}>Back</button>
        </div>
    )
}

function DetailTags(props) {
    const tags = props.tags;
    return (
        <div>
            <p class="my-auto py-2 text-secondary"> <span class="text-secondary font-weight-bold">Tags</span> {tags}</p>
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

    function onBackClick() {
        props.onBackClick();
    }

    if (detailData) {
        detail = <div>
            <DetailHeader name={detailData.name} onBackClick={onBackClick} />
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
};

export default Detail;
