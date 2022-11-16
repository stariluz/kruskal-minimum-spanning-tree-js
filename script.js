const HALF_NODE_LENGTH=42;
const deleteDropzoneID='delete-dropzone';
let state=0;
class TreeNode{
    id=String;
    name=String;
    element=Element;
    nameInput=Element;
    constructor(id,element,nameInput=null)
    {
        this.id=id;
        this.element=element;
        if(element!=null&&nameInput!=null){
            this.nameInput=document.getElementById(`node-name-${id}`);
            this.name=this.nameInput.target.value;
        }
    }
}
class Edge{
    begin=String;
    end=String;
    element=Element;
    weightInput=Element;
    weight=Number;
    constructor(element, begin, end=null)
    {
        this.element=element;
        this.begin=begin;
        if(end!==null){
            this.end=end;
            this.setWeightInput(begin+end);
        }
    }
    setWeightInput(id){
        this.weightInput=document.getElementById(`edge-weight-${id}`);
        this.weightInput.addEventListener("input",onInputEvent,true);
        this.weight=Number(this.weightInput.value);
    }
}

let nodesCounter=3;
let selectedNode;
let nodesElements=[];
let nodes={
    /* 'A': {
        id: 'A',
        name: 'A',
        element: document.getElementById('node-A'),
        nameInput: document.getElementById('node-name-A'),
    } */
};
let nodeTemplate=document.createElement("div");
nodeTemplate.className="node-js node";
nodeTemplate.draggable=false;
let addNodeButton=document.getElementById("add-node");
let nodesContainer=document.getElementById("nodes-container");

let creatingEdge;
let edges={
    'AB': new Edge(
        document.getElementById('edge-AB'),'A','B'
    ),
    'CB': new Edge(
        document.getElementById('edge-CB'),'C','B'
    ),
    'CA': new Edge(
        document.getElementById('edge-CA'),'C','A'
    ),
};
let edgesContainer=document.getElementById("edges-container");
let edgeTemplate=document.createElement("div");
edgeTemplate.classList.add("edge");
edgeTemplate.id="creating-edge";

let offset = [0,0];

main();

function main() {
    let _nodesElements=document.getElementsByClassName("node-js");
    for(let i=0; i<_nodesElements.length; i++){
        let id=_nodesElements[i].id.replace("node-","")
        nodes[id]=new TreeNode(id,_nodesElements[i]);
    }
    initEdges();
    initNodes();
}
function initEdges(){
    for(let edgeKey in edges){
        edges[edgeKey].setWeightInput(edgeKey);
        edges[edgeKey].weightInput.addEventListener("input", onInputEvent, true);
    }
}

function initNodes(){
    for(let nodeKey in nodes){
        nodes[nodeKey].element.removeEventListener('mousedown',onMouseDown,true);
        nodes[nodeKey].element.addEventListener('mousedown',onMouseDown,true);
        nodes[nodeKey].element.addEventListener('contextmenu',onRightClick,true);

        // nodes[nodeKey].element.removeEventListener('touchstart', onMouseDown, false);
        // nodes[nodeKey].element.addEventListener('touchstart', onTouchStart, false);

        updateEdges(nodes[nodeKey]);
    }
}

function getCenteredPixels(value)
{
    return value+HALF_NODE_LENGTH;
}

/**
 * 
 * @param {Element} nodeElement 
 */
 function setSelectedNode(nodeElement){
    // console.log(nodeElement);
    if(nodeElement.classList.contains('identifier')){
        nodeElement=nodeElement.parentElement;
    }else if(!nodeElement.classList.contains('node-js')){
        
        return false;
    }
    // console.log(nodes);
    for(let key in nodes){
        if(nodes[key].element==nodeElement){
            selectedNode=nodes[key];
            console.log("SELECTED: ", selectedNode);
            return true;
        }
    }
    return false;
}

addNodeButton.addEventListener('click',
    (event)=>{
        let nodeID=String.fromCharCode(65+nodesCounter++);
        let newNode=nodeTemplate.cloneNode(false);
        newNode.id=`node-${nodeID}`;
        newNode.innerHTML=`
            <input class="identifier" type="text"
            id="node-name-${nodeID}" name="node-name-${nodeID}"
            value="${nodeID}">`;
        nodes[nodeID]=new TreeNode(
            nodeID,
            newNode
        )
        nodesContainer.appendChild(newNode);
        
        newNode.addEventListener('mousedown',onMouseDown,true);
        newNode.addEventListener('contextmenu',onRightClick,true);
    }
);

