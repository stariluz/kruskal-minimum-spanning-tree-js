const nodeHalfLength=42;
let state=0;
let offset = [0,0];
let nodeOnMovement;
let selectedNode;
let edgesContainer=document.getElementById("edges-container")
let nodesElements=document.getElementsByClassName("node-js");
let edges=[
    /* {
        element: document.getElementById("edge-AB"),
        begin: 'A',
        end: 'B',
    }, */
    /* {
        element: document.getElementById("edge-BC"),
        begin: 'B',
        end: 'C',
    }, */
];
let lastEdge;

main();

function main() {
    getNodes();
}
function getNodes(){
    for(let i=0; i<nodesElements.length; i++){
        // nodesElements[i].addEventListener('dragends',(event)=>onDragEndsEvent(event),true);
        
        nodesElements[i].removeEventListener('mousedown',onMouseDown,true);
        nodesElements[i].addEventListener('mousedown',onMouseDown,true);
        nodesElements[i].addEventListener('contextmenu',onRightClick,true);

        updateEdges(nodesElements[i]);
    }
}
window.addEventListener('resize', function(event) {
    getNodes();
}, true);
function onRightClick(event) {
    event.preventDefault();
    if(state===2){
        if(event.target.classList.contains('identifier')){
            selectedNode=event.target.parentElement;
        }else if(event.target.classList.contains('node')){
            selectedNode=event.target;
        }else{
            lastEdge=null;
            return;
        }

        lastEdge.end=selectedNode.id.replace('node-',''),
        lastEdge.element.id="edge-${lastEdge.begin+lastEdge.end}";
        lastEdge.element.innerHTML=`
            <span class="track-spot" id="edge${lastEdge.begin+lastEdge.end}-track-spot">-1</span>
            <input class="weight" id="edge-${lastEdge.begin+lastEdge.end}-weight" type="number" value="0">
        `;
        recalculateEdgeWithIDs(lastEdge.begin,lastEdge.end);
        edgesContainer.push(lastEdge);

        document.addEventListener('contextmenu',onRightClick,true);
        document.removeEventListener('mousemove',onMouseMove,true);
        document.removeEventListener('mouseup',onMouseUp,true);
    }else{
        state=2;
        
        if(event.target.classList.contains('identifier')){
            selectedNode=event.target.parentElement;
        }else{
            selectedNode=event.target;
        }
        offset = [
            selectedNode.offsetLeft - event.clientX,
            selectedNode.offsetTop - event.clientY
        ];
        lastEdge={
            element: document.createElement("div"),
            begin: selectedNode.id.replace('node-',''),
            end: undefined,
        }
        lastEdge.element.classList.add("edge");
        lastEdge.element.id="creating-edge";
        lastEdge.element.innerHTML=``;
        edgesContainer.appendChild(lastEdge.element);
        calculateStartEdge(
            lastEdge.element,
            selectedNode.getBoundingClientRect().left,
            selectedNode.getBoundingClientRect().top
        );
        document.addEventListener('contextmenu',onRightClick,true);
        document.addEventListener('mousemove',onMouseMove,true);
        document.addEventListener('mouseup',onMouseUp,true);
    }
}
function onMouseDown(event) {
    state=1;
    
    if(event.target.classList.contains('identifier')){
        nodeOnMovement=event.target.parentElement;
    }else{
        nodeOnMovement=event.target;
    }
    offset = [
        nodeOnMovement.offsetLeft - event.clientX,
        nodeOnMovement.offsetTop - event.clientY
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
    
    let x = event.clientX,
        y = event.clientY;
    if(state===1){
        nodeOnMovement.style.left = (x + offset[0]) + 'px';
        nodeOnMovement.style.top  = (y + offset[1]) + 'px';
        updateEdges(nodeOnMovement);
    }else if(state===2){
        // console.log(selectedNode);
        console.log(
        );
        calculateEndEdge(
            lastEdge.element,
            getCenteredPixels(selectedNode.getBoundingClientRect().left),
            getCenteredPixels(selectedNode.getBoundingClientRect().top),
            x,
            y
        );
    }
}
function getCenteredPixels(value){
    return value+nodeHalfLength;
}

/**
 * @param {Event} event - The event
 */
function onDragEndsEvent(event) {
    let element=event.target;
    let x=getCenteredPixels(event.clientX),
        y=getCenteredPixels(event.clientY);
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
            recalculateEdgeWithIDs(begin, end);
        }
    }
}

function recalculateEdgeWithPosition(edge, x1, y1, x2, y2){
    calculateStartEdge(edge, x1,y1);
    calculateEndEdge(edge,x1,y1,x2,y2);
}
function recalculateEdgeWithElementAndPosition(edge, begin, x2, y2){
    let x1=begin.getBoundingClientRect().left,
        y1=begin.getBoundingClientRect().top;
    
    recalculateEdgeWithPosition(edge, x1, y1, x2, y2)
}
function recalculateEdgeWithElements(edge, nodeBegin, nodeEnd){
    let x1=nodeBegin.getBoundingClientRect().left,
        y1=nodeBegin.getBoundingClientRect().top;
    let x2=nodeEnd.getBoundingClientRect().left,
        y2=nodeEnd.getBoundingClientRect().top;
    
    recalculateEdgeWithPosition(edge, x1, y1, x2, y2)
}
function recalculateEdgeWithIDs(begin, end){
    let edge=document.getElementById(`edge-${begin+end}`);
    let nodeBegin=document.getElementById(`node-${begin}`);
    let nodeEnd=document.getElementById(`node-${end}`);
    
    recalculateEdgeWithElements(edge, nodeBegin, nodeEnd);
}

function calculateStartEdge(edge, x1, y1){
    edge.style.left=getCenteredPixels(x1)+"px";
    edge.style.top=getCenteredPixels(y1)+"px";
}
function calculateEndEdge(edge, x1, y1, x2, y2){
    let dx=x2-x1,
        dy=y2-y1;
    let length=Math.sqrt(dx**2+dy**2);
    let angle=180*Math.atan(dy/dx)/Math.PI;
    
    console.log("X",x2, x1, dx);
    console.log("Y",y2, y1, dy);
    console.log("Length",length);

    edge.style.width=length+"px";
    if(dx>=0){
        edge.style.transform=`rotate(${angle}deg)`;
        edge.classList.remove('mirrored');
    }else{
        edge.style.transform=`rotate(${180+angle}deg)`;
        edge.classList.add('mirrored');
    }
}
/* function calculateEndEdgeWithBegin(edge, nodeBegin, x2, y2){
    let x1=nodeBegin.getBoundingClientRect().left,
        y1=nodeBegin.getBoundingClientRect().top;
    let dx=x2-x1,
        dy=y2-y1;
    let length=Math.sqrt(dx**2+dy**2);
    let angle=180*Math.atan(dy/dx)/Math.PI;

    edge.style.width=length+"px";
    if(dx>=0){
        edge.style.transform=`rotate(${angle}deg)`;
        edge.classList.remove('mirrored');
    }else{
        edge.style.transform=`rotate(${180+angle}deg)`;
        edge.classList.add('mirrored');
    }
} */