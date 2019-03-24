import React from 'react';
import { Link } from 'react-router-dom';

function PwListItem(props) {
    const name = props.name;
    const index = props.index;
    const activeIndex = props.activeIndex;

    function onItemClick() {
        props.onItemClick(name, index);
    }

    function onItemMouseEnter() {
        // props.onItemClick(name, index);
    }

    function onItemFocus() {
        // props.onItemClick(name, index);
    }

    function onKeyDown(event) {
        console.log(event.key);
        if (event.key === 'Enter' || event.key === ' ') {
            props.onItemClick(name, index);
        }
    }

    let item;
    if (index === activeIndex) {
        item =
            <div class="text-break list-group-item list-group-item-action active"  tabIndex="0">
                {name}
            </div>
            ;
    } else {
        item =
            <div class="text-break list-group-item list-group-item-action" tabIndex="0"
                onMouseOver={onItemMouseEnter} onFocus={onItemFocus} onClick={onItemClick} onKeyDown={onKeyDown}>
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

    function onPwItemClick(name, index) {
        props.onPwItemClick(name, index);
    }

    const pwListItems = data.map((pwListItem, index) =>
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