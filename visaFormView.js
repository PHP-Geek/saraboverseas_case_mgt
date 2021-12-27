var axios = require('axios');
var swal = require('sweetalert');

$(function () {
    $("#main-form-date,#family-info-form-date,#representative-form-date,#visa-submission-date,#vaf-form-date,#visa-checklist-date,#vfs-appointment-date,#ihs-confirmation-form-date,#oshc-date,#embassy-fee-date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    $("#biomatrix-appointment-date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false
    });
    getCandidateVisaForm();
});

window.showAdditionalDocModal = function () {
    $("#additional-doc-modal").find("#view-visa_additional_doc").html('');
    $("#additional-doc-modal").find("#visa_additional_doc").val('');
    $("#additional-doc-modal").modal('show');
}

window.getCandidateVisaForm = function () {
    $('#visa-form-table').block({
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
    axios.get(baseUrl + '/v1/ajax/case-management/visa-form/fetch?visa-uuid=' + visaUuid)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    //main application visa form
                    if ((response.data.data).hasOwnProperty('MAIN_APPLICATION')) {
                        $("#visa-form-table").find("#main-form-date").val((response.data.data.MAIN_APPLICATION.candidate_visa_form_date));
                        if (response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment != null && response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#main_visa_form_attachment").val(response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#main_visa_form_attachment_original").val(response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#main-application-form").html(showFileUrl(response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment_url, response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment_original + ($.inArray(response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.MAIN_APPLICATION.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-main_visa_form").html('<a target="_blank" href="' + response.data.data.MAIN_APPLICATION.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //family info visa form
                    if ((response.data.data).hasOwnProperty('FAMILY_INFO')) {
                        $("#visa-form-table").find("#family-info-form-date").val((response.data.data.FAMILY_INFO.candidate_visa_form_date));
                        if (response.data.data.FAMILY_INFO.candidate_visa_form_attachment != null && response.data.data.FAMILY_INFO.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#family_info_visa_form_attachment").val(response.data.data.FAMILY_INFO.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#family_info_visa_form_attachment_original").val(response.data.data.FAMILY_INFO.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#family-info-application-form").html(showFileUrl(response.data.data.FAMILY_INFO.candidate_visa_form_attachment_url, response.data.data.FAMILY_INFO.candidate_visa_form_attachment_original + ($.inArray(response.data.data.FAMILY_INFO.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.FAMILY_INFO.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.FAMILY_INFO.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-family_info_visa_form").html('<a target="_blank" href="' + response.data.data.FAMILY_INFO.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //representative visa form
                    if ((response.data.data).hasOwnProperty('REPRESENTATIVE')) {
                        $("#visa-form-table").find("#representative-form-date").val((response.data.data.REPRESENTATIVE.candidate_visa_form_date));
                        if (response.data.data.REPRESENTATIVE.candidate_visa_form_attachment != null && response.data.data.REPRESENTATIVE.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#representative_form_attachment").val(response.data.data.REPRESENTATIVE.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#representative_form_attachment_original").val(response.data.data.REPRESENTATIVE.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#representative-application-form").html(showFileUrl(response.data.data.REPRESENTATIVE.candidate_visa_form_attachment_url, response.data.data.REPRESENTATIVE.candidate_visa_form_attachment_original + ($.inArray(response.data.data.REPRESENTATIVE.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.REPRESENTATIVE.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.REPRESENTATIVE.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-representative_visa_form").html('<a target="_blank" href="' + response.data.data.REPRESENTATIVE.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //VAF visa form
                    if ((response.data.data).hasOwnProperty('VAF')) {
                        $("#visa-form-table").find("#vaf-form-date").val((response.data.data.VAF.candidate_visa_form_date));
                        if (response.data.data.VAF.candidate_visa_form_attachment != null && response.data.data.VAF.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#vaf_form_attachment").val(response.data.data.VAF.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#vaf_form_attachment_original").val(response.data.data.VAF.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#vaf-application-form").html(showFileUrl(response.data.data.VAF.candidate_visa_form_attachment_url, response.data.data.VAF.candidate_visa_form_attachment_original + ($.inArray(response.data.data.VAF.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.VAF.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.VAF.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-vaf_form_attachment").html('<a target="_blank" href="' + response.data.data.VAF.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //visa checklist visa form
                    if ((response.data.data).hasOwnProperty('VISA_CHECKLIST')) {
                        $("#visa-form-table").find("#visa-checklist-date").val((response.data.data.VISA_CHECKLIST.candidate_visa_form_date));
                        if (response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment != null && response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#visa_checklist_attachment").val(response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#visa_checklist_attachment_original").val(response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#visa-checklist-form").html(showFileUrl(response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment_url, response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment_original + ($.inArray(response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.VISA_CHECKLIST.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-visa_checklist_attachment").html('<a target="_blank" href="' + response.data.data.VISA_CHECKLIST.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //vfs appointment
                    if ((response.data.data).hasOwnProperty('VFS_APPOINTMENT')) {
                        $("#visa-form-table").find("#visa-checklist-date").val((response.data.data.VAF.candidate_visa_form_date));
                        if (response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment != null && response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#vfs_appointment_attachment").val(response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#vfs_appointment_attachment_original").val(response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#vfs-appointment-form").html(showFileUrl(response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment_url, response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment_original + ($.inArray(response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.VFS_APPOINTMENT.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-vfs_appointment_attachment").html('<a target="_blank" href="' + response.data.data.VFS_APPOINTMENT.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //IHS Confirmation visa form
                    if ((response.data.data).hasOwnProperty('IHS_CONFIRMATION')) {
                        $("#visa-form-table").find("#vaf-form-date").val((response.data.data.IHS_CONFIRMATION.candidate_visa_form_date));
                        if (response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment != null && response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#ihs_confirmation_attachment").val(response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#ihs_confirmation_attachment_original").val(response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#ihs-confirmation-form").html(showFileUrl(response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment_url, response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment_original + ($.inArray(response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.IHS_CONFIRMATION.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-ihs_confirmation_attachment").html('<a target="_blank" href="' + response.data.data.IHS_CONFIRMATION.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //ohsc visa form
                    if ((response.data.data).hasOwnProperty('OSHC')) {
                        $("#visa-form-table").find("#oshc-date").val((response.data.data.OSHC.candidate_visa_form_date));
                        if (response.data.data.OSHC.candidate_visa_form_attachment != null && response.data.data.OSHC.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#oshc_attachment").val(response.data.data.VAF.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#oshc_attachment_original").val(response.data.data.VAF.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#oshc-visa-form").html(showFileUrl(response.data.data.OSHC.candidate_visa_form_attachment_url, response.data.data.OSHC.candidate_visa_form_attachment_original + ($.inArray(response.data.data.OSHC.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.OSHC.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.OSHC.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-oshc_attachment").html('<a target="_blank" href="' + response.data.data.OSHC.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                    //VAF visa form
                    if ((response.data.data).hasOwnProperty('EMBASSY_FEE_CONFIRMATION')) {
                        $("#visa-form-table").find("#embassy-fee-date").val((response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_date));
                        if (response.data.data.VAF.candidate_visa_form_attachment != null && response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment != 'undefined') {
                            $("#visa-form-table").find("#embassy_fee_attachment").val(response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment);
                            $("#visa-form-table").find("#embassy_fee_attachment_original").val(response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment_original);
                            $("#visa-form-table").find("#embassy-fee-form").html(showFileUrl(response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment_url, response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment_original + ($.inArray(response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment_date : "")) + ' ' + response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_date);
                            $("#visa-form-table").find("#view-embassy_fee_attachment").html('<a target="_blank" href="' + response.data.data.EMBASSY_FEE_CONFIRMATION.candidate_visa_form_attachment_url + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                        }
                    }
                } else {
                    alert('Something went wrong');
                }
                $('#visa-form-table').unblock();
            })
            .catch(function (error) {
                console.log(error);
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $('#visa-form-table').unblock();
            });
}

window.editVFColumn = function (that, type) {
    $(that).closest('.visa-form-td').find('.rec-view').hide();
    $(that).closest('.visa-form-td').find('.rec-edit').show();
    $(that).closest('.visa-form-td').find('.rec-btn-edit').hide();
    $(that).closest('.visa-form-td').find('.rec-btn-submit').show();
}

window.submitVFColumn = function (that, type, status = 'false') {
    if (status == 'true') {
        $(that).closest('.visa-form-td').find('.rec-view').show();
        $(that).closest('.visa-form-td').find('.rec-edit').hide();
        $(that).closest('.visa-form-td').find('.rec-btn-edit').show();
        $(that).closest('.visa-form-td').find('.rec-btn-submit').hide();
    } else {
        updateVisaForm(that, type);
}
}

window.updateVisaDetailColumn = function (that, id) {
    $(that).closest('#visa-form-' + id + '-col').find('.rec-view').hide();
    $(that).closest('#visa-form-' + id + '-col').find('.rec-edit').show();
    $(that).closest('#visa-form-' + id + '-col').find('.rec-btn-edit').hide();
    $(that).closest('#visa-form-' + id + '-col').find('.rec-btn-submit').show();
}

window.submitVisaDetailColumn = function (that, id, status = 'false') {
    if (status == 'true') {
        $(that).closest('#visa-form-' + id + '-col').find('.rec-view').show();
        $(that).closest('#visa-form-' + id + '-col').find('.rec-edit').hide();
        $(that).closest('#visa-form-' + id + '-col').find('.rec-btn-edit').show();
        $(that).closest('#visa-form-' + id + '-col').find('.rec-btn-submit').hide();
    } else {
        updateVisaDetail(that, id);
}
}

window.updateVisaDetail = function (that, id) {
    if (id == 'biomatrix-appointment-status') {
        var value = $(that).closest('#visa-form-' + id + '-col').find(".col-value").select2('val');
    } else {
        var value = $(that).closest('#visa-form-' + id + '-col').find(".col-value").val();
    }
    if (value == "" || value.length < 0) {
        $(that).closest('.card-body').find(".visa-detail-update-ajax-response").html('<div class="alert alert-danger justify-content-between">Pleae fill the required field</span>' + alertClose() + '</div>');
        return;
    }
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
    axios.post(baseUrl + '/v1/ajax/case-management/update-visa-detail',
            {
                _token: $('meta[name="csrf-token"]').attr('content'),
                value: value,
                col: id,
                candidate_visa_uuid: visaUuid,
                candidate_detail_uuid: candidateUuid

            })
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $(that).closest('.card-body').find(".visa-detail-update-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Updated Successfully</span>' + alertClose() + '</div>');
                    $(that).closest('#visa-form-' + id + '-col').find('.rec-view').html(response.data.data);
                    $(that).closest('#visa-form-' + id + '-col').find('.rec-view').show();
                    $(that).closest('#visa-form-' + id + '-col').find('.rec-edit').hide();
                    $(that).closest('#visa-form-' + id + '-col').find('.rec-btn-edit').show();
                    $(that).closest('#visa-form-' + id + '-col').find('.rec-btn-submit').hide();
                    loadRequirementStatus('visa_forms');
                    loadCompletionPercentage();
                } else {
                    $(that).closest('.card-body').find(".visa-detail-update-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(that).closest('.card-body').find(".visa-detail-update-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(that).closest('.card-body').find(".visa-detail-update-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

window.updateVisaForm = function (that, type) {
    var form_attachment = $(that).closest('.visa-form-td').find(".visa-form-attachment-file").val();
    var form_attachment_original = $(that).closest('.visa-form-td').find(".visa-form-attachment-file-original").val();
    var attachment_date = $(that).closest('.visa-form-td').find(".attachment-date").val();
    if (form_attachment == "" || form_attachment.length <= 0) {
        $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please upload the file attachment</span>' + alertClose() + '</div>');
        return;
    }
    if (attachment_date == "" || attachment_date.length <= 0) {
        $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please select the date</span>' + alertClose() + '</div>');
        return;
    }
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
    axios.post(baseUrl + '/v1/ajax/case-management/visa-form/store',
            {
                _token: $('meta[name="csrf-token"]').attr('content'),
                form_attachment: form_attachment,
                form_attachment_original: form_attachment_original,
                attachment_date: attachment_date,
                type: type,
                candidate_detail_uuid: candidateUuid,
                candidate_visa_uuid: visaUuid

            })
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $(that).closest('.visa-form-td').find('.rec-view').html(showFileUrl(response.data.data.candidate_visa_form_attachment_url, response.data.data.candidate_visa_form_attachment_original + ($.inArray(response.data.data.candidate_visa_form_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + response.data.data.candidate_visa_form_attachment_date : "")) + response.data.data.candidate_visa_form_date);
                    loadRequirementStatus('visa_forms');
                    loadCompletionPercentage();
                    $(that).closest('.visa-form-td').find('.rec-view').show();
                    $(that).closest('.visa-form-td').find('.rec-edit').hide();
                    $(that).closest('.visa-form-td').find('.rec-btn-edit').show();
                    $(that).closest('.visa-form-td').find('.rec-btn-submit').hide();
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".visa-form-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#main_visa_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-main_visa_form', 'main_visa_form_attachment', 'main_visa_form_attachment_original');
});

$("#family_info_visa_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-family_info_visa_form', 'family_info_visa_form_attachment', 'family_info_visa_form_attachment_original');
});

$("#representative_visa_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-representative_visa_form', 'representative_form_attachment', 'representative_form_attachment_original');
});

$("#vaf_visa_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-vaf_form_attachment', 'vaf_form_attachment', 'vaf_form_attachment_original');
});

$("#visa_checklist_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-visa_checklist_attachment', 'visa_checklist_attachment', 'visa_checklist_attachment_original');
});

$("#vfs_appointment_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-vfs_appointment_attachment', 'vfs_appointment_attachment', 'vfs_appointment_attachment_original');
});

$("#ihs_confirmation_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-ihs_confirmation_attachment', 'ihs_confirmation_attachment', 'ihs_confirmation_attachment_original');
});

$("#ohsc_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-oshc_attachment', 'oshc_attachment', 'oshc_attachment_original');
});

$("#embassy_fee_form").on('change', function () {
    uploadVisaFormAttachment(this, 'view-embassy_fee_attachment', 'embassy_fee_attachment', 'embassy_fee_attachment_original');
});

$("#visa_copy_attachment").on('change', function () {
    uploadVisaFormAttachment(this, 'view-visa_copy_attachment_file', 'visa_copy_attachment_file');
});
$("#additional-doc-modal").find("#visa_additional_doc_file").on('change', function () {
    uploadVisaFormAttachment(this, 'view-visa_additional_doc', 'visa_additional_doc', 'visa_additional_doc_original');
});

$("#biomatrix-attachment-file").on('change', function () {
    uploadFiles(this, 'view-biomatrix_appointment_attachment', 'biomatrix_appointment_attachment', 'biomatrix_appointment_attachment_original');
});

window.uploadVisaFormAttachment = function (that, viewAttachmentDiv, attachmentControl, original = null) {
    console.log(that.files);
    if (that.files && that.files[0]) {
        var FR = new FileReader();
        var mimeType = that.files[0].type;
        var originalName = that.files[0].name;
        if (original != null) {
            $("#" + original).val(that.files[0].name);
        }
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(that).val('');
            if (original != null) {
                $("#" + original).val('');
            }
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
        FR.addEventListener("load", function (e) {
            var fileData = e.target.result;
            addMasterDocument(mimeType, fileData, viewAttachmentDiv, attachmentControl, originalName);
        });
        FR.readAsDataURL(that.files[0]);
}
}

$("#additional-doc-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        visa_additional_doc: {
            required: true
        }
    },
    messages: {
        visa_additional_doc: {
            required: "Please upload the document"
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
        axios.post(baseUrl + '/v1/ajax/case-management/update-additional-doc', $("#additional-doc-form").serialize() + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        console.log(response.data.data);
                        $("#visa-form-additional-doc-col").find('.rec-view').append(' <div class="d-inline-block" style="margin-right:7px;position:relative">' + showFileUrl(baseUrl + "/get-document?_doc_token=" + Object.keys(response.data.data)[0], Object.values(response.data.data)[0]) + ' <a  onclick="removeFile(this)" data-id="' + (Object.keys(response.data.data)[0]) + '" class="cross-button" href="javascript:;"><i class="fa fa-times-circle"></i></a></div>');
                        $("#additional-doc-modal").modal('hide');
                        $("#additional-doc-modal").find('file').val('');
                        $(".visa-form-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Updated Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".additional-doc-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".additional-doc-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".additional-doc-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

window.removeFile = function (that) {
    swal({
        title: "Delete File?",
        text: "Are you sure delete the file?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    var uuid = $(that).data('id');
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
                    axios.post(baseUrl + '/v1/ajax/case-management/delete-additional-doc', {candidate_visa_uuid: visaUuid, uuid: uuid})
                            .then(function (response) {
                                $(window).unblock();
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    console.log(response.data.data);
                                    $(that).closest('div').remove();
                                    $("#additional-doc-modal").modal('hide');
                                    $(".visa-form-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Deleted Successfully.</span>' + alertClose() + '</div>');
                                } else {
                                    $(".additional-doc-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                $(window).unblock();
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".additional-doc-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".additional-doc-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                            });
                }
            });
}