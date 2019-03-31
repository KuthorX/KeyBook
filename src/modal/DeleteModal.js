import React from 'react';

function DeleteModal(props) {
    const modalId = props.modalId;
  
    function onNoClick() {
      props.onNoClick();
    }
  
    function onYesClick() {
      props.onYesClick();
    }
  
    return (
      <div>
        <div class="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="editingModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Warning</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Are you sure to delete this account?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={onNoClick}>No</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" onClick={onYesClick}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default DeleteModal;