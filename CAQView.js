var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';
var caqDatatable;
$(function () {
    $("#caq-modal").find("#caq_application_date,#caq_status_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    $("#caq-modal").find("#caq_expiry_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        minDate: new Date()
    });
    caqDatatable = $('#caq-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/caq/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_visa_uuid = visaUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "master_college_name", 'title': 'College', orderable: false},
            {"data": "college_program_name", 'title': 'Program', orderable: false},
            {"data": "candidate_caq_status", 'title': 'Status', orderable: false, render: function (data, row, full) {
                    switch (data) {
                        case 'APPLIED':
                            return '<span class="badge badge-info">Applied</span><br/>' + full.caq_applied_date;
                            break;
                        case 'DOC_REQUIRED':
                            return '<span class="badge badge-warning">Doc Required</span><br/>' + full.caq_doc_required_date;
                            break;
                        case 'APPROVED':
                            return '<span class="badge badge-success">Approved</span><br/>' + full.caq_approved_date;
                            break;
                        case 'REJECTED':
                            return '<span class="badge badge-danger">Rejected</span><br/>' + full.caq_rejected_date;
                            break;
                    }
                }
            },
            {"data": "caq_number", 'title': 'CAQ Number', orderable: false},
            {"data": "caq_login", 'title': 'CAQ Login', orderable: false},
            {"data": "caq_application_date", 'title': 'Date', orderable: false},
            {"data": "caq_expiry_date", 'title': 'CAQ Expiry Date', orderable: false},
            {"data": 'caq_letter', 'title': 'Attachment', orderable: false, render: function (data, full, row) {
                    return data != null ? showFileUrl(baseUrl + '/get-document?_doc_token=' + data, (row.caq_letter_original != null ? row.caq_letter_original : '') + ($.inArray(row.caq_letter_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.caq_letter_date : "")) : '';
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateCAQRow(\'' + btoa(row.candidate_caq_uuid) + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deleteCAQRow(\'' + btoa(row.candidate_caq_uuid) + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
    });
});
window.showAddCAQModal = function (edit = 0) {
    listMyOfferLettersOnly();
    $("#caq-modal").find('select,input:not(input[name=_token])').val('');
    $("#caq-modal").find('#caq_status').select2('val', null);
    $("#caq-modal").find('#view-caq_letter').html('');
    $("#caq-modal").find("#caq-letter-div").addClass('d-none');
    $("#caq-modal").modal('show');
}

$("#caq-form").find("#caq_letter").on('change', function () {
    uploadFiles(this, 'view-caq_letter', 'caq_letter_attachment', 'caq_letter_attachment_original');
});

$("#caq-modal").find("#caq_status").on('change', function () {
    $("#caq-modal").find("#caq_status_date").val('');
    if ($(this).val() == 'APPROVED') {
        $("#caq-modal").find("#caq-letter-div").removeClass('d-none');
    } else {
        $("#caq-modal").find("#caq-letter-div").addClass('d-none');
    }
});


window.updateCAQRow = function (id) {
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
    listMyOfferLettersOnly();
    axios.get(baseUrl + '/v1/ajax/case-management/caq/detail/' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#caq-modal").find('#view-caq_letter').html('');
                    $("#caq-modal").find("#caq-letter-div").addClass('d-none');
                    $("#caq-modal").find('#candidate_caq_uuid').val(response.data.data.candidate_caq_uuid);
                    $("#caq-modal").find('#offer_letter').select2('val', response.data.data.candidate_offer_letter_uuid);
                    $("#caq-modal").find('#caq_status').select2('val', response.data.data.candidate_caq_status);
                    switch (response.data.data.candidate_caq_status) {
                        case 'APPLIED':
                            $("#caq-modal").find('#caq_status_date').val(response.data.data.caq_applied_date);
                            break;
                        case 'DOC_REQUIRED':
                            $("#caq-modal").find('#caq_status_date').val(response.data.data.caq_doc_required_date);
                            break;
                        case 'APPROVED':
                            $("#caq-modal").find('#caq_status_date').val(response.data.data.caq_approved_date);
                            $("#caq-modal").find('#caq_letter_attachment').val(response.data.data.caq_letter);
                            if (response.data.data.caq_letter != null && response.data.data.caq_letter != 'undefined') {
                                $("#caq-modal").find('#view-caq_letter').html(showFileUrl(baseUrl + '/get-document?_doc_token=' + response.data.data.caq_letter, ''));
                            }
                            $("#caq-modal").find("#caq-letter-div").removeClass('d-none');
                            break;
                        case 'REJECTED':
                            $("#caq-modal").find('#caq_status_date').val(response.data.data.caq_rejected_date);
                            break;
                    }
                    $("#caq-modal").find('#caq_number').val((response.data.data.caq_number));
                    $("#caq-modal").find('#caq_login').val((response.data.data.caq_login));
                    $("#caq-modal").find('#caq_application_date').val((response.data.data.caq_application_date));
                    $("#caq-modal").find('#caq_expiry_date').val((response.data.data.caq_expiry_date));
                    $("#caq-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".document-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".document-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}


$("#caq-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        offer_letter: {
            required: true
        },
        caq_status: {
            required: true
        },
        caq_number: {
            required: true
        },
        caq_status_date: {
            required: true
        }
    },
    messages: {
        offer_letter: {
            required: "College/Program is required"
        },
        caq_number: {
            required: "CAQ Number is required"
        },
        caq_status_date: {
            required: "Date is required"
        },
        caq_status: {
            required: "Status is required"
        },
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
        axios.post(baseUrl + '/v1/ajax/case-management/caq/store', $("#caq-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#caq-modal").modal('hide');
                        caqDatatable.draw();
                        $(".caq-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">CAQ Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".caq-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".caq-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".caq-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});
window.listMyOfferLettersOnly = function () {
    axios.get(baseUrl + '/v1/ajax/case-management/offer-letter/get-all?candidate-visa-uuid=' + visaUuid + '&state=Quebec&status=APPROVED&locked=NO')
            .then(function (response) {
                var html = '<option></option>';
                $.each(response.data.data, function (i, v) {
                    console.log(v.candidate_offer_letter_uuid);
                    html += '<option ' + (CAQofferLetter == v.candidate_offer_letter_uuid ? 'selected="selected"' : '') + ' value="' + v.candidate_offer_letter_uuid + '">' + (v.master_college_name + ', ' + v.master_college_city + ' - ' + v.college_program_name + '(' + v.offer_letter_intake + ')') + '</option>';
                });
                $("#caq-modal").find("#offer_letter").html(html);
                $("#caq-modal").find("#offer_letter").select2('val', CAQofferLetter);
//                $(window).unblock();
            })
            .catch(function (error) {
//                $(window).unblock();
            });
}


/**
 * delete experience row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteCAQRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/caq/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".caq-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    caqDatatable.draw();
                                } else {
                                    $(".caq-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".caq-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".caq-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}