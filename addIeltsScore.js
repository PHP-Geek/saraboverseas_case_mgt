var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';

$(function () {
    $("#exam_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    $('select').select2();
});

$("#score_type").on('change', function () {
    changeScoreBox($(this).val());
});

window.changeScoreBox = function (type) {
    if (type == 'PTE') {
        $(".score-box").attr('min', '0');
        $(".score-box").attr('max', '90');
        $(".score-box").attr('step', '1');
    } else if (type == 'TOEFL') {
        $("#ielts-modal").find(".score-box").attr('min', '0');
        $("#ielts-modal").find(".score-box").attr('max', '1000');
        $("#ielts-modal").find(".score-box").attr('step', '1');
    } else {
        $(".score-box").attr('min', '0');
        $(".score-box").attr('max', '9');
        $(".score-box").attr('step', '0.5');
    }
}

$("#add-ielts-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        score_type: {
            required: true
        },
        overall: {
            required: true
        },
        listening: {
            required: true
        },
        reading: {
            required: true
        },
        speaking: {
            required: true
        },
        writing: {
            required: true
        },
        exam_date: {
            required: true
        },
        ielts_attachment_file: {
            required: true
        }
    },
    messages: {
        score_type: {
            required: "Please select score type"
        },
        overall: {
            required: "Overall score is required"
        },
        listening: {
            required: "Listining score is required"
        },
        reading: {
            required: "Reading score is required"
        },
        speaking: {
            required: "Speaking score is required"
        },
        writing: {
            required: "Writing score is required"
        },
        exam_date: {
            required: "Expiry date is required"
        },
        ielts_attachment_file: {
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
        axios.post(baseUrl + '/v1/ajax/case-management/ielts/store', $("#add-ielts-form").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#ielts-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        window.location.href = baseUrl + '/case-management/visa/' + type + '/add/document/' + btoa(candidateVisaUuid);
                    } else {
                        $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#ielts-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});


window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}

$("#ielts_attachment").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = this.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        $("#ielts_score_attachment_original").val(this.files[0].name);
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument(mimeType, documentData, 'ielts-file-attachment', 'ielts_attachment_file', originalName);
        });

        FR.readAsDataURL(this.files[0]);
    }
});