import React from 'react';

function CopyToast(props) {
    const id = props.toastId;
    const ifSucceed = props.ifSucceed;
    const msg = props.msg;

    let alert;
    
    if (ifSucceed) {
        alert =
            <div id={id} class="toast bg-success position-fixed" role="alert" aria-live="assertive" aria-atomic="true"
                style={{
                    "top": "0", "left": "0", "right": "0",
                    "width": "auto", "height": "auto", "margin": "0 auto"
                }}>
                <div class="toast-body text-white text-center">
                    {msg}
                </div>
            </div>;
    } else {
        alert =
            <div id={id} class="toast bg-danger position-fixed" role="alert" aria-live="assertive" aria-atomic="true"
                style={{
                    "top": "0", "left": "0", "right": "0",
                    "width": "auto", "height": "auto", "margin": "0 auto"
                }}>
                <div class="toast-body text-white text-center">
                    {msg}
                </div>
            </div>;
    }

    return (
        <div>
            {alert}
        </div>
    )
}

export default CopyToast;