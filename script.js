const nodeHalfLength=42;
let state=0;

let nodesCounter=3;
let selectedNode;
let nodesElements=[];
let nodeTemplate=document.createElement("div");
nodeTemplate.className="node-js node";
nodeTemplate.draggable=false;
let addNodeButton=document.getElementById("add-node");
let nodesContainer=document.getElementById("nodes-container");

let creatingEdge;
let edges=[
    {
        begin: 'A',
        end: 'B',
        element: document.getElementById('AB')
    },
    {
        begin: 'C',
        end: 'B',
        element: document.getElementById('CB')
    },
    {
        begin: 'C',
        end: 'A',
        element: document.getElementById('CA')
    },
];
let edgesContainer=document.getElementById("edges-container");
let edgeTemplate=document.createElement("div");
edgeTemplate.classList.add("edge");
edgeTemplate.id="creating-edge";

let offset = [0,0];

main();

function main() {
    let nodes=document.getElementsByClassName("node-js");
    for(let i=0; i<nodes.length; i++){
        nodesElements.push(nodes[i]);
    }
    getNodes();
}

addNodeButton.addEventListener('click', (event)=>{
    let nodeID=String.fromCharCode(65+nodesCounter++);
    let newNode=nodeTemplate.cloneNode(false);
    newNode.id=`node-${nodeID}`;
    newNode.innerHTML=`
        <input class="identifier" id="node-${nodeID}-name" type="text" name="node-${nodeID}-name" value="${nodeID}">`;
    nodesElements.push(newNode);
    nodesContainer.appendChild(newNode);
    
    newNode.addEventListener('mousedown',onMouseDown,true);
    newNode.addEventListener('contextmenu',onRightClick,true);
});

window.addEventListener('resize', function(event) {
    getNodes();
}, true);

/**
 * @param {Event} event - The event
 */
function onMouseDown(event) {
    console.log("MOUSE DOWN!", state);

    let pressedButton=event.button;
    if(pressedButton===2){
        return;
    }

    if(state===2){
        /**
         * The element is not a node, then the edge creation is canceled.
        */
        document.removeEventListener('contextmenu',onRightClick,true);
        document.removeEventListener('mousemove',onMouseMove,true);
        document.removeEventListener('mouseup',onMouseUp,true);
        edgesContainer.removeChild(creatingEdge.element);
        creatingEdge=null;
        state=0;
        return false;
    }else if(state===0){
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
        state=1;
    }

}

/**
 * @param {Event} event - MouseUp Event
 */
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
 function onRightClick(event) {
    event.preventDefault();
    let element=event.target;
    if(state===0)
    {
        /**
         * @brief The state when the user will to create an edge between nodes
         */
        startCreateEdgeConection(element, event.clientX, event.clientY);
    }
    else if(state===2){
        /**
         * @brief The state when the creation of edge interaction is ended.
         */
         endCreateEdgeConection(element);
    }
    else if(state===-1)
    {
        /**
         * @brief The state when an edge has been setted right now, then the follow event on the other node is not activated.
         */
        state=0;
    }
}

/**
 * @param {Event} event - MouseMove Event
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
        calculateEndEdge(
            creatingEdge.element,
            getCenteredPixels(selectedNode.getBoundingClientRect().left),
            getCenteredPixels(selectedNode.getBoundingClientRect().top),
            x,
            y
        );
    }
}

function getNodes(){
    for(let i=0; i<nodesElements.length; i++){
        nodesElements[i].removeEventListener('mousedown',onMouseDown,true);
        nodesElements[i].addEventListener('mousedown',onMouseDown,true);
        nodesElements[i].addEventListener('contextmenu',onRightClick,true);

        updateEdges(nodesElements[i]);
    }
}

function getCenteredPixels(value){
    return value+nodeHalfLength;
}

/**
 * @param {Element} element - The node element
 * @param {Number} mouseX - The position x of mouse
 * @param {Number} mouseY - The position y of mouse
 */
 function startCreateEdgeConection(element, mouseX, mouseY){
            
    if(element.classList.contains('identifier')){
        selectedNode=element.parentElement;
    }else {
        selectedNode=element;
    }

    offset = [
        selectedNode.offsetLeft - mouseX,
        selectedNode.offsetTop - mouseY
    ];

    creatingEdge={
        element: edgeTemplate.cloneNode(false),
        begin: selectedNode.id.replace('node-',''),
        end: undefined,
    }
    edgesContainer.appendChild(creatingEdge.element);

    calculateStartEdge(
        creatingEdge.element,
        selectedNode.getBoundingClientRect().left,
        selectedNode.getBoundingClientRect().top
    );

    document.addEventListener('contextmenu',onRightClick,true);
    document.addEventListener('mousemove',onMouseMove,true);
    state=2; // The follow state
 }

