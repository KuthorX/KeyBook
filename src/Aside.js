import React, { useState } from 'react';

function PwListItem(props) {
    const name = props.name;
    const index = props.index;
    const activeIndex = props.activeIndex;

    function onPwListItemClick() {
        props.handleItemClick(name, index);
    }

    let item;
    if (index === activeIndex) {
        item = <a href="#" class="list-group-item list-group-item-action active" onClick={onPwListItemClick}>{name}</a>;
    } else {
        item = <a href="#" class="list-group-item list-group-item-action" onClick={onPwListItemClick}>{name}</a>
    }

    return (
        <div>
            {item}
        </div>
    )
}

function Aside(props) {

    const activeIndex = props.activeIndex;

    function handleItemClick(name, index) {
        props.handlePwItemClick(name, index);
    }

    const pwListItems = props.data.map((pwListItem, index) =>
        <PwListItem
            key={pwListItem.name}
            activeIndex={activeIndex}
            index={index}
            name={pwListItem.name}
            handleItemClick={handleItemClick}
        />
    )

    return (
        <div class="list-group list-group-flush">
            {pwListItems}
        </div>
    )
}

export default Aside;