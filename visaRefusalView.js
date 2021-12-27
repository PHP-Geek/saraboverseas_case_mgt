var axios = require('axios');
var swal = require('sweetalert');
var visaRefusalDatatable;
$(function () {

    $("#visa-refusal-modal").find("#no_visa_refusal_button").on('change', function () {
        if ($(this).is(':checked')) {
            $("#visa-refusal-modal").find("#visa-refusal-view-div").addClass('d-none');
        } else {
            $("#visa-refusal-modal").find("#visa-refusal-view-div").removeClass('d-none');
        }
    });


    $("#visa_applied_date,#visa_refusal_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date(),
    });

    visaRefusalDatatable = $('#visa-refusal-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "language": {
            "emptyTable": "No Visa Refusal"
        },
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/travel-history/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._travelled = 'NO';
                d._travel_history_status = 'REFUSED';
                d._candidate_detail_uuid = candidateUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "country_visited", 'title': 'Country', orderable: false},
            {"data": "master_visa_type_name", 'title': 'Visa Type', orderable: false},
            {"data": "visa_applied_date", 'title': 'Applied Date', orderable: false},
            {"data": "visa_refusal_date", 'title': 'Refusal Date', orderable: false},
            {"data": "refusing_reason", 'title': 'Refusal Reason', orderable: false},
            {"data": "visa_refusal_attachment_url", 'title': 'Attachment', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.visa_refusal_attachment_original + ($.inArray(row.visa_refusal_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.visa_refusal_attachment_date : ""));
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updatevisaRefusalRow(\'' + row.travel_history_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deletevisaRefusalRow(\'' + row.travel_history_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
    });
});

window.showAddvisaRefusalModal = function () {
    $("#visa-refusal-modal").find('textarea,input:not(input[name=_token])').val('');
    $("#visa-refusal-modal").find('#view-visa_refusal_attachment').html('');
    $('select').select2('val', null);
    $("#visa-refusal-modal").find("#no-visa-refusal-checkbox-div").removeClass('d-none');
//    $("#visa-refusal-modal").find("#no_visa_refusal_button").removeAttr('checked');
//    $("#visa-refusal-modal").find("#visa-refusal-view-div").removeClass('d-none');
    $("#visa-refusal-modal").modal('show');
}

