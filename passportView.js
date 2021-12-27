$(function () {
    $("#passport-expiry-date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear(),
        yearEnd: (new Date()).getFullYear() + 20,
        minDate: new Date()
    });
});

window.editUploadColumn = function (id) {
    $("#" + id).find('.rec-edit').show();
    $("#" + id).find('.rec-view').hide();
    $("#" + id).find('.rec-btn-submit').show();
    $("#" + id).find('.rec-btn-edit').css({display: 'none'});
}

window.submitUploadColumn = function (id, type) {
    if (type == 'true') {
        $("#" + id).find('.rec-edit').hide();
        $("#" + id).find('.rec-view').show();
        $("#" + id).find('.rec-btn-submit').hide();
        $("#" + id).find('.rec-btn-edit').show();
        $("#" + id).find('input[type=file]').val('');
        $("#" + id).find('.view-rec-file').html('');
        $("#" + id).find('input[type=hidden]').val('');
    } else {
        updateColumnValue(id);
    }
}



$("#candidate_passport_attachment").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        $("#passport_attachment_original_filename").val(this.files[0].name);
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = this.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            $("#passport_attachment_original_filename").val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument(mimeType, documentData, 'view-passport-file', 'passport_attachment_filename', originalName);
        });

        FR.readAsDataURL(this.files[0]);
    }
});