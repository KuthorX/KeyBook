import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function PwListItem(props) {
    const name = props.name;
    const index = props.index;
    const activeIndex = props.activeIndex;

    function onItemClick() {
        props.onItemClick(name, index);
    }

    let item;
    if (index === activeIndex) {
        item =
            <div class="text-break">
                <Link to={`/account/${name}`} class="list-group-item list-group-item-action active"
                    onClick={onItemClick}>
                    {name}
                </Link>
            </div>
            ;
    } else {
        item =
            <div class="text-break">
            <Link to={`/account/${name}`} class="list-group-item list-group-item-action"
                    onClick={onItemClick}>
                    {name}
                </Link>
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

    const activeIndex = props.activeIndex;

    function onAddClick() {
        props.onAccountAddClick();
    }

    function onPwItemClick(name, index) {
        props.onPwItemClick(name, index);
    }

    const pwListItems = props.data.map((pwListItem, index) =>
        <PwListItem
            key={pwListItem.id}
            activeIndex={activeIndex}
            index={index}
            name={pwListItem.name}
            onItemClick={onPwItemClick}
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