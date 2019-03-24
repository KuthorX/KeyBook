import React, { useState } from 'react';

function EditDetailHeader(props) {
    const [name, setName] = useState(JSON.parse(JSON.stringify(props.name)));

    return (
        <div>
            <p>{name}</p>
        </div>
    )
}

function EditDetail(props) {
    let detail;
    
    detail = <div>
        <EditDetailHeader
            name={props.detailData.name}
        />
        <div>{props.detailData.name}</div>
    </div>;

    return (
        <div>
            {detail}
        </div>
    )
}

export default EditDetail;
