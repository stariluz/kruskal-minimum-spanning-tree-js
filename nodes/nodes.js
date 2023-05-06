function resizeInput(){
    // console.log("AAAAAAAAAAA");
    // console.log($(this));
    const hide=$(this).siblings('.identifier__hide');
    // console.log(hide);
    $(hide).text($(this).val());
    $(this).width($(hide).width());
}

$('input[type="text"].identifier').on('input',resizeInput).each(resizeInput);