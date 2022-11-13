const nodeHalfLength=42;
let state=0;

let selectedNode;
let nodesElements=document.getElementsByClassName("node-js");
let nodeTemplate=document.createElement("div");
nodeTemplate.className="node-js node";
nodeTemplate.id="creating-node";
nodeTemplate.name="creating-node";

let creatingEdge;
let edges=[];
let edgesContainer=document.getElementById("edges-container");
let edgeTemplate=document.createElement("div");
edgeTemplate.classList.add("edge");
edgeTemplate.id="creating-edge";

let offset = [0,0];

main();

function main() {
    getNodes();
}
function getNodes(){
    for(let i=0; i<nodesElements.length; i++){
        nodesElements[i].removeEventListener('mousedown',onMouseDown,true);
        nodesElements[i].addEventListener('mousedown',onMouseDown,true);
        nodesElements[i].addEventListener('contextmenu',onRightClick,true);

        updateEdges(nodesElements[i]);
    }
}
window.addEventListener('resize', function(event) {
    getNodes();
}, true);

/**
 * @param {Event} event - The event
 */
function onRightClick(event) {
    event.preventDefault();
    if(state===2){
        console.log("STATE:", state);

        document.removeEventListener('contextmenu',onRightClick,true);
        document.removeEventListener('mousemove',onMouseMove,true);
        document.removeEventListener('mouseup',onMouseUp,true);

        if(event.target.classList.contains('identifier')){
            selectedNode=event.target.parentElement;
        }else if(event.target.classList.contains('node')&&selectedNode!=event.target){
            selectedNode=event.target;
        }else{
            // console.log(creatingEdge.element);
            edgesContainer.removeChild(creatingEdge.element);
            creatingEdge=null;
            state=0;
            return;
        }
        creatingEdge.end=selectedNode.id.replace('node-','');

        let id1=creatingEdge.begin+creatingEdge.end;
        let id2=creatingEdge.end+creatingEdge.begin;
        let nodeId1=`edge-${id1}`;
        let nodeId2=`edge-${id2}`;
        if(document.getElementById(nodeId1)|| document.getElementById(nodeId2)){
            edgesContainer.removeChild(creatingEdge.element);
            creatingEdge=null;
            state=-1;
            return;
        }

        creatingEdge.element.id=nodeId1;
        creatingEdge.element.innerHTML=`
            <span class="track-spot" id="edge-${id1}-track-spot">-1</span>
            <input class="weight" type="number" value="0"
                id="edge-${id1}-weight"
                name="edge-${id1}-weight">
        `;
        console.log("END:",creatingEdge);
        edges.push(creatingEdge);
        recalculateEdgeWithIDs(creatingEdge.begin,creatingEdge.end);
        state=-1;
    }
    else if(state===-1)
    {
        state=0;
    }
    else{
        console.log("STATE:", state);
        state=2;
        
        if(event.target.classList.contains('identifier')){
            selectedNode=event.target.parentElement;
        }else {
            selectedNode=event.target;
        }
        offset = [
            selectedNode.offsetLeft - event.clientX,
            selectedNode.offsetTop - event.clientY
        ];
        creatingEdge={
            element: edgeTemplate.cloneNode(false),
            begin: selectedNode.id.replace('node-',''),
            end: undefined,
        }
        console.log("START:",creatingEdge);
        edgesContainer.appendChild(creatingEdge.element);
        calculateStartEdge(
            creatingEdge.element,
            selectedNode.getBoundingClientRect().left,
            selectedNode.getBoundingClientRect().top
        );
        document.addEventListener('contextmenu',onRightClick,true);
        document.addEventListener('mousemove',onMouseMove,true);
        // document.addEventListener('mouseup',onMouseUp,true);
    }
}

/**
 * @param {Event} event - The event
 */
function onMouseDown(event) {
    console.log("MOUSE DOWN!");
    let pressedButton=event.button;
    if(pressedButton==2){
        return;
    }
    state=1;
    if(event.target.classList.contains('identifier')){
        selectedNode=event.target.parentElement;
    }else{
        selectedNode=event.target;
    }
    offset = [
        selectedNode.offsetLeft - event.clientX,
        selectedNode.offsetTop - event.clientY
    ];
    document.addEventListener('mousemove',onMouseMove,true);
    document.addEventListener('mouseup',onMouseUp,true);
}

function onMouseUp(event) {
    console.log("MOUSE UP!");
    let pressedButton=event.button;
    if(pressedButton==2){
        return;
    }
    state=0;
    document.removeEventListener('mousemove', onMouseMove,true);
    document.removeEventListener('mouseup',onMouseUp,true);
    selectedNode=null;
}

/**
 * @param {Event} event - The event
 */
function onMouseMove(event) {
    event.preventDefault();
    
    let x = event.clientX,
        y = event.clientY;
    if(state===1){
        selectedNode.style.left = (x + offset[0]) + 'px';
        selectedNode.style.top  = (y + offset[1]) + 'px';
        updateEdges(selectedNode);
    }else if(state===2){
        // console.log(selectedNode);
        calculateEndEdge(
            creatingEdge.element,
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
    /* 
    console.log("X",x2, x1, dx);
    console.log("Y",y2, y1, dy);
    console.log("Length",length); */

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