window.addEventListener('resize', (event) => initNodes(), true);

/**
 * @param {Event} event - The event
 */
function onMouseDown(event) {
    console.log("MOUSE DOWN!", state);

    let pressedButton=event.button;
    if(pressedButton===2){
        return;
    }

    enableDeleteNode();

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
        let nodeElement=event.target;
        setSelectedNode(nodeElement);

        offset = [
            selectedNode.element.offsetLeft - event.clientX,
            selectedNode.element.offsetTop - event.clientY
        ];
    
        document.addEventListener('mousemove',onMouseMove,true);
        document.addEventListener('mouseup',onMouseUp,true);
        state=1;
    }

}

/**
 * @param {MouseEvent} event - MouseMove Event
 */
 function onMouseMove(event) {
    let x = event.clientX,
        y = event.clientY;

    if(state===1){
        selectedNode.element.style.left = (x + offset[0]) + 'px';
        selectedNode.element.style.top  = (y + offset[1]) + 'px';
        updateEdges(selectedNode);
    }else if(state===2){
        calculateEndEdge(
            creatingEdge.element,
            getCenteredPixels(selectedNode.element.getBoundingClientRect().left),
            getCenteredPixels(selectedNode.element.getBoundingClientRect().top),
            x,
            y
        );
    }
}
/**
 * @param {MouseEvent} event - MouseUp Event
 */
function onMouseUp(event) {
    console.log("MOUSE UP!", state);

    if(event.button==2){
        return;
    }

    let x = event.clientX,
        y = event.clientY;

    if(state===1){
        let otherElements=document.elementsFromPoint(x,y);
        let deleteZone=otherElements[otherElements.length-2];
        if(deleteZone.id===deleteDropzoneID){
            deleteNode();
        }
    }else{
        selectedNode=null;
    }
    state=0;
    document.removeEventListener('mousemove', onMouseMove,true);
    document.removeEventListener('mouseup',onMouseUp,true);
    disableDeleteNode();
}

