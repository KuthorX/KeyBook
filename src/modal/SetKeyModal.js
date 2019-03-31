import React, {useState} from 'react';
import $ from 'jquery';

function SetKeyModal(props) {
  const modalId = props.modalId;
  const userKey = props.userKey;
  const [userKeyConfirm, setUserKeyConfirm] = useState("");

  function onUserKeyChange(event) {
    props.onUserKeyChange(event.target.value);
  }

  function onUserKeyConfirmChange(event) {
    setUserKeyConfirm(event.target.value);
  }

  function onCancelClick() {
    props.onCancelClick();
  }

  function onConfirmClick() {
    if(userKey !== userKeyConfirm) {
      var animationEvent = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
      $("#userKeyGroup").addClass('shake-horizontal');
      $("#userKeyGroup > input").addClass('btn-outline-danger');
      $("#userKeyGroup").one(animationEvent, function (event) {
        $("#userKeyGroup").removeClass('shake-horizontal btn-danger');
        $("#userKeyGroup > input").removeClass('btn-outline-danger');
      });
    } else {
      props.onConfirmClick();
      $(`#${modalId}`).modal('hide');
    }
  }

  return (
    <div>
      <div class="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="editingModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Set Key</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group my-0" id="userKeyGroup">
                <input type="password" class="form-control" value={userKey} placeholder="New key"
                  onChange={onUserKeyChange}/>
                <input type="password" class="form-control mt-2" value={userKeyConfirm} placeholder="Confirm it"
                  onChange={onUserKeyConfirmChange}/>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={onCancelClick}>Cancel</button>
              <button type="button" class="btn btn-danger" onClick={onConfirmClick}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetKeyModal;