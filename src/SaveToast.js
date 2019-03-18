import React from 'react';
import $ from 'jquery';

function SaveToast(props) {
    const ifSucceed = props.ifSucceed;
    const msg = props.msg;

    let alert;

    if (ifSucceed) {
        alert =
            <div class="toast bg-success position-fixed" role="alert" aria-live="assertive" aria-atomic="true"
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
            <div class="toast bg-danger position-fixed" role="alert" aria-live="assertive" aria-atomic="true"
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

export default SaveToast;