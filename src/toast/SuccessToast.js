import React from 'react';

function SuccesToast(props) {
    const id = props.toastId;
    const msg = props.msg;

    let alert =
        <div id={id} class="toast bg-success position-fixed" role="alert" aria-live="assertive" aria-atomic="true"
            style={{
                "top": "0", "left": "0", "right": "0",
                "width": "auto", "height": "auto", "margin": "0 auto"
            }}>
            <div class="toast-body text-white text-center">
                {msg}
            </div>
        </div>;

    return (
        <div>
            {alert}
        </div>
    )
}

export default SuccesToast;