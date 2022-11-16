let modalBoard = document.getElementById("modal-board");
let modalDanger = document.getElementById("modal-danger");
let modalDangerCloseButton = document.getElementById("modal-danger-close");
let modalDangerSuccessButton = document.getElementById("modal-danger-success");
let modalDangerCancelButton = document.getElementById("modal-danger-cancel");

let modalInfo = document.getElementById("modal-info");
let modalInfoCloseButton = document.getElementById("modal-info-close");

function openModal(type) {
    modalBoard.style.display = "flex";
    if(type==="danger"){
        modalDanger.style.display = "block";
        return new Promise(
            (resolve, reject) => {
            
                modalDangerCancelButton.addEventListener("click", () => {
                    closeModal(modalDanger);
                    modalDangerCancelButton.removeEventListener("click",()=>{});
                    resolve(false);
                });
                modalDangerCloseButton.addEventListener("click", () => {
                    closeModal(modalDanger);
                    modalDangerCloseButton.removeEventListener("click",()=>{});
                    resolve(false);
                });
            
                modalDangerSuccessButton.addEventListener("click", () => {
                    closeModal(modalDanger);
                    modalDangerSuccessButton.removeEventListener("click",()=>{});
                    resolve(true);
                });
            }
        );
    }else if(type==="info"){
        modalInfo.style.display = "block";
        return new Promise(
            (resolve, reject) => {
                modalInfoCloseButton.addEventListener("click", () => {
                    closeModal(modalInfo);
                    modalInfoCloseButton.removeEventListener("click",()=>{});
                    resolve(false);
                });
            }
        );
    }
}

function closeModal(modalElement) {
    modalElement.style.display="none";
    modalBoard.style.display = "none";
}

let infoButton=document.getElementById("info-button");
infoButton.addEventListener("click",()=>{
    openModal("info");
});