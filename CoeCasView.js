var axios = require('axios');
var swal = require('sweetalert');
$(function () {
    getCASCOEDetail();
    $("#cas-coe-modal").find("#letter_issue_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 20,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
});

window.showCoeCasModal = function () {
//    $("#cas-coe-modal").find('input:not(input[name=_token])').val('');
//    $("#cas-coe-modal").find('#view-letter_attachment').html('');
    $("#cas-coe-modal").modal('show');
}

window.getCASCOEDetail = function () {
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
    axios.get(baseUrl + '/v1/ajax/case-management/cas-coe/detail?candidate_visa_uuid=' + visaUuid)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    if (response.data.data != null) {
                        var html = '';
                        html += '<tr><th>University Name</th><td>' + response.data.data.letter_university_name + '</td></tr>';
                        html += '<tr><th>Issued Date</th><td>' + response.data.data.letter_issue_date + '</td></tr>';
                        html += '<tr><th>Expiry Date</th><td>' + response.data.data.letter_expiry_date + '</td></tr>';
                        html += '<tr><th>Attachment</th><td>' + showFileUrl(baseUrl + '/get-document?_doc_token=' + response.data.data.letter_attachment_file, response.data.data.letter_attachment_original_name + ($.inArray(response.data.data.letter_attachment_file_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.letter_attachment_file_date : "")) + '</td></tr>';
                        $("#cas-coe-modal").find("#letter_university_name").val(response.data.data.letter_university_name);
                        $("#cas-coe-modal").find("#letter_issue_date").val(response.data.data.letter_issue_date);
                        $("#cas-coe-modal").find("#letter_attachment_file").val(response.data.data.letter_attachment_file);
                        $("#cas-coe-modal").find("#letter_attachment_file_original").val(response.data.data.letter_attachment_original_name);
                        $("#cas-coe-modal").find("#view-letter_attachment").html(showFileUrl(baseUrl + '/get-document?_doc_token=' + response.data.data.letter_attachment_file, response.data.data.letter_attachment_original_name + ($.inArray(response.data.data.letter_attachment_file_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.letter_attachment_file_date : "")));
                        $("#cas-coe-datatable").html(html);
                        $("#cas_letter_button").html('<i class="fa fa-edit"></i> Update');
                    } else {
                        $("#cas-coe-datatable").html('<tr><td>No Data Added.</td></tr>');
                        $("#cas_letter_button").html('<i class="fa fa-plus"></i> Add');
                    }
//                    $("#cas-coe-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                console.log(error);
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".cas-coe-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".cas-coe-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#cas-coe-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        letter_university_name: {
            required: true
        },
        letter_issue_date: {
            required: true
        }
    },
    messages: {
        letter_university_name: {
            required: "University name is required"
        },
        letter_issue_date: {
            required: "Issue date is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/cas-coe/store', $("#cas-coe-form").serialize() + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        getCASCOEDetail();
                        $("#cas-coe-modal").modal('hide');
                        $(".cas-coe-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Updated Successfully.</span>' + alertClose() + '</div>');
                        loadCompletionPercentage();
                    } else {
                        $(".cas-coe-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".cas-coe-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".cas-coe-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

$("#cas-coe-form").find("#letter_attachment-upload").on('change', function () {
    uploadFiles(this, 'view-letter_attachment', 'letter_attachment_file', 'letter_attachment_file_original');
});