/**
 * @param {Element} element - The node element
 */
function endCreateEdgeConection(element){
    document.removeEventListener('contextmenu',onRightClick,true);
    document.removeEventListener('mousemove',onMouseMove,true);
    document.removeEventListener('mouseup',onMouseUp,true);

    if(element.classList.contains('identifier')&&selectedNode!=element.parentElement){
        selectedNode=element.parentElement;
    }else if(element.classList.contains('node')&&selectedNode!=element){
        selectedNode=element;
    }else{
        /**
         * The element is not a node, then the edge creation is canceled.
        */
        edgesContainer.removeChild(creatingEdge.element);
        creatingEdge=null;
        state=0;
        return false;
    }

    state=-1;

    creatingEdge.end=selectedNode.id.replace('node-','');

    let id=creatingEdge.begin+creatingEdge.end;
    let id2=creatingEdge.end+creatingEdge.begin;
    let edgeID=`edge-${id}`;

    if(document.getElementById(edgeID)|| document.getElementById(`edge-${id2}`)){
        /**
         * The edge already exists, then the edge creation  is removed.
         */
        edgesContainer.removeChild(creatingEdge.element);
        creatingEdge=null;
        return false;
    }

    creatingEdge.element.id=edgeID;
    creatingEdge.element.innerHTML=`
        <span class="track-spot" id="edge-track-spot-${id}"></span>
        <input class="weight" type="number" value="0"
            id="edge-weight-${id}"
            name="edge-weight-${id}">
    `;
    edges.push(creatingEdge);
    recalculateEdgeWithIDs(creatingEdge.begin,creatingEdge.end);
    return true;
}

function updateEdges(nodeElement){
    let idToSearch=nodeElement.id.replace("node-", "");
    for(let i=0; i<edges.length; i++){
        if(idToSearch==edges[i].begin||idToSearch==edges[i].end){
            recalculateEdgeWithIDs(edges[i].begin, edges[i].end);
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

    edge.style.width=length+"px";
    if(dx>=0){
        edge.style.transform=`rotate(${angle}deg)`;
        edge.classList.remove('mirrored');
    }else{
        edge.style.transform=`rotate(${180+angle}deg)`;
        edge.classList.add('mirrored');
    }
}

var form = document.getElementById('edges-form');
form.addEventListener("submit", chargeResults);

/**
 * @param {Event} event - The event
 */
function chargeResults(event){
    event.preventDefault();
    const  formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    let entries=Object.entries(formProps);
    sortResults(entries);
    return false;
}

/**
 * @param {Array} edges - The edges with values
 */
function sortResults(edges){
    let sorted=edges.map((edge)=>{
        let ID=edge[0].replace("edge-weight-",'')
        return {
            begin: ID[0],
            end: ID[1],
            weight: Number(edge[1]),
        }
    }).sort((edge1, edge2)=>{
        if(edge1.weight==edge2.weight){
            return 0;
        }
        if(edge1.weight<edge2.weight){
            return -1;
        }
        if(edge1.weight>edge2.weight){
            return 1;
        }
    })
    calculateKruskalAlgorithm(sorted);
}
/**
 * @param {Array} edges - The edges with values
 */
function calculateKruskalAlgorithm(edges){
    let nodesVisited="";
    edges.forEach((edge,index)=>{
        let containsBegin=nodesVisited.includes(edge.begin);
        let containsEnd=nodesVisited.includes(edge.end);
        let edgeSpotElement=document.getElementById(`edge-track-spot-${edge.begin+edge.end}`);
        let edgeElement=document.getElementById(`edge-${edge.begin+edge.end}`);
        if(containsBegin&&containsEnd){
            edgeElement.style.backgroundColor="var(--color-1)";
            edgeSpotElement.innerHTML=null;
            edgeSpotElement.classList.remove("render");
            return false;
        }else{
            edgeElement.style.backgroundColor="var(--color-blue)";
            edgeSpotElement.innerHTML=index+1;
            edgeSpotElement.classList.add("render");
            nodesVisited+=edge.begin+edge.end;
        }
        return true;
    });
    // console.log(nodesVisited);
}