const nodeHalfLength=42;
let offset = [0,0];
let nodeOnMovement;
let nodesElements=document.getElementsByClassName("node-js");
let edges=[
    {
        begin: 'A',
        end: 'B',
    },
    {
        begin: 'B',
        end: 'C',
    },
];

main();

function main() {
    getNodes();
}
function getNodes(){
    for(let i=0; i<nodesElements.length; i++){
        // nodesElements[i].addEventListener('dragends',(event)=>onDragEndsEvent(event),true);
        
        nodesElements[i].removeEventListener('mousedown',onLeftClick,true);
        nodesElements[i].addEventListener('mousedown',onLeftClick,true);
        nodesElements[i].addEventListener('oncontextmenu',onRightClick,true);
        updateEdges(nodesElements[i]);
    }
}
window.addEventListener('resize', function(event) {
    getNodes();
}, true);
function onRightClick(e) {
    // console.log(e.target);
    isDown = true;
    nodeOnMovement=e.target;
    if(nodeOnMovement.classList.contains('identifier')){
        nodeOnMovement=nodeOnMovement.parentElement;
    }
    offset = [
        nodeOnMovement.offsetLeft - e.clientX,
        nodeOnMovement.offsetTop - e.clientY
    ];
    document.addEventListener('mousemove',onMouseMove,true);
    document.addEventListener('mouseup',onMouseUp,true);
}
function onLeftClick(e) {
    // console.log(e.target);
    isDown = true;
    nodeOnMovement=e.target;
    if(nodeOnMovement.classList.contains('identifier')){
        nodeOnMovement=nodeOnMovement.parentElement;
    }
    offset = [
        nodeOnMovement.offsetLeft - e.clientX,
        nodeOnMovement.offsetTop - e.clientY
    ];
    document.addEventListener('mousemove',onMouseMove,true);
    document.addEventListener('mouseup',onMouseUp,true);
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove,true);
    document.removeEventListener('mouseup',onMouseUp,true);
    nodeOnMovement=null;
}

function onMouseMove(event) {
    event.preventDefault();
    let mousePosition = {

        x : event.clientX,
        y : event.clientY

    };
    nodeOnMovement.style.left = (mousePosition.x + offset[0]) + 'px';
    nodeOnMovement.style.top  = (mousePosition.y + offset[1]) + 'px';
    updateEdges(event.target);
}

/**
 * @param {Event} event - The event
 */
function onDragEndsEvent(event) {
    let element=event.target;
    let x=event.clientX-nodeHalfLength;
    let y=event.clientY-nodeHalfLength;
    event.target.style.left=x+"px";
    event.target.style.top=y+"px";
    
    updateEdges(event.target);
}

function updateEdges(element){
    let idToSearch=element.id.replace("node-", "");
    for(let i=0; i<edges.length; i++){
        let begin=edges[i].begin;
        let end=edges[i].end;
        if(idToSearch==begin||idToSearch==end){
            // console.log("FOUNDED:",begin,"-",end);
            recalculateEdge(begin, end);
        }
    }
}

function recalculateEdge(begin, end){
    let weightElement;
    let edge=document.getElementById(`edge-${begin+end}`);
    let nodeBegin=document.getElementById(`node-${begin}`);
    let nodeEnd=document.getElementById(`node-${end}`);
    let x1=nodeBegin.getBoundingClientRect().left,
        y1=nodeBegin.getBoundingClientRect().top;
    let dx=nodeEnd.getBoundingClientRect().left-x1,
        dy=nodeEnd.getBoundingClientRect().top-y1;
    let length=Math.sqrt(dx**2+dy**2);
    let angle=180*Math.atan(dy/dx)/Math.PI;
    
    edge.style.left=x1+nodeHalfLength+"px";
    edge.style.top=y1+nodeHalfLength+"px";
    edge.style.width=length+"px";
    if(dx>=0){
        edge.style.transform=`rotate(${angle}deg)`;
        edge.classList.remove('mirrored');
    }else{
        edge.style.transform=`rotate(${180+angle}deg)`;
        edge.classList.add('mirrored');
    }

}


