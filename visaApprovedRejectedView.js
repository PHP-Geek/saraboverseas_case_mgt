var axios = require('axios');
var swal = require('sweetalert');
import '../CaseManagement/visaStatusInclude';

$(function () {
    getCandidateVisaStatus();
    $("#visa-status-modal").find(".visa-status-date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
});

window.adjusModalSectionVisaStatus = function (status) {
    switch (status) {
        case 'ORIGINAL_PASSPORT_REQUESTED':
            $("#original_passport_requested-div").removeClass('d-none');
            $("#original_passport_submitted-div").addClass('d-none');
            $("#visa_approved-div").addClass('d-none');
            $("#visa_refused-div").addClass('d-none');
            $("#further_doc_requested-div").addClass('d-none');
            $("#visa_AIP-div").addClass('d-none');
            $("#original_passport_requested-div").find('input').removeAttr('disabled');
            $("#original_passport_submitted-div").find('input').attr('disabled', true);
            $("#visa_approved-div").find('input').attr('disabled', true);
            $("#visa_refused-div").find('input').attr('disabled', true);
            $("#further_doc_requested-div").find('input').attr('disabled', true);
            $("#visa_AIP-div").find('input').attr('disabled', true);
            break;
        case 'ORIGINAL_PASSPORT_SUBMITTED':
            $("#original_passport_requested-div").addClass('d-none');
            $("#original_passport_submitted-div").removeClass('d-none');
            $("#visa_approved-div").addClass('d-none');
            $("#visa_refused-div").addClass('d-none');
            $("#further_doc_requested-div").addClass('d-none');
            $("#visa_AIP-div").addClass('d-none');
            $("#original_passport_requested-div").find('input').attr('disabled', true);
            $("#original_passport_submitted-div").find('input').removeAttr('disabled');
            $("#visa_approved-div").find('input').attr('disabled', true);
            $("#visa_refused-div").find('input').attr('disabled', true);
            $("#further_doc_requested-div").find('input').attr('disabled', true);
            $("#visa_AIP-div").find('input').attr('disabled', true);
            break;
        case 'VISA_APPROVED':
            $("#original_passport_requested-div").addClass('d-none');
            $("#original_passport_submitted-div").addClass('d-none');
            $("#visa_approved-div").removeClass('d-none');
            $("#visa_refused-div").addClass('d-none');
            $("#further_doc_requested-div").addClass('d-none');
            $("#visa_AIP-div").addClass('d-none');
            $("#original_passport_requested-div").find('input').attr('disabled', true);
            $("#original_passport_submitted-div").find('input').attr('disabled', true);
            $("#visa_approved-div").find('input').removeAttr('disabled');
            $("#visa_refused-div").find('input').attr('disabled', true);
            $("#further_doc_requested-div").find('input').attr('disabled', true);
            $("#visa_AIP-div").find('input').attr('disabled', true);
            break;
        case 'VISA_REFUSED':
            $("#original_passport_requested-div").addClass('d-none');
            $("#original_passport_submitted-div").addClass('d-none');
            $("#visa_approved-div").addClass('d-none');
            $("#visa_refused-div").removeClass('d-none');
            $("#further_doc_requested-div").addClass('d-none');
            $("#visa_AIP-div").addClass('d-none');
            $("#original_passport_requested-div").find('input').attr('disabled', true);
            $("#original_passport_submitted-div").find('input').attr('disabled', true);
            $("#visa_approved-div").find('input').attr('disabled', true);
            $("#visa_refused-div").find('input').removeAttr('disabled');
            $("#further_doc_requested-div").find('input').attr('disabled', true);
            $("#visa_AIP-div").find('input').attr('disabled', true);
            break;
        case 'FURTHER_DOC_REQUESTED':
            $("#original_passport_requested-div").addClass('d-none');
            $("#original_passport_submitted-div").addClass('d-none');
            $("#visa_approved-div").addClass('d-none');
            $("#visa_refused-div").addClass('d-none');
            $("#visa_AIP-div").addClass('d-none');
            $("#further_doc_requested-div").removeClass('d-none');
            $("#original_passport_requested-div").find('input').attr('disabled', true);
            $("#original_passport_submitted-div").find('input').attr('disabled', true);
            $("#visa_approved-div").find('input').attr('disabled', true);
            $("#visa_refused-div").find('input').attr('disabled', true);
            $("#further_doc_requested-div").find('input').removeAttr('disabled');
            $("#visa_AIP-div").find('input').attr('disabled', true);
            break;
        case 'AIP_RECEIVED':
            $("#original_passport_requested-div").addClass('d-none');
            $("#original_passport_submitted-div").addClass('d-none');
            $("#visa_approved-div").addClass('d-none');
            $("#visa_refused-div").addClass('d-none');
            $("#further_doc_requested-div").addClass('d-none');
            $("#visa_AIP-div").removeClass('d-none');
            $("#original_passport_requested-div").find('input').attr('disabled', true);
            $("#original_passport_submitted-div").find('input').attr('disabled', true);
            $("#visa_approved-div").find('input').attr('disabled', true);
            $("#visa_refused-div").find('input').attr('disabled', true);
            $("#further_doc_requested-div").find('input').attr('disabled', true);
            $("#visa_AIP-div").find('input').removeAttr('disabled');
            break;
        default:
            $("#original_passport_requested-div").addClass('d-none');
            $("#original_passport_submitted-div").addClass('d-none');
            $("#visa_approved-div").addClass('d-none');
            $("#visa_refused-div").addClass('d-none');
            $("#further_doc_requested-div").addClass('d-none');
            $("#visa_AIP-div").addClass('d-none');
            $("#original_passport_requested-div").find('input').attr('disabled', true);
            $("#original_passport_submitted-div").find('input').attr('disabled', true);
            $("#visa_approved-div").find('input').attr('disabled', true);
            $("#visa_refused-div").find('input').attr('disabled', true);
            $("#further_doc_requested-div").find('input').attr('disabled', true);
            $("#visa_AIP-div").find('input').attr('disabled', true);
            break;
    }
}


$("#visa_status_type").on('change', function () {
    adjusModalSectionVisaStatus($(this).val());
});


window.showVisaStatusModal = function () {
    $("#visa-status-modal").modal('show');
}



window.getCandidateVisaStatus = function () {
    $('#visa-status-body').block({
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
    axios.get(baseUrl + '/v1/ajax/case-management/visa-status/get?visa-uuid=' + visaUuid)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    var html = '';
                    if (response.data.data != null && Object.keys(response.data.data).length > 0) {
                        html += '<tr><th>Status</th><td style="text-transform:capitalize">' + ((response.data.data.visa_status_type).toLowerCase()).replace("_", " ") + '</td></tr>';
                        if (response.data.data.visa_status_OPR_content != null) {
                            html += '<tr><th>Original Passport Requested</th><td>';
                            $.each(response.data.data.visa_status_OPR_content, function (i, v) {
                                html += '<div class="d-inline-block p-1">' + (v.attachment != null && v.attachment != "" ? showFileUrl((baseUrl + '/get-document?_doc_token=' + v.attachment), (v.original_name + ($.inArray(v.uploaded_std_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + v.uploaded_std_date : ""))) : '') + '<br/><span class="badge badge-primary">' + convertDate(v.date) + '</span></div>';
                            });
                            html += '</td></tr>';
                        }
                        if (response.data.data.visa_status_OPS_content != null) {
                            html += '<tr><th>Original Passport Submitted</th><td>';
                            $.each(response.data.data.visa_status_OPS_content, function (i, v) {
                                html += '<div class="d-inline-block p-1">' + (v.attachment != null && v.attachment != "" ? showFileUrl((baseUrl + '/get-document?_doc_token=' + v.attachment), v.original_name + ($.inArray(v.uploaded_std_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + v.uploaded_std_date : "")) : '') + '<br/><span class="badge badge-primary">' + convertDate(v.date) + '</span></div>';
                            });
                            html += '</td></tr>';
                        }
                        if (response.data.data.visa_status_visa_approved_content != null) {
                            html += '<tr><th>Visa Approved</th><td>';
                            $.each(response.data.data.visa_status_visa_approved_content, function (i, v) {
                                html += '<div class="d-inline-block p-1">' + (v.attachment != null && v.attachment != "" ? showFileUrl((baseUrl + '/get-document?_doc_token=' + v.attachment), v.original_name + ($.inArray(v.uploaded_std_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + v.uploaded_std_date : "")) : '') + '<br/><span class="badge badge-primary">' + convertDate(v.date) + '</span></div>';
                            });
                            html += '</td></tr>';
                        }
                        if (response.data.data.visa_status_visa_refused_content != null) {
                            html += '<tr><th>Visa Rejected</th><td>';
                            $.each(response.data.data.visa_status_visa_refused_content, function (i, v) {
                                html += '<div class="d-inline-block p-1">' + (v.attachment != null && v.attachment != "" ? showFileUrl((baseUrl + '/get-document?_doc_token=' + v.attachment), v.original_name + ($.inArray(v.uploaded_std_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + v.uploaded_std_date : "")) : '') + '<br/><span class="badge badge-primary">' + convertDate(v.date) + '</span></div>';
                            });
                            html += '</td></tr>';
                        }
                        if (response.data.data.visa_status_FDR_content != null) {
                            html += '<tr><th>Further Doc Requested</th><td>';
                            $.each(response.data.data.visa_status_FDR_content, function (i, v) {
                                html += '<div class="d-inline-block p-1">' + (v.attachment != null && v.attachment != "" ? showFileUrl((baseUrl + '/get-document?_doc_token=' + v.attachment), v.original_name + ($.inArray(v.uploaded_std_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + v.uploaded_std_date : "")) : '') + '<br/><span class="badge badge-primary">' + convertDate(v.date) + '</span></div>';
                            });
                            html += '</td></tr>';
                        }
                        if (response.data.data.visa_status_AIP_content != null) {
                            html += '<tr><th>AIP Received</th><td>';
                            $.each(response.data.data.visa_status_AIP_content, function (i, v) {
                                html += '<div class="d-inline-block p-1">' + (v.attachment != null && v.attachment != "" ? showFileUrl((baseUrl + '/get-document?_doc_token=' + v.attachment), v.original_name + ($.inArray(v.uploaded_std_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + v.uploaded_std_date : "")) : '') + '<br/><span class="badge badge-primary">' + convertDate(v.date) + '</span></div>';
                            });
                            html += '</td></tr>';
                        }
                        setModalData(response.data.data);
                    } else {
                        html += '<tr><td class="text-center">No Visa Status Added Yet.</td></tr>';
                    }
                    html += '<tr><td class="text-right" colspan="2"><button type="button" class="btn btn-xs btn-primary" onclick="showVisaStatusModal()">Update Status</button></td></tr>';
                    $('#visa-status-body').html(html);
                } else {
                    alert('Something went wrong');
                }
                $('#visa-status-body').unblock();
            })
            .catch(function (error) {
                console.log(error);
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $('#visa-status-body').unblock();
            });
}

window.setModalData = function (data) {
    $("#visa-status-modal").find("#visa_status_type").select2('val', data.visa_status_type);
    loadOPRContent(data.visa_status_OPR_content);
    loadOPSContent(data.visa_status_OPS_content);
    loadVisaApprovedContent(data.visa_status_visa_approved_content);
    loadVisaRefusedContent(data.visa_status_visa_refused_content);
    loadFDRContent(data.visa_status_FDR_content);
    loadAIPReceivedContent(data.visa_status_AIP_content);
    adjusModalSectionVisaStatus(data.visa_status_type);
};


window.uploadAttachmentVisaStatus = function (that) {
    var id = $(that).data('row-id');
    uploadFiles(that, 'view-visa_status_attachment_' + id, 'visa_status_attachment_' + id, 'visa_status_attachment_original_' + id, 'visa_status_attachment_date_' + id);
}

$("#visa-status-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        visa_status_type: {
            required: true
        },
//        'visa_status_date[]': {
//            required: true
//        },
//        'visa_status_attachment[]': {
//            required: true
//        }
    },
    messages: {
        visa_status_type: {
            required: "Status is required"
        },
//        'visa_status_date[]': {
//            required: "Date must be selected"
//        },
//        'visa_status_attachment[]': {
//            required: "You must upload atleast one attachment"
//        }
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa-status/store', $("#visa-status-form").serialize() + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#visa-status-modal").modal('hide');
                        loadRequirementStatus('visa_status');
                        getCandidateVisaStatus();
                        loadCompletionPercentage();
                        $(".visa-status-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Visa Status Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".visa-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".visa-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".visa-status-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});


//clone component
window.clone_component = function (t, n) {
    var tr = $(t).closest('.clone_component_' + n);
    var clone = tr.clone();
    clone.find('input,textarea').val('');
    clone.find('textarea').attr('data-present', '0');
    clone.find(".visa-status-date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    clone.find('.view-visa-status-attachment').html('');
    tr.after(clone);
    $.each($('.clone_component_' + n), function (i, v) {
        $(v).find(".view-visa-status-attachment").attr('id', 'view-visa_status_attachment_' + n + '_' + i);
        $(v).find(".attachment-name").attr('id', 'visa_status_attachment_' + n + '_' + i);
        $(v).find(".original_attachment-name").attr('id', 'visa_status_attachment_original_' + n + '_' + i);
        $(v).find(".attachment-date").attr('id', 'visa_status_attachment_date_' + n + '_' + i);
        $(v).find(".visa-status-attachment-file").attr('data-row-id', +n + '_' + i);
    });
    clone.find('.remove_component_button_' + n).removeClass("d-none");
    if ($('.clone_component_' + n).length > 1) {
        $('.remove_component_button_' + n).removeClass("d-none");
    }
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