/**
 * @param {Event} event - The event
 */
 function onRightClick(event)
 {
    event.preventDefault();
    let element=event.target;
    if(state===0)
    {
        /**
         * @brief The state when the user will to create an edge between nodes
         */

        state=2;
        setSelectedNode(element);
        startCreateEdgeConection(event.clientX, event.clientY);
    }
    else if(state===2)
    {
        /**
         * @brief The state when the creation of edge interaction is ended.
         */
        
        document.removeEventListener('contextmenu',onRightClick,true);
        document.removeEventListener('mousemove',onMouseMove,true);
        document.removeEventListener('mouseup',onMouseUp,true);

        if(setSelectedNode(element)){
            state=-1;
            endCreateEdgeConection(element);
        }
        else
        {
            /**
             * @brief The element is not a node, then the edge creation is canceled.
             */

            edgesContainer.removeChild(creatingEdge.element);
            creatingEdge=null;
            state=0;
            return false;
        }
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
 * @param {Number} mouseX - The position x of mouse
 * @param {Number} mouseY - The position y of mouse
 */
 function startCreateEdgeConection(mouseX, mouseY){
    
    offset = [
        selectedNode.element.offsetLeft - mouseX,
        selectedNode.element.offsetTop - mouseY
    ];

    creatingEdge=new Edge(
        edgeTemplate.cloneNode(false),
        selectedNode.id
    );
    edgesContainer.appendChild(creatingEdge.element);

    calculateStartEdge(
        creatingEdge.element,
        selectedNode.element.getBoundingClientRect().left,
        selectedNode.element.getBoundingClientRect().top
    );

    document.addEventListener('contextmenu',onRightClick,true);
    document.addEventListener('mousemove',onMouseMove,true);
}

function endCreateEdgeConection(){
    creatingEdge.end=selectedNode.id;

    let id=creatingEdge.begin+creatingEdge.end;
    let id2=creatingEdge.end+creatingEdge.begin;
    const edgeID=`edge-${id}`;
    if(id in edges||id2 in edges){
        /**
         * @brief The edge already exists, then the edge creation  is removed.
         */
        
        edgesContainer.removeChild(creatingEdge.element);
        creatingEdge=null;
        return false;
    }

    creatingEdge.element.id=edgeID;
    creatingEdge.element.innerHTML=`
        <span class="track-spot" id="edge-track-spot-${id}"></span>
        <input class="weight" type="number" value="0" step="0.01"
            id="edge-weight-${id}"
            name="edge-weight-${id}">
    `;
    console.log(creatingEdge);
    creatingEdge.setWeightInput(id);
    edges[id]=creatingEdge;
    recalculateEdge(creatingEdge);
    return true;
}

/**
 * 
 * @param {TreeNode} node 
 */
function updateEdges(node){
    for(let edgeKey in edges){
        if(node.id===edges[edgeKey].begin||node.id===edges[edgeKey].end){
            recalculateEdge(edges[edgeKey]);
        }
    }
}

////////////////////////// CALCULATION OF EDGES

/**
 * 
 * @param {Element} edgeElement 
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 */
function recalculateEdgeWithPosition(edgeElement, x1, y1, x2, y2)
{
    calculateStartEdge(edgeElement, x1,y1);
    calculateEndEdge(edgeElement,x1,y1,x2,y2);
}
/**
 * 
 * @param {Element} edgeElement 
 * @param {Element} nodeBeginElement
 * @param {Number} x2 
 * @param {Number} y2 
 */
function recalculateEdgeWithElementAndPosition(edgeElement, nodeBeginElement, x2, y2)
{
    let x1=nodeBeginElement.getBoundingClientRect().left,
        y1=nodeBeginElement.getBoundingClientRect().top;
    
    recalculateEdgeWithPosition(edgeElement, x1, y1, x2, y2)
}
/**
 * 
 * @param {Element} edgeElement 
 * @param {Element} nodeBeginElement 
 * @param {Element} nodeEndElement 
 */
function recalculateEdgeWithElements(edgeElement, nodeBeginElement, nodeEndElement)
{
    let x1=nodeBeginElement.getBoundingClientRect().left,
        y1=nodeBeginElement.getBoundingClientRect().top;
    let x2=nodeEndElement.getBoundingClientRect().left,
        y2=nodeEndElement.getBoundingClientRect().top;
    
    recalculateEdgeWithPosition(edgeElement, x1, y1, x2, y2)
}
/**
 * 
 * @param {Edge} edge 
 */
function recalculateEdge(edge)
{
    recalculateEdgeWithElements(
        edge.element,
        nodes[edge.begin].element,
        nodes[edge.end].element,
    );
}
/**
 * 
 * @param {Element} edgeElement 
 * @param {Number} x1 
 * @param {Number} y1
 */
function calculateStartEdge(edgeElement, x1, y1)
{
    edgeElement.style.left=getCenteredPixels(x1)+"px";
    edgeElement.style.top=getCenteredPixels(y1)+"px";
}
/**
 * 
 * @param {Element} edgeElement 
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 */
function calculateEndEdge(edgeElement, x1, y1, x2, y2)
{
    let dx=x2-x1,
        dy=y2-y1;
    let length=Math.sqrt(dx**2+dy**2);
    let angle=180*Math.atan(dy/dx)/Math.PI;

    edgeElement.style.width=length+"px";
    if(dx>=0){
        edgeElement.style.transform=`rotate(${angle}deg)`;
        edgeElement.classList.remove('mirrored');
    }else{
        edgeElement.style.transform=`rotate(${180+angle}deg)`;
        edgeElement.classList.add('mirrored');
    }
}

////////////////////////// END: CALCULATION OF EDGES

////////////////////////// DELETE NODES

let deleteDropzone=document.getElementById(deleteDropzoneID);
function enableDeleteNode(){
    deleteDropzone.classList.add('droppable');
    deleteDropzone.addEventListener('mouseenter',()=>{
        deleteDropzone.classList.add('hover');
    });
    deleteDropzone.addEventListener('mouseleave',()=>{
        deleteDropzone.classList.remove('hover');
    });
}
function disableDeleteNode(){
    deleteDropzone.classList.remove('droppable');
    deleteDropzone.classList.remove('hover');
}
async function deleteNode(){
    let deleteModal=await openModal('danger');
    console.log("RESPONSE:",deleteModal);
    if(deleteModal){
        
        let id=selectedNode.id
        for(let key in edges){
            if(edges[key].begin===id||edges[key].end===id){
                edgesContainer.removeChild(edges[key].element);
                delete edges[key];
            }
        }
        nodesContainer.removeChild(selectedNode.element);
        delete nodes[selectedNode.id];
        selectedNode=null;
    }
}
////////////////////////// END: DELETE NODES


////////////////////////// CHECK TREE

var clearTree = document.getElementById('clear-tree');
clearTree.addEventListener("click", clearingTree,true);
function clearingTree(){
    
    edges.forEach((edge,index)=>{
        let edgeSpotElement=document.getElementById(`edge-track-spot-${edge.begin+edge.end}`);
        let edgeElement=document.getElementById(`edge-${edge.begin+edge.end}`);
        edgeElement.style.backgroundColor="var(--color-1)";
        edgeSpotElement.innerHTML=null;
        edgeSpotElement.classList.remove("render");
    });
}

var sortTree = document.getElementById('sort-tree');
sortTree.addEventListener("click", startSortTree);

/**
 * @param {Event} event - The event
 */
function startSortTree(event){
    event.preventDefault();
    sortResults(edges);
}

/**
 * @param {Object} edges - The edges with values
 */
function sortResults(edges){
    let sorted=Object.entries(edges).sort((edge1, edge2)=>{
        if(edge1[1].weight==edge2[1].weight){
            return 0;
        }
        if(edge1[1].weight<edge2[1].weight){
            return -1;
        }
        if(edge1[1].weight>edge2[1].weight){
            return 1;
        }
    })
    console.log(sorted);
    calculateKruskalAlgorithm(sorted);
}
/**
 * @param {Array} edges - The edges with values
 */
function calculateKruskalAlgorithm(edges){
    let nodesVisited="";
    let nodesNotVisited="";
    let amountOfConected=0;
    let edgesNotConnected=edges.filter((edge,index)=>{
        let begin=edge.begin;
        let end=edge.end;
        if(DCUFind(begin)!=DCUFind(end)){
            DCUUnion(x,y);
        }
        /* let containsBegin=nodesVisited.includes(edge.begin);
        let containsEnd=nodesVisited.includes(edge.end);
        let edgeSpotElement=document.getElementById(`edge-track-spot-${edge.begin+edge.end}`);
        let edgeElement=document.getElementById(`edge-${edge.begin+edge.end}`);
        if(containsBegin&&containsEnd){
            edgeElement.style.backgroundColor="var(--color-1)";
            edgeSpotElement.innerHTML=null;
            edgeSpotElement.classList.remove("render");
            nodesNotVisited+=edge.begin+edge.end;
            return true;
        }else{
            edgeElement.style.backgroundColor="var(--color-blue)";
            edgeSpotElement.innerHTML=index+1;
            edgeSpotElement.classList.add("render");
            nodesVisited+=edge.begin+edge.end;
            amountOfConected++;
            return false;
        } */
    });
    /* console.log(amountOfConected);
    let amountNotConected=nodesElements.length-amountOfConected-1;
    console.log(    );
    for(let i=0; i<amountNotConected; i++){
        let edge=edgesNotConnected[i];
        let edgeSpotElement=document.getElementById(`edge-track-spot-${edge.begin+edge.end}`);
        let edgeElement=document.getElementById(`edge-${edge.begin+edge.end}`);
        edgeElement.style.backgroundColor="var(--color-blue)";
        edgeSpotElement.innerHTML=amountOfConected+1;
        edgeSpotElement.classList.add("render");
        nodesVisited+=edge.begin+edge.end;
        amountOfConected++;
    }
    console.log(nodesVisited,nodesNotVisited); */
}
let parent, rank;
function DCUInit(){
    parent = {};
    rank = {};

    for (let i = 0; i < nodesCounter; i++) {
        parent[nodesElements]
        parent.push(undefined);
        rank.push(1);
    }
}
function DCUFind(index){
    if (parent[index] === undefined)
        return index;

    return parent[index] = DCUFind(parent[index]);
}
function DCUUnion(x,y){
    let s1 = DCUFind(x);
    let s2 = DCUFind(y);

    if (s1 != s2) {
        if (rank[s1] < rank[s2]) {
            parent[s1] = s2;
            rank[s2] += rank[s1];
        }
        else {
            parent[s2] = s1;
            rank[s1] += rank[s2];
        }
    }
}

/**
 * 
 * @param {InputEvent} input - The Input Event 
 */
function onInputEvent(input){
    let inputElement=input.target;
    let inputID=inputElement.id.replace("edge-weight-","");
    
    edges[inputID].weight=Number(inputElement.value);
}