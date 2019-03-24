import React, { useState } from 'react';

function Detail(props) {
    const detailData = props.detailData;

    let detail;

    if (detailData) {
        detail = <div>
            <h5> {props.detailData.name} </h5>
        </div>;
    } else {
        detail = <div>
            <h5>Please choose an account :)</h5>
        </div>;
    }

    return (
        <div>
            {detail}
        </div>
    )
}

export default Detail;
