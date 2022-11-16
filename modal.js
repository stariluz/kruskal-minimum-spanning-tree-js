let modalBoard = document.getElementById("modal-board");
let modalDanger = document.getElementById("modal-danger");
let modalDangerCloseButton = document.getElementById("modal-danger-close");
let modalDangerSuccessButton = document.getElementById("modal-danger-success");
let modalDangerCancelButton = document.getElementById("modal-danger-cancel");
let modalResponse = undefined;
class Modal {
  constructor({ questionText, trueButtonText, falseButtonText }) {
    this.questionText =
      questionText || "¿Estás segur@ que deseas borrar el elemento?";
    this.trueButtonText = trueButtonText || "Sí";
    this.falseButtonText = falseButtonText || "No";

    this.dialog = undefined;
    this.trueButton = undefined;
    this.falseButton = undefined;
    this.parent = document.body;

    this._createModal();
    this._appendModal();
  }
  _createModal() {
    modalBoard.style.display = "flex";
    /* 
    this.dialog = document.createElement("dialog");
    this.dialog.classList.add("confirm-dialog");

    const question = document.createElement("div");
    question.textContent = this.questionText;
    question.classList.add("confirm-dialog-question");
    this.dialog.appendChild(question);

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("confirm-dialog-button-group");
    this.dialog.appendChild(buttonGroup);

    this.falseButton = document.createElement("button");
    this.falseButton.classList.add(
      "confirm-dialog-button",
      "confirm-dialog-button--false"
    );
    this.falseButton.type = "button";
    this.falseButton.textContent = this.falseButtonText;
    buttonGroup.appendChild(this.falseButton);

    this.trueButton = document.createElement("button");
    this.trueButton.classList.add(
      "confirm-dialog-button",
      "confirm-dialog-button--true"
    );
    this.trueButton.type = "button";
    this.trueButton.textContent = this.trueButtonText;
    buttonGroup.appendChild(this.trueButton); */
  }

  /* _appendDialog() {
    this.parent.appendChild(this.dialog);
  } */

  /* _destroy() {
    this.parent.removeChild(this.dialog);
    delete this;
  } */
  
}
/* async function openModal(type) {
  if (type === "danger") {
    modalBoard.style.display = "flex";
  }
} */
function closeModal() {
  modalBoard.style.display = "none";
//   modalResponse = true;
}
function succesModal() {
  modalBoard.style.display = "none";
  modalResponse = false;
}
function openModal(type) {
    modalBoard.style.display = "flex";
    if(type==="danger")
    return new Promise(
        (resolve, reject) => {
            /* const somethingWentWrongUponCreation = 
                !this.dialog || !this.trueButton || !this.falseButton;
            if (somethingWentWrongUponCreation) {
                reject("Something went wrong upon modal creation");
            } */
        
            // this.dialog.showModal();
        
            modalDangerCancelButton.addEventListener("click", () => {
                closeModal();
                resolve(false);
                // this._destroy();
            });
            modalDangerCloseButton.addEventListener("click", () => {
                closeModal();
                resolve(false);
                // this._destroy();
            });
        
            modalDangerSuccessButton.addEventListener("click", () => {
                closeModal();
                resolve(true);
                // this._destroy();
            });
        }
    );
}

// modalDangerCancelButton.addEventListener("click", closeModal, true);
// modalDangerCloseButton.addEventListener("click", closeModal, true);
// modalDangerSuccessButton.addEventListener("click", succesModal, true);
