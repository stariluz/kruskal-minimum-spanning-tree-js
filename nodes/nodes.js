function resizeInputNode(){
    const hide=$(this).siblings('.identifier__hide');
    $(hide).text($(this).val());
    $(this).width($(hide).width());
}

function retrackInputNodes(){
    $('input[type="text"].identifier').on('input',resizeInputNode).each(resizeInputNode);
}
retrackInputNodes();

// $(resizeInput).on('input', resizeInput);