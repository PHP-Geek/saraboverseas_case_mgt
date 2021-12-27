var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';
var offerletterDatatable;
$(function () {
    setTimeout(function () {
        listAgents1();
    }, 1)
    selectCollege($("#ol-recommend-college-modal").find(".college-list"));
    $("#ol_receive_date,#ol_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 2,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    offerletterDatatable = $('#offer-letter-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/offer-letter/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
                d._visa_uuid = visaUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "master_college_name", 'title': 'College/University', orderable: false, render: function (data, full, row) {
                    var html = '';
                    if (row.offer_letter_fee_refunded == 'YES') {
                        html += '<span class="badge badge-primary bold" style="font-size: 11px;position: absolute;margin-top: -20px;left: 4px;">REFUNDED</span>';
                    } else if (row.offer_letter_fee_paid == 'YES') {
                        html += '<span class="badge badge-success bold" style="font-size: 11px;position: absolute;margin-top: -20px;left: 4px;">PAID</span>';
                    }
                    return html + ' ' + (data != null ? data : (row.offer_letter_college_name != null ? row.offer_letter_college_name : ""));
                }
            },
            {"data": "college_program_name", 'title': 'Program Name', orderable: false, render: function (data, full, row) {
                    return data != null ? data : row.offer_letter_program_name;
                }
            },
            {"data": "offer_letter_intake", 'title': 'Intake', orderable: false, render: function (data, full, row) {
                    return data != null ? data : row.offer_letter_college_intake;
                }},
            {"data": "user_information_fullname", 'title': 'Agent', orderable: false, visible: ($.inArray(role, ['admin']) != -1 ? true : false)},
            {"data": "offer_letter_status", 'title': 'Status', orderable: false, render: function (data, full, row) {
                    return data + (row.offer_letter_conditional == 'YES' ? ' <span class="badge badge-success badge-sm">Conditional</span>' : '');
                }
            },
            {"data": "ol_date_selected", 'title': 'Date', orderable: false, render: function (data, full, row) {
                    var html = '';
                    if (data != null && data != '') {
                        html += '<label>Selected: </label>' + data + '<br/>';
                    }
                    if (row.ol_date_applied != null && row.ol_date_applied != '') {
                        html += '<label>Applied: </label>' + row.ol_date_applied + '<br/>';
                    }
                    if (row.ol_date_approved != null && row.ol_date_approved != '') {
                        html += '<label>Approved: </label>' + row.ol_date_approved + '<br/>';
                    }
                    if (row.ol_date_rejected != null && row.ol_date_rejected != '') {
                        html += '<label>Rejected: </label>' + row.ol_date_rejected + '<br/>';
                    }
                    if (row.ol_date_waitlisted != null && row.ol_date_waitlisted != '') {
                        html += '<label>Waitlisted: </label>' + row.ol_date_waitlisted + '<br/>';
                    }
                    if (row.ol_date_deferment_applied != null && row.ol_date_deferment_applied != '') {
                        html += '<label>Deferment Applied: </label>' + row.ol_date_deferment_applied + '<br/>';
                    }
                    return html;
                }
            },
//            {"data": "ol_recieved_date", 'title': 'Received Date'},
            {"data": "candidate_offer_letter_attachment_file", orderable: false, 'title': 'Attachment', render: function (data, full, row) {
                    var html = showFileUrl(data, row.offer_letter_attachment_original + ($.inArray(row.offer_letter_attachment_date, [null, ""]) == -1 ? ", uploaded : " + row.offer_letter_attachment_date : ""));
                    if (row.offer_letter_other_attachment != null) {
                        var otherAttachments = JSON.parse(row.offer_letter_other_attachment);
                        $.each(otherAttachments, function (i, v) {
                            html += showFileUrl(baseUrl + "/get-document?_doc_token=" + v.file, v.original_name + ($.inArray(v.std_date, [null, ""]) == -1 ? ", uploaded : " + v.std_date : ""));
                        });
                    }
                    return html;
                }
            },
            {"data": "candidate_offer_letter_attachment2_file", orderable: false, 'title': 'Additional Attachment', render: function (data, full, row) {
                    return showFileUrl(data, row.offer_letter_attachment2_original + ($.inArray(row.offer_letter_attachment2_date, [null, ""]) == -1 ? ", uploaded : " + row.offer_letter_attachment2_date : ""));
                }
            },
            {"data": "offer_letter_student_id", 'title': 'APP ID/Student ID', orderable: false, render: function (data, full, row) {
                    return (row.offer_letter_app_id != null ? row.offer_letter_app_id:"NA") + "/" + (data != null ? data:"NA");
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    var html = (row.offer_letter_is_locked == 'NO' ? '<a onclick="updateOLRow(\'' + row.candidate_offer_letter_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a>' : '')
                            + ($.inArray(role, ['admin']) != -1 ? ' <a href="javascript:;" onclick="deleteOLRow(\'' + row.candidate_offer_letter_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a> '
                                    + (row.offer_letter_status == 'RECOMMEND' ? '<a onclick="recommendCollege(\'' + btoa(row.candidate_offer_letter_uuid) + '\')" href="javascript:;" title="Recommend College" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-thumbs-up"></i></a>' : '')
                                    : '');
                    return html;
                }
            }
        ],
        "createdRow": function (row, data, index) {
            if (data.offer_letter_fee_paid == 'YES') {
                $(row).addClass('datatable-highlight');
            }
        },
        rowCallback: function (tableRow, data) {
            if (data.offer_letter_is_locked == 'YES') {
                $(tableRow).addClass('row-highlight');
                $(tableRow).find('td:first-child').addClass('locked');
            }
        }
    });
});

