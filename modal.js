let modalBoard=document.getElementById('modal-board');
let modalDanger=document.getElementById('modal-danger');
let modalDangerCloseButton=document.getElementById('modal-danger-close');
let modalDangerSuccessButton=document.getElementById('modal-danger-success');
let modalDangerCancelButton=document.getElementById('modal-danger-cancel');
let closeWindow=0;

async function openModal(type){
    if(type==='danger'){
        modalBoard.style.display='flex';
        let promise = closeWindow!=0? new Promise(
            (resolve) => {
                console.log("RESOLVED");
            }
        ) : Promise.resolve(closeWindow);
        
        return promise.then();
    }
}
function closeModal(){
    modalBoard.style.display='none';
    closeWindow=-11;
}
function succesModal(){
    modalBoard.style.display='none';
    closeWindow=1;
}


modalDangerCancelButton.addEventListener('click',closeModal, true);
modalDangerCloseButton.addEventListener('click',closeModal, true);
modalDangerSuccessButton.addEventListener('click',succesModal, true);