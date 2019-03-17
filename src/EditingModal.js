import React from 'react';

function EditingModal(props) {
    const editingModalId = props.modalId;
  
    function onContinueEditClick() {
      props.onContinueEditClick();
    }
  
    function onDiscardClick() {
      props.onDiscardClick();
    }
  
    function onSaveClick() {
      props.onSaveClick();
    }
  
    return (
      <div>
        <div class="modal fade" id={editingModalId} tabIndex="-1" role="dialog" aria-labelledby="editingModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                You are editing account detail, what would you do with changes?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={onContinueEditClick}>Continue Edit</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={onDiscardClick}>Discard</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={onSaveClick}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default EditingModal;