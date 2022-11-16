let modalBoard = document.getElementById("modal-board");
let modalDanger = document.getElementById("modal-danger");
let modalDangerCloseButton = document.getElementById("modal-danger-close");
let modalDangerSuccessButton = document.getElementById("modal-danger-success");
let modalDangerCancelButton = document.getElementById("modal-danger-cancel");

function closeModal() {
  modalBoard.style.display = "none";
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
        
            modalDangerCancelButton.addEventListener("click", () => {
                closeModal();
                modalDangerCancelButton.removeEventListener("click",()=>{});
                resolve(false);
            });
            modalDangerCloseButton.addEventListener("click", () => {
                closeModal();
                modalDangerCloseButton.removeEventListener("click",()=>{});
                resolve(false);
            });
        
            modalDangerSuccessButton.addEventListener("click", () => {
                closeModal();
                modalDangerSuccessButton.removeEventListener("click",()=>{});
                resolve(true);
            });
        }
    );
}