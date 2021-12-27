var axios = require('axios');
var swal = require('sweetalert');
var ieltsDatatable;

$(function () {
    $("#ielts-modal").find("#exam_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });

    ieltsDatatable = $('#ielts-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/ielts/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "ielts_score_c_type", 'title': 'Test Type', orderable: false},
            {"data": "ielts_score_overall", 'title': 'Overall', orderable: false},
            {"data": "ielts_score_listening", 'title': 'Listening', orderable: false},
            {"data": "ielts_score_reading", 'title': 'Reading', orderable: false},
            {"data": "ielts_score_writing", 'title': 'Writing', orderable: false},
            {"data": "ielts_score_speaking", 'title': 'Speaking', orderable: false},
            {"data": "ielts_score_exam_date", 'title': 'Exam Date', orderable: false},
            {"data": "ielts_expiry_date", 'title': 'Expiry Date', orderable: false},
            {"data": "ielts_score_attachment_url", 'title': 'Attachment', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.ielts_score_attachment_original + ($.inArray(row.ielts_score_attachment_date, [null, ""]) == -1 ? ", uploaded : " + row.ielts_score_attachment_date : ""));
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateIeltsRow(\'' + btoa(row.ielts_score_uuid) + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deleteIeltsRow(\'' + btoa(row.ielts_score_uuid) + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
    });
});

window.showAddIeltsModal = function () {
    $("#ielts-modal").find('input:not(input[name=_token])').val('');
    $("#ielts-modal").find('select').select2('val', null);
    $("#ielts-modal").find('#ielts-file-attachment').html('');
    $("#ielts-modal").modal('show');
}

/**
 * delete document row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteIeltsRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/ielts/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".document-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    loadRequirementStatus('ielts');
                                    ieltsDatatable.draw();
                                    loadCompletionPercentage();
                                } else {
                                    $(".ielts-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".ielts-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".ielts-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateIeltsRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/ielts/detail/' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#ielts-modal").find('#ielts-file-attachment').html('');
                    $("#ielts-modal").find('#ielts_score_uuid').val(btoa(response.data.data.ielts_score_uuid));
                    setScoreBox(response.data.data.ielts_score_c_type);
                    $("#ielts-modal").find('#score_type').select2('val', response.data.data.ielts_score_c_type);
                    $("#ielts-modal").find('#overall').val(response.data.data.ielts_score_overall);
                    $("#ielts-modal").find('#listening').val(response.data.data.ielts_score_listening);
                    $("#ielts-modal").find('#reading').val(response.data.data.ielts_score_reading);
                    $("#ielts-modal").find('#writing').val(response.data.data.ielts_score_writing);
                    $("#ielts-modal").find('#speaking').val(response.data.data.ielts_score_speaking);
                    $("#ielts-modal").find('#exam_date').val(response.data.data.ielts_score_exam_date);
                    $("#ielts-modal").find('#ielts_attachment_file').val(response.data.data.ielts_score_attachment);
                    $("#ielts-modal").find('#ielts_score_attachment_original').val(response.data.data.ielts_score_attachment_original);
                    if (response.data.data.ielts_score_attachment != null && response.data.data.ielts_score_attachment != 'undefined') {
                        $("#ielts-modal").find('#ielts-file-attachment').html(showFileUrl(baseUrl + '/get-document?_doc_token=' + response.data.data.ielts_score_attachment, response.data.data.ielts_score_attachment_original));
                    }
                    $("#ielts-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#ielts_attachment").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        $("#ielts_score_attachment_original").val(this.files[0].name);
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = this.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            $("#ielts_score_attachment_original").val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument(mimeType, documentData, 'ielts-file-attachment', 'ielts_attachment_file', originalName);
        });

        FR.readAsDataURL(this.files[0]);
    }
});

$("#ielts-form").validate({
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
            required: "Please select the Score type"
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
            required: "Exam date is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/ielts/store', $("#ielts-form").serialize() + '&candidate_detail_uuid=' + candidateUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#ielts-modal").modal('hide');
                        loadRequirementStatus('ielts');
                        ieltsDatatable.draw()
                        loadCompletionPercentage();
                        $(".ielts-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Ielts Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".ielts-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

$(function () {

});

$("#ielts-modal").find("#score_type").on('change', function () {
    setScoreBox($(this).val());
});

window.setScoreBox = function (value) {
    if (value == 'PTE') {
        $("#ielts-modal").find(".score-box").attr('min', '0');
        $("#ielts-modal").find(".score-box").attr('max', '90');
        $("#ielts-modal").find(".score-box").attr('step', '1');
    } else if (value == 'TOEFL') {
        $("#ielts-modal").find(".score-box").attr('min', '0');
        $("#ielts-modal").find(".score-box").attr('max', '1000');
        $("#ielts-modal").find(".score-box").attr('step', '1');
    } else {
        $("#ielts-modal").find(".score-box").attr('min', '0');
        $("#ielts-modal").find(".score-box").attr('max', '9');
        $("#ielts-modal").find(".score-box").attr('step', '0.5');
    }
}
