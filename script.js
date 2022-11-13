
var isDown = false;
var offset = [0,0];
var nodeOnMovement;
main();

function main() {
    let nodesElements=document.getElementsByClassName("node-js");
    let nodesElementsNames=document.getElementById(`identifier`);
    
    for(let i=0; i<nodesElements.length; i++){
        // nodesElements[i].addEventListener('dragends',(event)=>onDragEndsEvent(event),true);
        nodesElements[i].addEventListener('mousedown',(event)=>onMouseDown(event),true);
    }
}
function onMouseDown(e) {
    
    e.preventDefault();
    console.log(e.target);
    isDown = true;
    nodeOnMovement=e.target;
    console.log(nodeOnMovement.classList.contains('identifier'), nodeOnMovement.parentElement)
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
    console.log("UP");
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
let edges=[
    {
        edge: document.getElementById("edge-AB"),
        begin: 'A',
        end: 'B',
    },
    {
        edge: document.getElementById("edge-BC"),
        begin: 'B',
        end: 'C',
    },
];

const midLength=24;
/**
 * @param {Event} event - The event
 */
function onDragEndsEvent(event) {
    let element=event.target;
    let x=event.clientX-midLength;
    let y=event.clientY-midLength;
    event.target.style.left=x+"px";
    event.target.style.top=y+"px";
    
    updateEdges(event.target);
}

function updateEdges(element){
    let idToSearch=element.id.replace("node-", "");
    console.log("SEARCH:", idToSearch);

    for(let i=0; i<edges.length; i++){
        let begin=edges[i].begin;
        let end=edges[i].end;
        if(idToSearch==begin||idToSearch==end){
            console.log("FOUNDED WITH",end);
            recalculateEdge(begin, end);
        }
    }
}

function recalculateEdge(begin, end){
    let weightElement;
    let edge=document.getElementById(`edge-${begin+end}`);
    let nodeBegin=document.getElementById(`node-${begin}`);
    let nodeEnd=document.getElementById(`node-${end}`);
    let x1=nodeBegin.getBoundingClientRect().left+midLength,
        y1=nodeBegin.getBoundingClientRect().top+midLength,
        x2=nodeEnd.getBoundingClientRect().left+midLength,
        y2=nodeEnd.getBoundingClientRect().top+midLength;
    let length=Math.sqrt((x2-x1)**2+(y2-y1)**2);
    let angle=180*Math.atan((y2-y1)/(x2-x1))/Math.PI;
    console.log(x1,y1,x2,y2,length, angle);
    edge.style.left=x1+"px";
    edge.style.top=y1+"px";
    edge.style.width=length+"px";
    weightElement=document.getElementById(`${edge.id}-weight`);
    if(x1<=x2){
        edge.style.transform=`rotate(${angle}deg)`;
        weightElement.style.top="unset";
        weightElement.style.bottom="100%";
        weightElement.style.transform=`rotate(0deg) translateX(-50%)`;
    }else{
        edge.style.transform=`rotate(${180+angle}deg)`;
        weightElement.style.top="100%";
        weightElement.style.bottom="unset";
        weightElement.style.transform=`rotate(180deg) translateX(50%)`;
    }

}


