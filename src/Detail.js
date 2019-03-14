import React, { useState } from 'react';
require('bootstrap');

function DetailItem(props) {
    return (
        <div class="row py-1 border-top">
            <div class="col-2 my-auto text-secondary p-0">
                {props.label}
            </div>
            <div class="col my-auto text-secondary">
                {props.value}
            </div>
            <div class="col-4 my-auto p-0">
                <button type="button" class="btn btn-outline-secondary btn-sm w-100">Copy</button>
            </div>
        </div>
    )
}

function DetailList(props) {
    const textArray = props.data;

    const DetailItems = textArray.map((dItem) =>
        <DetailItem key={dItem.label}
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

function DetailFooter() {
    return (
        <div>
            <button type="button" class="btn btn-outline-primary btn-sm w-100 my-1">Edit</button>
            <button type="button" class="btn btn-outline-danger btn-sm w-100 my-1">Delete</button>
        </div>
    )
}

function Detail(props) {
    const detailData = props.detailData;
    let detail;

    if (detailData) {
        detail = <div>
            <DetailHeader name={detailData.name} />
            <DetailList data={detailData.detailList} />
            <DetailFooter />
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
