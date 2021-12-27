$(function () {
    $("#medical-date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 20,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
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



$("#medical-attachment").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        $("#candidate_medical_original_name").val(this.files[0].name);
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = this.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            $("#candidate_medical_original_name").val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument(mimeType, documentData, 'view-medical-attachment-file', 'medical_status_attachment', originalName);
        });

        FR.readAsDataURL(this.files[0]);
    }
});