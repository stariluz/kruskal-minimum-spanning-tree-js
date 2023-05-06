function resizeInputEdge(){
    const hide=$(this).siblings('.weight__hide');
    $(hide).text($(this).val());
    $(this).width($(hide).width());
}
function retrackInputEdges(){
    $('input[type="number"].weight').on('input DOMNodeInserted',resizeInputEdge).each(resizeInputEdge);
}
retrackInputEdges();