/**
 * delete visaRefusal row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deletevisaRefusalRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/travel-history/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".visa-refusal-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    loadRequirementStatus('visa_refusal');
                                    visaRefusalDatatable.draw();
                                } else {
                                    $(".visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".visa-refusal-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updatevisaRefusalRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/travel-history/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#visa-refusal-modal").find('#view-visa_refusal_attachment').html('');
                    $("#visa-refusal-modal").find("#no-visa-refusal-checkbox-div").addClass('d-none');
                    $("#visa-refusal-modal").find("#no_visa_refusal_button").removeAttr('checked');
                    $("#visa-refusal-modal").find("#visa-refusal-view-div").removeClass('d-none');
                    $("#visa-refusal-modal").find('#travel_history_uuid').val(response.data.data.travel_history_uuid);
                    $("#visa-refusal-modal").find('#country_visited').select2('val', response.data.data.country_visited);
                    $("#visa-refusal-modal").find('#visa_refusal_visa_type').select2('val', response.data.data.master_visa_type_uuid);
                    $("#visa-refusal-modal").find('#visa_applied_date').val((response.data.data.visa_applied_date));
                    $("#visa-refusal-modal").find('#visa_refusal_date').val((response.data.data.visa_refusal_date));
                    $("#visa-refusal-modal").find('#refusal_reason').val(response.data.data.refusing_reason);
                    $("#visa-refusal-modal").find('#visa_refusal_attachment').val(response.data.data.visa_refusal_attachment);
                    $("#visa-refusal-modal").find('#visa_refusal_attachment_original').val(response.data.data.visa_refusal_attachment_original);
                    if (response.data.data.visa_refusal_attachment != null && response.data.data.visa_refusal_attachment != 'undefined') {
                        $("#visa-refusal-modal").find('#view-visa_refusal_attachment').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.visa_refusal_attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#visa-refusal-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".visaRefusal-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".visaRefusal-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#visa-refusal-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        country_visited: {
            required: function () {
                return $("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked') ? false : true;
            }
        },
        visa_applied_date: {
            required: function () {
                return $("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked') ? false : true;
            }
        },
        visa_refusal_date: {
            required: function () {
                return $("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked') ? false : true;
            }
        },
        visa_type: {
            required: function () {
                return $("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked') ? false : true;
            }
        },
        refusal_reason: {
            required: function () {
                return $("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked') ? false : true;
            }
        }
    },
    messages: {
        country_visited: {
            required: "Please select country"
        },
        visa_applied_date: {
            required: "Applied date is required"
        },
        visa_refusal_date: {
            required: "Refusal date is required"
        },
        visa_type: {
            required: "Visa type is required"
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
        if ($("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked')) {
            swal({
                title: "Are you sure?",
                text: "You selected no visa refusals. Existing visa refusals (if there) will be deleted for the candidate.",
                icon: "warning",
                buttons: true,
                dangerMode: false,
            })
                    .then((willConfirm) => {
                        if (willConfirm) {
                            updateVisaRefusalData(1);
                        }
                    });
        } else {
            updateVisaRefusalData(0);
        }
    }
});

window.updateVisaRefusalData = function (status) {
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
    axios.post(baseUrl + '/v1/ajax/case-management/travel-history/store', $("#visa-refusal-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_travelled=NO&travel_history_status=REFUSED' + '&no_visa_refusal_button=' + ($("#visa-refusal-modal").find("#no_visa_refusal_button").is(':checked') ? 'YES' : 'NO'))
            .then(function (response) {
                $(window).unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#visa-refusal-modal").modal('hide');
                    $(".visa-refusal-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Visa Refusal Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    loadRequirementStatus('visa_refusal');
                    visaRefusalDatatable.draw();
                    if (status == 1) {
                        $("#no_visa_refusal_button_global").attr('checked', true);
                    } else {
                        $("#no_visa_refusal_button_global").removeAttr('checked');
                    }
                } else {
                    $(".visa-refusal-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                }
            })
            .catch(function (error) {
                $(window).unblock();
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".visa-refusal-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".visa-refusal-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
            });
}
/**
 * on change on the file control
 */
$("#visa_refusal_attachment-file").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        $("#visa_refusal_attachment_original").val(this.files[0].name);
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = this.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            $("#visa_refusal_attachment_original").val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument(mimeType, documentData, 'view-visa_refusal_attachment', 'visa_refusal_attachment', originalName);
        });

        FR.readAsDataURL(this.files[0]);
    }
});


$("#no_visa_refusal_button_global").on('change', function () {
    var status;
    if ($(this).is(':checked')) {
        status = 1
        var message = "You selected no visa refusals. Existing visa refusals (if there) will be deleted for the candidate.";
    } else {
        status = 0
        var message = "Are you sure to want remove no visa refusal?";
    }
    swal({
        title: "Are you sure?",
        text: message,
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    actionVisaRefusalCheck(status);
                } else {
                    if (status == 0) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                }
            });
});

window.actionVisaRefusalCheck = function (status) {
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
    axios.post(baseUrl + '/v1/ajax/case-management/update-no-record',
            {
                'candidate_detail_uuid': btoa(candidateUuid),
                column: 'no_visa_refusal_status',
                value: ($("#no_visa_refusal_button_global").is(':checked')) ? 'YES' : 'NO'
            })
            .then(function (response) {
                $(window).unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    loadRequirementStatus('visa_refusal');
                    if (status == 1) {
                        $("#visa-refusal-modal").find("#no_visa_refusal_button").attr('checked', true);
                        $("#visa-refusal-modal").find("#visa-refusal-view-div").addClass('d-none');
                    } else {
                        $("#visa-refusal-modal").find("#no_visa_refusal_button").removeAttr('checked');
                        $("#visa-refusal-modal").find("#visa-refusal-view-div").removeClass('d-none');
                    }
                    swal("", 'Previous Visa Refusal Updated Successfully', 'success');
                    travelHistoryDatatable.draw();
                } else {
                    swal("", 'Something went wrong. Please try again', 'error');
                }
            })
            .catch(function (error) {
                $(window).unblock();
                if ((error.response.data).hasOwnProperty('message')) {
                    swal("", error.response.data.message, "error");
                } else {
                    swal("", 'Something went wrong. Please try again', 'error');
                }
            });
}