$("#offerletter-modal").find("#recommend_ol").on('change', function () {
    if ($(this).is(':checked')) {
        $("#offerletter-modal").find("#ol-form-div").addClass('d-none');
        $("#offerletter-modal").find("#ol-submit-button").addClass('d-none');
        $("#offerletter-modal").find("#ol-recommend-button").removeClass('d-none');
    } else {
        $("#offerletter-modal").find("#ol-form-div").removeClass('d-none');
        $("#offerletter-modal").find("#ol-submit-button").removeClass('d-none');
        $("#offerletter-modal").find("#ol-recommend-button").addClass('d-none');
    }
});

$("#offerletter-modal").find("#ol-recommend-button").on('click', function () {
    swal({
        title: "Recommend the Offer Letter?",
        text: "Are you sure recommend the offer letter?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
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
                    axios.post(baseUrl + '/v1/ajax/case-management/offer-letter/recommend', $("#offer-letter-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + "&candidate_visa_uuid=" + visaUuid)
                            .then(function (response) {
                                $(window).unblock();
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $("#offerletter-modal").modal('hide');
                                    $(".offer-letter-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Offer Letter Recommended Successfully.</span>' + alertClose() + '</div>');
                                    offerletterDatatable.draw();
                                } else {
                                    $(".offer-letter-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                                }
                            })
                            .catch(function (error) {
                                $(window).unblock();
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".offer-letter-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".offer-letter-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                            });
                }
            });
});


window.ShowOfferLetterModal = function () {
    $("#offerletter-modal").find('select,input:not(#ol_agent_from_hidden,input[name=_token])').val('');
    $("#offerletter-modal").find('#ol_attachment_file-view').html('');
    $("#offerletter-modal").find('#ol_additional_attachment_file-view').html('');
    $("#offerletter-modal").find('#ol_college,#ol_program').select2('val', null);
    $("#offerletter-modal").find('#intake').html('<option selected="selected" disabled="" value=""></option>')
    $("#offerletter-modal").find('select').select2('val', null);
    $("#offerletter-modal").find("#ol-student-id-div").addClass('d-none');
    $("#offerletter-modal").find('#ol_status').select2('val', 'SELECTED');
    $("#offerletter-modal").find('#ol_date').attr('placeholder', 'Selected Date');
    $("#offerletter-modal").find('#status-label-div').html('Selected Date');
    $("#offerletter-modal").find("#recommend_ol").prop('checked', false);
    $("#offerletter-modal").find("#ol-form-div").removeClass('d-none');
    $("#offerletter-modal").find("#ol-submit-button").removeClass('d-none');
    $("#offerletter-modal").find("#ol-recommend-button").addClass('d-none');

    $("#offerletter-modal").find("#ol-form-div").removeClass('d-none');
    $("#offerletter-modal").find("#ol-submit-button").removeClass('d-none');
    $("#offerletter-modal").find("#ol-recommend-button").addClass('d-none');
    $("#offerletter-modal").find("#recommend-ol-div").removeClass('d-none');

    $("#offerletter-modal").modal('show');
}

window.recommendCollege = function (offerLetterUuid) {
    $("#ol-recommend-college-modal").find('#candidate_offer_letter_uuid').val(offerLetterUuid);
    $("#ol-recommend-college-modal").modal('show');
}

/**
 * delete offerletter row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteOLRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/offer-letter/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".offer-letter-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    loadRequirementStatus('offer_letter');
                                    offerletterDatatable.draw();
                                    loadCompletionPercentage();
                                } else {
                                    $(".offer-letter-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".offer-letter-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".offer-letter-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateOLRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/offer-letter/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
//                    axios.get(baseUrl + '/v1/ajax/program/mapping/detail-by-cp?college=' + response.data.data.master_college_uuid + '&program=' + response.data.data.master_program_uuid)
//                            .then(function (response1) {
//                                if (response1.data.data.college_program_mapping_intake != null && response1.data.data.college_program_mapping_intake != 'undefined') {
                    var html = '<option>Select Intake</option>';
                    if (response.data.data.college_program_mapping != null && response.data.data.college_program_mapping != 'undefined') {
                        $.each(response.data.data.college_program_mapping.college_program_mapping_intake, function (i, v) {
                            if (Object.keys(v)[0] == 'OPEN') {
                                html += '<option value="' + Object.values(v)[0] + '">' + Object.values(v)[0] + '</option>';
                            }
                        });
                    }
                    $("#offerletter-modal").find("#check-current-file-upload").val(0);
                    $("#offerletter-modal").find("#ol_college_name").val(response.data.data.offer_letter_college_name);
                    $("#offerletter-modal").find("#ol_program_name").val(response.data.data.offer_letter_program_name);
                    $("#offerletter-modal").find("#ol_college_intake").val(response.data.data.offer_letter_college_intake);
                    $("#offerletter-modal").find("#ol_intake").html(html);
                    $("#offerletter-modal").find("#ol_intake").select2('val', response.data.data.offer_letter_intake);
//                                }
                    $("#offerletter-modal").find('#candidate_offer_letter_uuid').val(response.data.data.candidate_offer_letter_uuid);
                    if (response.data.data.master_college_uuid != null && response.data.data.master_college != null) {
                        $("#offerletter-modal").find('#ol_college').select2('data', {id: response.data.data.master_college.master_college_uuid, text: (response.data.data.master_college.master_college_name + ',' + response.data.data.master_college.master_college_city + ' - ' + response.data.data.master_college.master_college_state)});
                        getCollegePrograms(response.data.data.master_college.master_college_uuid, response.data.data.college_program_mapping_uuid);
                    }
//                    if (response.data.data.college_program_mapping_uuid != null && response.data.data.college_program_mapping != null) {
//                        $("#offerletter-modal").find('#ol_program').select2('val', response.data.data.college_program_mapping.college_program_mapping_uuid);
//                    }
                    $("#offerletter-modal").find('#ol_attachment_file-view').html('');
                    if (response.data.data.offer_letter_attachment != null && response.data.data.offer_letter_attachment != 'undefined') {
                        $("#offerletter-modal").find('#ol_attachment_file-view').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.offer_letter_attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        if (response.data.data.offer_letter_other_attachment != null) {
                            var otherAttachments = JSON.parse(response.data.data.offer_letter_other_attachment);
                            $.each(otherAttachments, function (i, v) {
                                $("#offerletter-modal").find('#ol_attachment_file-view').append('<a title="' + (v.original_name) + '" target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + (v.file) + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                            });
                        }
                    }
                    $("#offerletter-modal").find('#ol_additional_attachment_file-view').html('');
                    if (response.data.data.offer_letter_attachment2 != null && response.data.data.offer_letter_attachment2 != 'undefined') {
                        $("#offerletter-modal").find('#ol_additional_attachment_file-view').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.offer_letter_attachment2 + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#offerletter-modal").find('#ol_receive_date').val((response.data.data.ol_recieved_date));
                    $("#offerletter-modal").find('#ol_attachment_file').val(response.data.data.offer_letter_attachment);
                    $("#offerletter-modal").find('#offer_letter_attachment_original').val(response.data.data.offer_letter_attachment_original);
                    $("#offerletter-modal").find('#ol_additional_attachment_file').val(response.data.data.offer_letter_attachment2);
                    $("#offerletter-modal").find('#offer_letter_attachment2_original').val(response.data.data.offer_letter_attachment2_original);
                    $("#offerletter-modal").find('#ol_applied_date').val(response.data.data.offer_letter_applied_date);
                    $("#offerletter-modal").find('#ol_student_id').val(response.data.data.offer_letter_student_id);
                    $("#offerletter-modal").find('#ol_app_id').val(response.data.data.offer_letter_app_id);
                    $("#offerletter-modal").find('#ol_agent').select2('val', response.data.data.offer_letter_agent);
                    $("#offerletter-modal").find('#ol_agent_from').select2('val', response.data.data.offer_letter_from_agent);
                    if (response.data.data.offer_letter_status != 'RECOMMEND') {
                        $("#offerletter-modal").find('#ol_status').select2('val', response.data.data.offer_letter_status);
                    } else {
                        $("#offerletter-modal").find('#ol_status').select2('val', 'SELECTED');
                    }
                    if (response.data.data.offer_letter_status == 'APPLIED') {
                        $("#offerletter-modal").find("#ol-student-id-div").addClass('d-none');
                    } else if (response.data.data.offer_letter_status == 'APPROVED') {
                        $("#offerletter-modal").find("#ol-student-id-div").removeClass('d-none');
                    } else {
                        $("#offerletter-modal").find("#ol-student-id-div").addClass('d-none');
                    }
                    if (response.data.data.offer_letter_conditional == 'YES') {
                        $("#offerletter-modal").find('#offer_letter_conditional').attr('checked', true);
                    } else {
                        $("#offerletter-modal").find('#ol_status').attr('checked', false);
                    }
                    $("#offerletter-modal").find("#conditional-offer-div").addClass('d-none');
                    switch (response.data.data.offer_letter_status) {
                        case 'APPLIED':
                            $("#offerletter-modal").find('#ol_date').val(response.data.data.ol_date_applied);
                            $("#offerletter-modal").find('#ol_date').attr('placeholder', "Applied Date");
                            $("#offerletter-modal").find('#status-label-div').html("Applied");
                            break;
                        case 'APPROVED':
                            $("#offerletter-modal").find("#conditional-offer-div").removeClass('d-none')
                            $("#offerletter-modal").find('#ol_date').val(response.data.data.ol_date_approved);
                            $("#offerletter-modal").find('#ol_date').attr('placeholder', "Approved Date");
                            $("#offerletter-modal").find('#status-label-div').html("Approved");
                            break;
                        case 'REJECTED':
                            $("#offerletter-modal").find('#ol_date').val(response.data.data.ol_date_rejected);
                            $("#offerletter-modal").find('#ol_date').attr('placeholder', "Rejected Date");
                            $("#offerletter-modal").find('#status-label-div').html("Rejected");
                            break;
                        case 'WAITLISTED':
                            $("#offerletter-modal").find('#ol_date').val(response.data.data.ol_date_waitlisted);
                            $("#offerletter-modal").find('#ol_date').attr('placeholder', "Waitlisted Date");
                            $("#offerletter-modal").find('#status-label-div').html("Waitlisted");
                            break;
                        case 'DEFERMENT_APPLIED':
                            $("#offerletter-modal").find('#ol_date').val(response.data.data.ol_date_deferment_applied);
                            $("#offerletter-modal").find('#ol_date').attr('placeholder', "Deferment Applied Date");
                            $("#offerletter-modal").find('#status-label-div').html("Deferment Applied");
                            break;
                        default:
                            $("#offerletter-modal").find('#ol_date').val(response.data.data.ol_date_selected);
                            $("#offerletter-modal").find('#ol_date').attr('placeholder', "Selected Date");
                            $("#offerletter-modal").find('#status-label-div').html("Selected");
                            break;
                    }
                    //hide the recommend div
                    $("#offerletter-modal").find("#ol-form-div").removeClass('d-none');
                    $("#offerletter-modal").find("#ol-submit-button").removeClass('d-none');
                    $("#offerletter-modal").find("#ol-recommend-button").addClass('d-none');
                    $("#offerletter-modal").find("#recommend-ol-div").addClass('d-none');
                    $("#offerletter-modal").find("#ol-form-div").removeClass('d-none');
                    $("#offerletter-modal").modal('show');
//                            });
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                console.log(error);
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".offer-letter-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".offer-letter-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#offer-letter-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        ol_college_name: {
            required: true
        },
        ol_program_name: {
            required: true
        },
        ol_college_intake: {
            required: true
        },
        ol_college: {
            required: true
        },
        ol_program: {
            required: true
        },
        ol_intake: {
            required: true
        },
        ol_agent: {
            required: true
        },
        ol_agent_from: {
            required: true
        },
        ol_applied_date: {
            required: function () {
                return $('#offerletter-modal').find('#ol_status').val() == 'APPLIED' ? true : false;
            }
        },
        ol_student_id: {
            required: function () {
                return $('#offerletter-modal').find('#ol_status').val() == 'APPROVED' ? true : false;
            },
            alphanumeric: true
        },
        ol_app_id: {
            required: function () {
                return $('#offerletter-modal').find('#ol_status').val() == 'APPROVED' ? true : false;
            }
        },
        ol_date: {
            required: true
        },
        ol_status: {
            required: true
        }
    },
    messages: {
        ol_college_name: {
            required: "College/University is required"
        },
        ol_program_name: {
            required: "Program Name is required"
        },
        ol_college_intake: {
            required: "Intake is required"
        },
        ol_college: {
            required: "College/University is required"
        },
        ol_program: {
            required: "Program Name is required"
        },
        ol_intake: {
            required: "Intake is required"
        },
        ol_agent: {
            required: "Agent is required"
        },
        ol_agent_from: {
            required: "Agent From is required"
        },
        ol_applied_date: {
            required: "Applied date is required for applied status"
        },
        ol_student_id: {
            required: "Student ID is required for approved status",
            alphanumeric: "Student ID must contain only alphanumeric characters"
        },
        ol_app_id: {
            required: "APP ID is required for approved Offer Letter"
        },
        ol_date: {
            required: "Date is required"
        },
        ol_status: {
            required: "Status is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/offer-letter/store', $("#offer-letter-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + "&candidate_visa_uuid=" + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#offerletter-modal").modal('hide');
                        $(".offer-letter-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Offer Letter Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        loadRequirementStatus('offer_letter');
                        offerletterDatatable.draw();
                        loadCompletionPercentage();
                    } else {
                        $(".offer-letter-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".offer-letter-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".offer-letter-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

$("#offerletter-modal").find("#ol_college").select2({
    width: '100%',
    placeholder: "Filter by name, study area",
    minimumInputLength: 2,
    allowClear: true,
    ajax: {
        url: baseUrl + '/v1/ajax/university/college/search',
        dataType: 'json',
        data: function (term, page) {
            return {
                term: term, // search term
            };
        },
        results: function (data, page) { // parse the results into the format expected by Select2.
            // since we are using custom formatting functions we do not need to alter the remote JSON data
            return {results: data};
        },
        cache: true
    },
    escapeMarkup: function (markup) {
        return markup;
    }
});


window.selectCollege = function (id) {
    id.select2({
        width: '100%',
        placeholder: "Filter by name, study area",
        minimumInputLength: 2,
        allowClear: true,
        ajax: {
            url: baseUrl + '/v1/ajax/university/college/search',
            dataType: 'json',
            data: function (term, page) {
                return {
                    term: term, // search term
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter the remote JSON data
                return {results: data};
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });
}

window.getCollegePrograms = function (value, selectedValue = null) {
    axios.get(baseUrl + '/v1/ajax/search/program-mapping?college-uuid=' + value)
            .then(function (response) {
                var html = '<option></option>';
                $.each(response.data, function (i, v) {
                    html += '<option data-value=\'' + v.source + '\' value="' + v.id + '">' + v.text + '</option>';
                });
                $("#offerletter-modal").find("#ol_program").html(html);
                $("#offerletter-modal").find("#ol_program").select2();
                if (selectedValue != null) {
                    $("#offerletter-modal").find("#ol_program").select2('val', selectedValue);
                }
//                $(window).unblock();
            })
            .catch(function (error) {
//                $(window).unblock();
            });

}

$("#offerletter-modal").find("#ol_college").on('change', function () {
    $("#offerletter-modal").find("#ol_program").html('<option></option>');
    $("#offerletter-modal").find("#ol_program").select2('val', null);
    $("#offerletter-modal").find("#ol_intake").select2('val', null);
    $("#offerletter-modal").find("#ol_intake").html('<option></option>');
//    $("#offerletter-modal").find("#ol_program").removeAttr('disabled');
    if ($(this).val() != null && $(this).val() != "") {
        getCollegePrograms($(this).val());
    }
//    $("#offerletter-modal").find("#ol_program").select2({
//        width: '100%',
//        placeholder: "Filter by name, study area",
//        minimumInputLength: 2,
//        allowClear: true,
//        ajax: {
//            url: baseUrl + '/v1/ajax/search/program-mapping?college-uuid=' + $(this).val(),
//            dataType: 'json',
//            data: function (term, page) {
//                return {
//                    term: term, // search term
//                };
//            },
//            results: function (data, page) { // parse the results into the format expected by Select2.
//                // since we are using custom formatting functions we do not need to alter the remote JSON data
//                return {results: data};
//            },
//        },
//        escapeMarkup: function (markup) {
//            return markup;
//        }
//    });
});
$("#offerletter-modal").find("#ol_program").on('change', function (e) {
    $("#offerletter-modal").find("#ol_intake").select2('val', null);
    $("#offerletter-modal").find("#ol_intake").select2('data', null);
    var data = $(this).select2().find(':selected').data('value');
    var html = '<option></option>';
    if (data != null && data != "") {
        if (data != null && data != "") {
            $.each(data, function (i, v) {
                if (Object.keys(v)[0] == 'OPEN') {
                    html += '<option value="' + Object.values(v)[0] + '">' + Object.values(v) + '</option>';
                }
            });
        }
    }
    $("#offerletter-modal").find("#ol_intake").html(html);
//    $("#offerletter-modal").find("#ol_program").trigger('change');
});


$("#offerletter-modal").find("#ol_attachment").on('change', function () {
    uploadAppendFiles(this, $("#offerletter-modal").find('#ol_attachment_file-view'), $("#offerletter-modal").find('#ol_attachment_file'), $("#offerletter-modal").find("#offer_letter_attachment_original"), $("#offerletter-modal").find("#check-current-file-upload"));
});

$("#offerletter-modal").find("#ol_additional_attachment").on('change', function () {
    uploadFiles(this, 'ol_additional_attachment_file-view', 'ol_additional_attachment_file', 'offer_letter_attachment2_original');
});


window.listAgents1 = function () {
    axios.get(baseUrl + '/v1/ajax/agents/list', {dataType: 'json'})
            .then(function (response) {
                var html = '<option></option>';
                var html1 = '<option></option>';
                $.each(response.data, function (i, v) {
//                    console.log(data);
                    var type = v.user_information_agent_type;
                    console.log(type);
                    if ($.inArray('AGENT', type) != -1) {
                        html += '<option value="' + v.user_information_uuid + '">' + v.user_information_fullname + '</option>';
                    }
                    if ($.inArray('AGENT_FROM', type) != -1) {
                        html1 += '<option value="' + v.user_information_uuid + '">' + v.user_information_fullname + '</option>';
                    }
                });
                $("#offerletter-modal").find("#ol_agent").html(html);
                $("#offerletter-modal").find("#ol_agent_from").html(html1);
                $("#offerletter-modal").find("#ol_agent").select2();
                $("#offerletter-modal").find("#ol_agent_from").select2();
//                $(window).unblock();
            })
            .catch(function (error) {
//                $(window).unblock();
            });
}

$("#offerletter-modal").find("#ol_status").on('change', function () {
    $("#offerletter-modal").find("#ol_date").val('');
    $("#offerletter-modal").find("#status-label-div").html(((($(this).val()).replace('_', ' '))).toLowerCase());
    $("#offerletter-modal").find("#ol_date").attr('placeholder', (((($(this).val()).replace('_', ' '))).toLowerCase()) + ' Date');
    if ($(this).val() == 'APPROVED') {
        $("#offerletter-modal").find("#ol-student-id-div").removeClass('d-none');
        $("#offerletter-modal").find("#conditional-offer-div").removeClass('d-none');
    } else {
        $("#offerletter-modal").find("#ol-student-id-div").addClass('d-none');
        $("#offerletter-modal").find("#conditional-offer-div").addClass('d-none');
    }
});

jQuery.validator.addMethod("alphanumeric", function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9.]*$/.test(value);
}, "Letters, numbers, and underscores only please");

//clone component
window.clone_component = function (t, n) {
    var tr = $(t).closest('.clone_component_' + n);
    $('.clone_component_' + n).find('select').select2('destroy');
    var clone = tr.clone();
    clone.find('input,textarea').val('');
    clone.find('textarea').attr('data-present', '0');
    tr.after(clone);
    $.each($('.clone_component_' + n), function (i, v) {
        $(v).find(".college-list").attr('id', 'college_' + i);
    });
    clone.find('.remove_component_button_' + n).removeClass("d-none");
    if ($('.clone_component_' + n).length > 1) {
        $('.remove_component_button_' + n).removeClass("d-none");
    }
    $('.clone_component_' + n).find('select').select2();
    clone.find('select').select2('val', null);
    selectCollege(clone.find(".college-list"));
//    $(t).addClass("hidden");
}

//remove component
window.remove_component = function (t, n) {
    if ($('.clone_component_' + n).length !== 1) {
        $(t).closest('.clone_component_' + n).remove();
        console.log('.clone_component_' + n);
        console.log($('.clone_component_' + n).length);
        if ($('.clone_component_' + n).length === 1) {
            $('.remove_component_button_' + n).addClass("d-none");
        } else {
            $('.remove_component_button_' + n).eq(($('.clone_component_' + n).length - 1)).removeClass("d-none");
        }
    } else {
        $('.remove_component_button_' + n).addClass("d-none");
    }
    $('.clone_component_button_' + n).eq(($('.clone_component_' + n).length - 1)).removeClass("d-none");
}


$("#ol-recomment-college-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        'college[]': {
            required: true
        }
    },
    messages: {
        'college[]': {
            required: "Minimum one college must be selected"
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
        let orderFormData = new FormData();
        var colleges = [];
        var cFlag = false;
        $("#ol-recomment-college-form").find(".college-list").each(function (i, v) {
            orderFormData.append('college[]', $(v).val());
            cFlag = true;
        });
        if (cFlag == false) {
            $("#ol-recomment-college-form").find(".college-select").each(function (i, v) {
                orderFormData.append('college[]', $(v).val());
            });
        }
        orderFormData.append('candidate_offer_letter_uuid', $("#ol-recomment-college-form").find("#candidate_offer_letter_uuid").val());
        axios.post(baseUrl + '/v1/ajax/case-management/offer-letter/recommend-college', orderFormData)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#ol-recommend-college-modal").modal('hide');
                        $(".offer-letter-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">College(s) Recommended Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".offer-letter-recommend-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".offer-letter-recommend-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".offer-letter-recommend-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});