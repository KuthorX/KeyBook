import React from 'react';

function Spinners(props) {
    const ifShow = props.ifShow;

    let spinners;

    if (ifShow) {
        spinners = <div class="position-fixed vw-100 vh-100"
            style={{ "top": "0", "left": "0", "backgroundColor": "rgba(0, 0, 0, 0.0618)", "zIndex": 999 }}>
            <div class="position-absolute spinner-border text-primary"
                style={{ "top": "38.2%", "left": "0", "right": "0", "margin": "auto" }} role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>;
    }

    return (
        <div>
            {spinners}
        </div>
    )
}

export default Spinners;