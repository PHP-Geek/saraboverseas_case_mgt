var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';

$(function () {
    $("#document_received_date,#document_returned_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 25,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
});

$("#document-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        document_name: {
            required: true,
//            alpha: true
        },
        document_received_date: {
            required: true
        },
        document_attachment: {
            required: true
        }
    },
    messages: {
        document_name: {
            required: "Document name is required",
//            alpha: "Document name must contain only characters"
        },
        document_received_date: {
            required: "Received date is required"
        },
        document_attachment: {
            required: "Attachment is required"
        }
    },
    highlight: function (e) {
        $(e).closest(".form-group").addClass("has-error")
    },
    unhighlight: function (e) {
        $(e).closest(".form-group").removeClass("has-error")
    },
    success: function (e) {
        $(e).closest(".form-group").removeClass("has-error"), $(e).closest(".form-group").children("span.help-block").remove()
    },
    errorPlacement: function (e, r) {
        e.appendTo(r.closest(".form-group"))
    },
    submitHandler: function (form) {
        var html = '<tr><td><a href="javascript:;" class="text-danger" title="Remove" onclick="removeRow(this)"><i class="fa fa-trash"></i></a></td>\n\
<td><input type="hidden" value="' + $("#document-form").find("#document_name").val() + '" name="document_name[]"/>' + $("#document-form").find("#document_name").val() + '</td>\n\
<td><input type="hidden" value="' + ($("#document-form").find("#original_kept").is(':checked') ? 'YES' : 'NO') + '" name="original_kept[]"/>' + ($("#document-form").find("#original_kept").is(':checked') ? 'YES' : 'NO') + '</td>\n\
<td><input type="hidden" value="' + $("#document-form").find("#document_received_date").val() + '" name="received_date[]"/>' + $("#document-form").find("#document_received_date").val() + '</td>\n\
<td><input type="hidden" value="' + $("#document-form").find("#document_returned_date").val() + '" name="return_date[]"/>' + $("#document-form").find("#document_returned_date").val() + '</td>\n\
                                        <td>\n\
                                            <input type="hidden" value="' + $("#document-form").find("#document_attachment").val() + '" name="attachment_file[]"/><input type="hidden" value="' + $("#document-form").find("#document_attachment_original").val() + '" name="document_attachment_original[]"/>\n\
                                            ' + ($("#document-form").find("#document_attachment").val() != "" ? ('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + $("#document-form").find("#document_attachment").val() + '"><img src="' + baseUrl + '/img/document.png"></a>') : "") + '</td><td></td></tr>';
        $("#store-candidate-document-view").append(html);
        $("#document-form")[0].reset();
        $("#document-form").find("#view-candidate-document-attachment").html('');
        return false;
    }
});

window.removeRow = function (that) {
    $(that).closest('tr').remove();
}

$("#next-button").on('click', function () {
    if ($("#store-candidate-document-view").find('input').length > 0) {
        $(window).block({
            'message': '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>',
            'css': {
                border: '0',
                padding: '0',
                backgroundColor: 'none',
                marginTop: '5%',
                zIndex: '10600'
            },
            overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
        });
        axios.post(baseUrl + '/v1/ajax/case-management/visa/candidate/document/store', $("#add-candidate-document-form").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#document-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        if ($.inArray(role, ['admin']) != -1) {
                            window.location.href = baseUrl + '/case-management/visa/' + type + '/add/travel-history/' + btoa(candidateVisaUuid);
                        } else {
                            window.location.href = baseUrl + '/case-management/visa-detail/' + type + '/' + btoa(candidateVisaUuid);
                        }
                    } else {
                        $(".add-candidate-document-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#document-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".add-candidate-document-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".add-candidate-document-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    } else {
        $('html, body').animate({
            scrollTop: $("#document-add-view").offset().top
        }, 1500);
        $(".add-candidate-document-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please add one document detail.</span>' + alertClose() + '</div>');
    }
});

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}

$("#document_upload_file").on('change', function () {
    uploadFiles(this, 'view-candidate-document-attachment', 'document_attachment');
});

window.uploadFiles = function (that, viewAttachmentDiv, attachmentControl) {
    console.log(that.files);
    if (that.files && that.files[0]) {
        var FR = new FileReader();
        var mimeType = that.files[0].type;
        var originalName = that.files[0].name;
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(that).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = that.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(that).val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
         $("#document_attachment_original").val(that.files[0].name);
        FR.addEventListener("load", function (e) {
            var fileData = e.target.result;
            addMasterDocument(mimeType, fileData, viewAttachmentDiv, attachmentControl, originalName);
        });
        FR.readAsDataURL(that.files[0]);
    }
}