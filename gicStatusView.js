var axios = require('axios');
var swal = require('sweetalert');
var gicStatusDatatable;
$(function () {
    $("#gic-status-modal").find("#account_open_date,#payment_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 20,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    gicStatusDatatable = $('#gic-status-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/gic-status/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
                d._visa_uuid = visaUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "gic_status_bank_name", 'title': 'Bank Name', orderable: false, render: function (data, full, row) {
                    return data;
                }
            },
            {"data": "account_open_date", 'title': 'Date of Account Open', orderable: false},
            {"data": "account_open_attachment_url", 'title': 'GIC A\C Attachment', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.account_open_attachment_original + ($.inArray(row.account_open_attachment_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.account_open_attachment_date : ""));
                }
            },
            {"data": "gic_payment_status", 'title': 'GIC Payment Status', orderable: false, render: function (data, full, row) {
                    return  camelize(data.replace("_", " ").toLowerCase());
                }
            },
            {"data": "payment_date", 'title': 'Date of Payment', orderable: false},
            {"data": "gic_status_payment_proof_url", 'title': 'TT Confirmation', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.gic_status_payment_proof_original + ($.inArray(row.gic_status_payment_proof_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.gic_status_payment_proof_date : ""));
                }
            },
//            {"data": "gic_investment_direction_status", 'title': 'GIC Investment Direction', render: function (data, full, row) {
//                    return  data == 'RECEIVED' ? '<span class="badge badge-success">Received</label>' : '<span class="badge badge-info">Awaited</label>';
//                }
//            },
            {"data": "gic_status_investment_confirmation_url", 'title': 'GIC Investment Direction', orderable: false, render: function (data, full, row) {
                    return data != null ? showFileUrl(data) : '<span class="badge badge-info">Awaited</label>';
                }
            },
            {"data": "gic_status_user_email", 'title': 'User login/email', orderable: false},
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return (row.gic_status_is_locked == 'NO' ? ' <a onclick="updateGicStatusRow(\'' + row.gic_status_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a>' : '') + ($.inArray(role, ['admin']) != -1 ? ' <a href="javascript:;" onclick="deleteGICRow(\'' + row.gic_status_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
        rowCallback: function (tableRow, data) {
            if (data.gic_status_is_locked == 'YES') {
                $(tableRow).addClass('row-highlight');
                $(tableRow).find('td:first-child').addClass('locked');
            }
        }
    });
});

window.showAddGicStatusModal = function () {
    $("#gic-status-modal").find('input:not(input[name=_token])').val('');
    $("#gic-status-modal").find('select').select2('val', null);
    $("#gic-status-modal").find("#gic_payment_status").select2('val', "NOT_PAID");
    $("#gic-status-modal").find("#gic-attachment-div").addClass('d-none');
    $("#gic-status-modal").find("#gic-investment-attachment-div").addClass('d-none');
    $("#gic-status-modal").find("#investment_direction_status_div").html('Awaited');
    $("#gic-status-modal").find('#view-gic-account-open-attachment').html('');
    $("#gic-status-modal").find('#view-gic-investment-confirmation-attachment').html('');
    $("#gic-status-modal").find('#view-gic_status_payment_proof_attachment').html('');
    $("#gic-status-modal").find('#view-investment_direction_certificate_file_attachment').html('');
    $("#gic-status-modal").modal('show');
}

$("#gic-status-modal").find("#gic_payment_status").on('change', function () {
    if ($(this).val() == 'PAID') {
        $("#gic-status-modal").find("#gic-attachment-div").removeClass('d-none');
        $("#gic-status-modal").find("#gic-investment-attachment-div").removeClass('d-none');
    } else {
        $("#gic-status-modal").find("#gic-attachment-div").addClass('d-none');
        $("#gic-status-modal").find("#gic-investment-attachment-div").addClass('d-none');
    }
});

