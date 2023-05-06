function resizeInput(){
    const hide=$(this).siblings('.weight__hide');
    $(hide).text($(this).val());
    $(this).width($(hide).width());
}

$('input[type="number"].weight').on('input',resizeInput).each(resizeInput);