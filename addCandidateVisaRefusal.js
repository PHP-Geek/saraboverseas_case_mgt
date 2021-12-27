var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';

$(function () {
    $("select:not(#visa_type)").select2();
    $("#visa_applied_date,#visa_refusal_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
});

$("#visa-refusal-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        country_visited: {
            required: true
        },
        visa_refusal_visa_type: {
            required: true
        },
        visa_refusal_date: {
            required: true
        },
        visa_applied_date: {
            required: true
        },
        visa_refusal_attachment: {
            required: true
        },
        refusal_reason: {
            required: true
        }
    },
    messages: {
        country_visited: {
            required: "Country is required"
        },
        visa_refusal_visa_type: {
            required: "Visa type is required"
        },
        visa_refusal_date: {
            required: "Refusal date is required"
        },
        visa_applied_date: {
            required: "Applied date is required"
        },
        visa_refusal_attachment: {
            required: "Attachment is required"
        },
        refusal_reason: {
            required: "Refusal reason is required"
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
<td><input type="hidden" value="' + $("#visa-refusal-form").find("#country_visited").val() + '" name="country_visited[]"/>' + $("#visa-refusal-form").find("#country_visited").val() + '</td>\n\
<td><input type="hidden" value="' + $("#visa-refusal-form").find("#visa_refusal_visa_type").val() + '" name="visa_refusal_visa_type[]"/>' + $("#visa-refusal-form").find("#visa_refusal_visa_type").find('option:selected').text() + '</td>\n\
<td><input type="hidden" value="' + $("#visa-refusal-form").find("#visa_applied_date").val() + '" name="visa_applied_date[]"/>' + $("#visa-refusal-form").find("#visa_applied_date").val() + '</td>\n\
<td><input type="hidden" value="' + $("#visa-refusal-form").find("#visa_refusal_date").val() + '" name="visa_refusal_date[]"/>' + $("#visa-refusal-form").find("#visa_refusal_date").val() + '</td>\n\
                                        <td>\n\
                                            <input type="hidden" value="' + $("#visa-refusal-form").find("#visa_refusal_attachment").val() + '" name="visa_refusal_attachment[]"/><input type="hidden" value="' + $("#visa-refusal-form").find("#visa_refusal_attachment_original").val() + '" name="visa_refusal_attachment_original[]"/>\n\
                                            ' + ($("#visa-refusal-form").find("#visa_refusal_attachment").val() != "" ? ('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + $("#visa-refusal-form").find("#visa_refusal_attachment").val() + '"><img src="' + baseUrl + '/img/document.png"></a>') : "") + '</td>\n\
<td><input type="hidden" value="' + $("#visa-refusal-form").find("#refusal_reason").val() + '" name="refusal_reason[]"/>' + $("#visa-refusal-form").find("#refusal_reason").val() + '</td>\n\</tr>';
        $("#store-candidate-visa-refusal-view").append(html);
        $("#visa-refusal-form")[0].reset();
        $("#visa-refusal-form").find('select').select2('val', null);
        $("#visa-refusal-form").find("#view-visa_refusal_attachment").html('');
        return false;
    }
});

window.removeRow = function (that) {
    $(that).closest('tr').remove();
}

$("#next-button").on('click', function () {
    if ($("#store-candidate-visa-refusal-view").find('input').length > 0) {
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa/candidate/visa-refusal/store', $("#add-candidate-visa-refusal-form").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#visa-refusal-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        window.location.href = baseUrl + '/case-management/visa-detail/' + type + '/' + btoa(candidateVisaUuid);
                    } else {
                        $(".add-candidate-visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#visa-refusal-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".add-candidate-visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".add-candidate-visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    } else {
        $('html, body').animate({
            scrollTop: $("#visa-refusal-add-view").offset().top
        }, 1500);
        $(".add-candidate-visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please add one visa refusal detail.</span>' + alertClose() + '</div>');
    }
});

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}

$("#visa_refusal_attachment-file").on('change', function () {
    uploadFiles(this, 'view-visa_refusal_attachment', 'visa_refusal_attachment');
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
         $("#visa_refusal_attachment_original").val(that.files[0].name);
        FR.addEventListener("load", function (e) {
            var fileData = e.target.result;
            addMasterDocument(mimeType, fileData, viewAttachmentDiv, attachmentControl, originalName);
        });
        FR.readAsDataURL(that.files[0]);
    }
}