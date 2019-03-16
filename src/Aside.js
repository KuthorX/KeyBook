import React, { useState } from 'react';

function PwListItem(props) {
    const name = props.name;
    const index = props.index;

    function onPwListItemClick() {
        props.handleItemClick(name, index);
    }

    return (
        <a href="#" class="list-group-item list-group-item-action" onClick={onPwListItemClick}>{name}</a>
    )
}

function Aside(props) {

    function handleItemClick(name, index) {
        props.handlePwItemClick(name, index);
    }

    const pwListItems = props.data.map((pwListItem, index) =>
        <PwListItem
            key={pwListItem.name}
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