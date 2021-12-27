var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';

var feeStatusDatatable;
$(function () {
    $("#fee-status-modal").find("#date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    feeStatusDatatable = $('#fee-status-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/fee-status/datatable",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
                d._candidate_visa_uuid = visaUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "master_college_name", 'title': 'College/University', orderable: false, render: function (data, full, row) {
                    if (data != null) {
                        return data + ' ' + row.master_college_city + ', ' + row.master_college_state + ' - ' + row.college_program_name
                    }
                    return row.offer_letter_college_name + ' - ' + row.offer_letter_program_name;
                }
            },
            {"data": "candidate_fee_paid", 'title': 'Fee Paid (CAD)', orderable: false},
            {"data": "candidate_fee_date", 'title': 'Date of Payment', orderable: false},
            {"data": "fee_status_payment_method", 'title': 'Method of Payment', orderable: false},
            {"data": "candidate_fee_reciept_url", 'title': 'TT Confirmation', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.candidate_fee_reciept_original + ($.inArray(row.candidate_fee_reciept_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.candidate_fee_reciept_date : ""));
                }
            },
            {"data": "candidate_acknowledgement_url", 'title': 'Acknowledgement to College', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.candidate_acknowledgement_original + ($.inArray(row.candidate_acknowledgement_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.candidate_acknowledgement_date : ""));
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return (row.fee_status_is_locked == 'NO' ? ' <a onclick="updateFeeStatusRow(\'' + row.candidate_fee_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a>' : '') + ($.inArray(role, ['admin']) != -1 ? ' <a href="javascript:;" onclick="deleteFeeRow(\'' + row.candidate_fee_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
        rowCallback: function (tableRow, data) {
            if (data.fee_status_is_locked == 'YES') {
                $(tableRow).addClass('row-highlight');
                $(tableRow).find('td:first-child').addClass('locked');
            }
        }
    });
});
window.showAddFeeStatusModal = function (edit = 0) {
    listMyOfferLetters();
    $("#fee-status-modal").find('input:not(input[name=_token])').val('');
    $("#fee-status-modal").find('select').select2('val', null);
    $("#fee-status-modal").find('#view-fee_receipt').html('');
    $("#fee-status-modal").find('#view-fee_acknowledgement').html('');
    $("#fee-status-modal").modal('show');
}

$("#fee-status-form").find("#fee_receipt").on('change', function () {
    uploadFiles(this, 'view-fee_receipt', 'fee_receipt_file', 'candidate_fee_reciept_original');
});

$("#fee-status-form").find("#fee_acknowledgement").on('change', function () {
    uploadFiles(this, 'view-fee_acknowledgement', 'fee_acknowledgement_file', 'candidate_acknowledgement_original');
});

$("#fee-status-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        offer_letter: {
            required: true
        },
        fee_payment_method: {
            required: true
        },
        fee_paid: {
            required: true
        },
        date: {
            required: true
        }
    },
    messages: {
        offer_letter: {
            required: "College/University is required"
        },
        fee_payment_method: {
            required: "Method of payment is required"
        },
        fee_paid: {
            required: "Fee paid is required"
        },
        date: {
            required: "Date is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/fee-status/store', $("#fee-status-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_visa_uuid=' + visaUuid + '&fee_status=PAID')
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#fee-status-modal").modal('hide');
                        loadRequirementStatus('fee');
                        feeStatusDatatable.draw();
                        loadCompletionPercentage();
                        $(".fee-status-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Fee Status Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".fee-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".fee-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".fee-status-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});
window.listMyOfferLetters = function (selectedValue = null) {
    axios.get(baseUrl + '/v1/ajax/case-management/offer-letter/get-all?candidate-visa-uuid=' + visaUuid + '&status=APPROVED&locked=NO')
            .then(function (response) {
                var html = '<option></option>';
                $.each(response.data.data, function (i, v) {
                    console.log(v.candidate_offer_letter_uuid);
                    html += '<option ' + (selectedValue == v.candidate_offer_letter_uuid ? 'selected="selected"' : '') + ' value="' + v.candidate_offer_letter_uuid + '">' + (v.master_college_name != null ? (v.master_college_name + ', ' + v.master_college_city + ', ' + v.master_college_state) : v.offer_letter_college_name) + ' - ' + (v.college_program_name != null ? v.college_program_name : v.offer_letter_program_name) + '(' + (v.offer_letter_intake != null ? v.offer_letter_intake : v.offer_letter_college_intake) + ')' + '</option>';
                });
                $("#fee-status-modal").find("#offer_letter").html(html);
                $("#fee-status-modal").find("#offer_letter").select2();
//                $(window).unblock();
            })
            .catch(function (error) {
//                $(window).unblock();
            });
}

/**
 * delete gic-status row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteFeeRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/fee-status/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".fee-status-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    loadRequirementStatus('fee');
                                    feeStatusDatatable.draw();
                                    loadCompletionPercentage();
                                } else {
                                    $(".fee-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".fee-status-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".fee-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateFeeStatusRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/fee-status/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    listMyOfferLetters(response.data.data.candidate_offer_letter_uuid);
                    $("#fee-status-modal").find('#candidate_fee_uuid').val(response.data.data.candidate_fee_uuid);
                    $("#fee-status-modal").find('#fee_paid').val(response.data.data.candidate_fee_paid);
                    $("#fee-status-modal").find('#fee_payment_method').select2('val', response.data.data.fee_status_payment_method);
                    $("#fee-status-modal").find('#date').val(response.data.data.candidate_fee_date);
                    $("#fee-status-modal").find('#fee_receipt_file').val(response.data.data.candidate_fee_reciept);
                    $("#fee-status-modal").find('#candidate_fee_reciept_original').val(response.data.data.candidate_fee_reciept_original);
                    $("#fee-status-modal").find('#view-fee_receipt').html('');
                    if (response.data.data.candidate_fee_reciept != null && response.data.data.candidate_fee_reciept != 'undefined') {
                        $("#fee-status-modal").find('#view-fee_receipt').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.candidate_fee_reciept + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#fee-status-modal").find('#fee_acknowledgement_file').val(response.data.data.candidate_acknowledgement);
                    $("#fee-status-modal").find('#candidate_acknowledgement_original').val(response.data.data.candidate_acknowledgement_original);
                    $("#fee-status-modal").find('#view-fee_acknowledgement').html('');
                    if (response.data.data.candidate_acknowledgement != null && response.data.data.candidate_acknowledgement != 'undefined') {
                        $("#fee-status-modal").find('#view-fee_acknowledgement').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.candidate_acknowledgement + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#fee-status-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".fee-status-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".fee-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#fee-refund-button").on('click', function () {
    swal({
        title: "Make Refund?",
        text: "Are you refund the Fee?",
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
                        type: 'fee',
                        fee_refund_status: 'PENDING',
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