import React, { useState, useEffect } from 'react';

function OpenFilePage(props) {
    const encryptData = props.encryptData;
    const inputPw = props.inputPw;
    const fileName = props.fileName;

    let page;

    function onInputPwChange(event) {
        props.onInputPwChange(event.target.value);
    }
    function onPwOkClick() {
        props.onPwOkClick();
    }
    function onPwCancelClick() {
        props.onPwCancelClick();
    }

    if (!encryptData) {
        page = <>
            <div class="w-100 h-100 bg-light">
                <div class="container w-100 h-100 align-items-center d-flex justify-content-center">
                    <div className="row w-100">
                        <div class="col">
                            <h1 class="text-center text-primary">
                                Key Book
                            </h1>
                            <h2 class="text-center text-primary">
                                Manager your keys
                            </h2>
                            <button type="button" class="btn btn-outline-secondary btn-sm w-100 mt-3 text-center"
                                onClick={onOpenFileClick}>
                                Open File
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    } else {
        page = <>
            <div class="w-100 h-100 bg-light">
                <div class="container w-100 h-100 align-items-center d-flex justify-content-center">
                    <div className="row w-100">
                        <div class="col">
                            <h1 class="text-center text-primary">
                                Key Book
                            </h1>
                            <h2 class="text-center text-primary">
                                Manager your keys
                            </h2>
                            <h3>
                                {fileName}
                            </h3>
                            <div class="form-group mt-3">
                                <input type="email" class="form-control" value={inputPw}
                                    onChange={onInputPwChange}
                                    placeholder="Type your password" />
                            </div>
                            <button type="button" class="btn btn-outline-primary btn-sm w-100 mt-1 text-center"
                                onClick={onPwOkClick}>
                                Ok
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm w-100 mt-2 text-center"
                                onClick={onPwCancelClick}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }

    function onOpenFileClick() {
        props.onOpenFileClick();
    }

    return (
        <>
            {page}
        </>
    );
}

export default OpenFilePage;