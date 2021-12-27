var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';
var sponsorDocumentDatatable;

$("#sponsor-document-modal").find("#original_kept").on('change', function () {
    if ($(this).is(':checked')) {
        $("#sponsor-document-modal").find('#returned-date-div').removeClass('d-none');
    } else {
        $("#sponsor-document-modal").find('#returned-date-div').addClass('d-none');
    }
})

$(function () {
    $("#sponsor-document-modal").find("#document_received_date,#document_returned_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        maxDate: new Date()
    });
    sponsorDocumentDatatable = $('#sponsor-document-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/document/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
                d._reference_type = 'SPONSOR_DOCUMENTS';
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {data: null, title: "#ID", orderable: false, render: function (data, full, row, meta) {
                    return ((row.startNo) + 1) + (meta.row);
                }
            },
            {"data": "candidate_document_caption", 'title': 'Document Name', orderable: false},
            {"data": "candidate_document_attachment_url", 'title': 'Attachment', orderable: false, render: function (data, full, row) {
                    return showFileUrl(data, row.candidate_document_original_name);
                }
            },
            {"data": "candidate_document_original_kept", 'title': 'Original Kept', orderable: false},
            {"data": "candidate_document_received_date", 'title': 'Received Date', orderable: false},
            {"data": "candidate_document_return_date", 'title': 'Returned Date', orderable: false},
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateSponsorDocumentRow(\'' + row.candidate_document_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> <a href="javascript:;" onclick="deleteSponsorDocumentRow(\'' + row.candidate_document_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>';
                }
            }
        ],
    });
});


window.showAddSponsorDocumentModal = function () {
    var date = new Date();
    $("#sponsor-document-modal").find('input:not(input[name=_token])').val('');
    $("#sponsor-document-modal").find("#original_kept").prop('checked', false);
    $("#sponsor-document-modal").find("#document_received_date").val(date.getDate() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear());
    $("#sponsor-document-modal").find('#returned-date-div').addClass('d-none');
    $("#sponsor-document-modal").find('#view-candidate-document-attachment').html('');
    $("#sponsor-document-modal").find('select').select2('val', null);
    $("#sponsor-document-modal").modal('show');
}

/**
 * delete document row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteSponsorDocumentRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/document/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".document-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    sponsorDocumentDatatable.draw();
                                    loadCompletionPercentage();
                                } else {
                                    $(".document-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
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
            });
}

window.updateSponsorDocumentRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/document/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#sponsor-document-modal").find('#view-candidate-document-attachment').html('');
                    $("#sponsor-document-modal").find('#candidate_document_uuid').val(response.data.data.candidate_document_uuid);
                    $("#sponsor-document-modal").find('#document_name').val(response.data.data.candidate_document_caption);
                    $("#sponsor-document-modal").find('#document_attachment').val(response.data.data.candidate_document_file);
                    if (response.data.data.candidate_document_original_kept == 'YES') {
                        $("#sponsor-document-modal").find('#original_kept').attr('checked', true);
                        $("#sponsor-document-modal").find('#returned-date-div').removeClass('d-none');
                    }
                    if (response.data.data.candidate_document_file != null && response.data.data.candidate_document_file != 'undefined') {
                        $("#sponsor-document-modal").find('#view-candidate-document-attachment').html(showFileUrl(baseUrl + '/get-document?_doc_token=' + response.data.data.candidate_document_file, response.data.data.candidate_document_original_name));
                    }
                    $("#sponsor-document-modal").find('#document_received_date').val((response.data.data.candidate_document_received_date));
                    $("#sponsor-document-modal").find('#document_returned_date').val((response.data.data.candidate_document_return_date));
                    $("#sponsor-document-modal").modal('show');
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

$("#sponsor-document-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        document_name: {
            required: true,
//            alpha: true
        },
        document_attachment: {
            required: true
        },
        document_received_date: {
            required: true
        }
    },
    messages: {
        document_name: {
            required: "Document name is required",
//            alpha: "Document name must have valid characters"
        },
        document_attachment: {
            required: "Attachment is required"
        },
        document_received_date: {
            required: "Received date is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/document/store', $("#sponsor-document-form").serialize() + '&document_reference_type=SPONSOR_DOCUMENTS&original_kept=' + (($("#sponsor-document-form").find("#original_kept").is(':checked')) ? 'YES' : 'NO') + '&candidate_detail_uuid=' + candidateUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#sponsor-document-modal").modal('hide');
                        $(".document-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Document Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        sponsorDocumentDatatable.draw();
                        loadCompletionPercentage();
                    } else {
                        $(".sponsor-document-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".sponsor-document-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".sponsor-document-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});
$("#sponsor-document-modal").find("#document_upload_file").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        $("#sponsor-document-modal").find("#candidate_document_original_name").val(this.files[0].name);
        //check the file size
        var size = this.files[0].size;
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument1(mimeType, documentData, $("#sponsor-document-modal").find('#view-candidate-document-attachment'), $("#sponsor-document-modal").find('#document_attachment'), originalName);
        });
        FR.readAsDataURL(this.files[0]);
    }
});