/**
 * delete gic-status row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteGICRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/gic-status/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".gic-status-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    loadRequirementStatus('gic');
                                    gicStatusDatatable.draw();
                                    loadCompletionPercentage();
                                } else {
                                    $(".gic-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".gic-status-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".gic-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateGicStatusRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/gic-status/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#gic-status-modal").find('#gic_status_uuid').val(response.data.data.gic_status_uuid);
                    $("#gic-status-modal").find('#bank_name').select2('val', response.data.data.gic_status_bank_name);
                    $("#gic-status-modal").find('#gic_payment_status').select2('val', response.data.data.gic_payment_status);
                    if (response.data.data.gic_payment_status == 'PAID') {
                        $("#gic-status-modal").find("#gic-attachment-div").removeClass('d-none');
                        $("#gic-status-modal").find("#gic-investment-attachment-div").removeClass('d-none');
                    } else {
                        $("#gic-status-modal").find("#gic-attachment-div").addClass('d-none');
                        $("#gic-status-modal").find("#gic-investment-attachment-div").addClass('d-none');
                    }
                    $("#gic-status-modal").find('#gic_login').val(response.data.data.gic_status_user_email);
                    $("#gic-status-modal").find('#account_open_attachment').val(response.data.data.account_open_attachment);
                    $("#gic-status-modal").find('#gic_status_investment_confirmation_attachment').val(response.data.data.gic_status_investment_confirmation);
                    $("#gic-status-modal").find('#gic_status_payment_proof_attachment').val(response.data.data.gic_status_payment_proof);
                    $("#gic-status-modal").find('#investment_direction_certificate_file_attachment').val(response.data.data.investment_direction_certificate_file);
                    $("#gic-status-modal").find('#account_open_attachment_original').val(response.data.data.account_open_attachment_original);
                    $("#gic-status-modal").find('#gic_status_payment_proof_original').val(response.data.data.gic_status_payment_proof_original);
                    $("#gic-status-modal").find('#gic_status_investment_confirmation_original').val(response.data.data.gic_status_investment_confirmation_original);
                    $("#gic-status-modal").find('#account_open_date').val(response.data.data.account_open_date);
                    $("#gic-status-modal").find('#payment_date').val(response.data.data.payment_date);
//                    $("#gic-status-modal").find("#investment_direction_status_div").html(camelize((response.data.data.gic_investment_direction_status).toLowerCase()));
                    $("#gic-status-modal").find('#view-gic-account-open-attachment').html('');
                    if (response.data.data.account_open_attachment != null && response.data.data.account_open_attachment != 'undefined') {
                        $("#gic-status-modal").find('#view-gic-account-open-attachment').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.account_open_attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#gic-status-modal").find('#view-gic-investment-confirmation-attachment').html('');
                    if (response.data.data.gic_status_investment_confirmation != null && response.data.data.gic_status_investment_confirmation != 'undefined') {
                        $("#gic-status-modal").find('#investment_direction_status_div').html('Received');
                        $("#gic-status-modal").find('#view-gic-investment-confirmation-attachment').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.gic_status_investment_confirmation + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    } else {
                        $("#gic-status-modal").find('#investment_direction_status_div').html('Awaited');
                    }
                    $("#gic-status-modal").find('#view-gic_status_payment_proof_attachment').html('');
                    if (response.data.data.gic_status_payment_proof != null && response.data.data.gic_status_payment_proof != 'undefined') {
                        $("#gic-status-modal").find('#view-gic_status_payment_proof_attachment').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.gic_status_payment_proof + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#gic-status-modal").find('#view-investment_direction_certificate_file_attachment').html('');
//                    if (response.data.data.investment_direction_certificate_file != null && response.data.data.investment_direction_certificate_file != 'undefined') {
//                        $("#gic-status-modal").find('#view-investment_direction_certificate_file_attachment').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.investment_direction_certificate_file + '"><img src="' + baseUrl + '/img/document.png"/></a>');
//                    } 
                    $("#gic-status-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".gic-status-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".gic-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#gic-status-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        bank_name: {
            required: true,
            alpha: true
        },
        gic_payment_status: {
            required: true
        },
        account_open_date: {
            required: true
        },
        gic_login: {
            required: true
        },
        account_open_attachment: {
            required: true
        },
        gic_status_payment_proof_attachment: {
            required: function () {
                return $("#gic-status-modal").find("#gic_payment_status").val() == 'PAID' ? true : false
            }
        }
    },
    messages: {
        bank_name: {
            required: "Bank name is required",
            alpha: "Bank name must have valid characters"
        },
        account_open_date: {
            required: "Date of account open is required"
        },
        gic_payment_status: {
            required: "GIC payment status is required"
        },
        gic_login: {
            required: "User login/email is required"
        },
        account_open_attachment: {
            required: "A\c attachment is required"
        },
        gic_status_payment_proof_attachment: {
            required: "TT confirmation is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/gic-status/store', $("#gic-status-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#gic-status-modal").modal('hide');
                        $(".gic-status-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">GIC Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        loadRequirementStatus('gic');
                        gicStatusDatatable.draw();
                        loadCompletionPercentage();
                    } else {
                        $(".gic-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".gic-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".gic-status-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

$("#account_open_attachment-file").on('change', function () {
    uploadGicAttachments(this, 'view-gic-account-open-attachment', 'account_open_attachment', 'account_open_attachment_original');
});
$("#gic_status_investment_confirmation_attachment-file").on('change', function () {
    uploadGicAttachments(this, 'view-gic-investment-confirmation-attachment', 'gic_status_investment_confirmation_attachment', 'gic_status_investment_confirmation_original');
});
$("#gic_status_payment_proof_attachment-file").on('change', function () {
    uploadGicAttachments(this, 'view-gic_status_payment_proof_attachment', 'gic_status_payment_proof_attachment', 'gic_status_payment_proof_original');
});
$("#investment_direction_certificate_file_attachment-file").on('change', function () {
    uploadGicAttachments(this, 'view-investment_direction_certificate_file_attachment', 'investment_direction_certificate_file_attachment', 'investment_direction_certificate_file_original', $("#gic-status-modal").find("#gic_status_investment_confirmation_attachment"));
});


window.uploadGicAttachments = function (that, viewAttachmentDiv, attachmentControl, original, other = null) {
    console.log(that.files);
    if (that.files && that.files[0]) {

        var FR = new FileReader();
        var mimeType = that.files[0].type;
        var originalName = that.files[0].name;
        $("#" + original).val(that.files[0].name);
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = that.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(that).val('');
            $("#" + original).val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var fileData = e.target.result;
            addMasterDocument(mimeType, fileData, viewAttachmentDiv, attachmentControl, originalName);
            if (other != null) {
                $("#gic-status-modal").find("#investment_direction_status_div").html('Received');
            }
        });
        FR.readAsDataURL(that.files[0]);
}
}

$("#gic-refund-button").on('click', function () {
    swal({
        title: "Make Refund?",
        text: "Are you refund the GIC?",
        icon: "warning",
        buttons: true,
        dangerMode: false
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
                    axios.post(baseUrl + '/v1/ajax/refund/update-detail', {
                        type: 'gic',
                        gic_refund_status: 'PENDING',
                        candidate_visa_uuid: visaUuid
                    })
                            .then(function (response) {
                                $(window).unblock();
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    swal("", 'Refund Added Successfully', "success");
                                    gicStatusDatatable.draw();
                                } else {
                                    swal("", 'Something went wrong', "error");
                                }
                            })
                            .catch(function (error) {
                                $(window).unblock();
                                if ((error.response.data).hasOwnProperty('message')) {
                                    swal("", error.response.data.message, "error");
                                } else {
                                    swal("", 'Something went wrong', "error");
                                }
                            });
                }
            });
});