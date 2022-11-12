

main();

function main() {
    let nodes=document.getElementsByClassName("node-js");
    
    for(let i=0; i<nodes.length; i++){
        nodes[i].addEventListener('dragend',(event)=>OnDragEndsEvent(event));
    }
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
function OnDragEndsEvent(event) {
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


