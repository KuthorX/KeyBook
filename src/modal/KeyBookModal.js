import React from 'react';

function KeyBookModal(props) {
    const modalId = props.modalId;

    return (
      <div>
        <div class="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="editingModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">KeeBook</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Version: 0.1.0 <br/>
                Developed by KuthorX
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-primary" data-dismiss="modal">I see</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default KeyBookModal;