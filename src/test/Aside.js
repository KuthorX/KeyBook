import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function PwListItem(props) {
    const name = props.name;
    const index = props.index;
    const activeIndex = props.activeIndex;

    let item;
    if (index === activeIndex) {
        item =
            <div class="text-break list-group-item list-group-item-action active">
                {name}
            </div>
            ;
    } else {
        item =
            <div class="text-break list-group-item list-group-item-action">
                {name}
            </div>
    }

    return (
        <div>
            {item}
        </div>
    )
}

function AsideHead(props) {
    function onAddClick() {
        props.onAddClick();
    }

    return (
        <div class="text-break w-100 mb-1">
            <button type="button" class="btn-sm btn-light w-100" onClick={onAddClick}>Add Account</button>
        </div>
    )

}

function Aside(props) {
    const data = props.data;

    const activeIndex = props.activeIndex;

    function onAddClick() {
        props.onAccountAddClick();
    }
    const pwListItems = data.map((pwListItem, index) =>
        <PwListItem
            key={pwListItem.id}
            activeIndex={activeIndex}
            index={index}
            name={pwListItem.name}
        />
    )

    return (
        <div>
            <AsideHead
                onAddClick={onAddClick}
            />
            <div class="list-group list-group-flush">
                {pwListItems}
            </div>
        </div>

    )
}

export default Aside;