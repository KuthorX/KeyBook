import React, { useState } from 'react';

function PwListItem(props) {
    const name = props.name;

    function onPwListItemClick() {
        props.handleItemClick(name);
    }

    return (
        <a href="#" class="list-group-item list-group-item-action" onClick={onPwListItemClick}>{name}</a>
    )
}

function Aside(props) {

    function handleItemClick(name) {
        props.handlePwItemClick(name);
    }

    const pwListItems = props.data.map((pwListItem) =>
        <PwListItem key={pwListItem.name}
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