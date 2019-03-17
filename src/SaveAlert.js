import React from 'react';
import $ from 'jquery';

function SaveAlert(props) {
    const ifSucceed = props.ifSucceed;
    const msg = props.msg;

    let alert;

    if (ifSucceed) {
        alert =
            <div aria-live="polite" aria-atomic="true" class="position-absolute"
                style={{
                    "top": "0", "left": "0", "right": "0",
                    "width": "300px", "minHeight": "200px", "margin": "0 auto"
                }}>
                <div class="toast bg-success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-body text-white text-center">
                        {msg}
                    </div>
                </div>
            </div>;
    } else {
        alert =
            <div aria-live="polite" aria-atomic="true" class="position-absolute"
                style={{
                    "top": "0", "left": "0", "right": "0",
                    "width": "300px", "minHeight": "200px", "margin": "0 auto"
                }}>
                <div class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-body text-white text-center">
                        {msg}
                    </div>
                </div>
            </div>;
    }

    return (
        <div>
            {alert}
        </div>
    )
}

export default SaveAlert;