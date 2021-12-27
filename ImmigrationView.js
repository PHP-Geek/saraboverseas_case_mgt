var axios = require('axios');
var swal = require('sweetalert');
var immigrationStatusDatatable;
$(function () {

    $("#immigration_date_received,#immigration_date_responded").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date(),
    });

    immigrationStatusDatatable = $('#immigration-status-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/immigration/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._travelled = 'NO';
                d._candidate_visa_uuid = visaUuid;
                d._candidate_detail_uuid = candidateUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "immgration_status_date_received", 'title': 'Date Received', orderable: false},
            {"data": "immigration_status_type", 'title': 'Type', orderable: false},
            {"data": "immigration_status_date_responded", 'title': 'Date Responded', orderable: false},
            {"data": "immigration_status_doc_url", orderable: false, 'title': 'Doc', render: function (data, full, row) {
                    return showFileUrl(data, row.immigration_status_doc_original + ($.inArray(row.immigration_status_doc_date, [null, "", 'undefined']) == -1 ? ", uploaded : " + row.immigration_status_doc_date : ""));
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateimmigrationStatusRow(\'' + row.immigration_status_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> <a href="javascript:;" onclick="deleteimmigrationStatusRow(\'' + row.immigration_status_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>';
                }
            }
        ],
    });
});

window.showAddImmigrationStatusModal = function () {
    $("#immigration-status-modal").find('textarea,input:not(input[name=_token])').val('');
    $("#immigration-status-modal").find('#view-visa_refusal_attachment').html('');
    $('select').select2('val', null);
    $("#immigration-status-modal").modal('show');
}

/**
 * delete immigrationStatus row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteimmigrationStatusRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/immigration/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".immigration-status-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    immigrationStatusDatatable.draw();
                                    loadCompletionPercentage();
                                } else {
                                    $(".immigration-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".immigration-status-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".immigration-status-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateimmigrationStatusRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/immigration/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#immigration-status-modal").find('#view-immigration_status_doc').html('');
                    $("#immigration-status-modal").find('#immigration_status_uuid').val(response.data.data.immigration_status_uuid);
                    $("#immigration-status-modal").find('#immigration_date_received').val(response.data.data.immgration_status_date_received);
                    $("#immigration-status-modal").find('#immigration_date_responded').val(response.data.data.immigration_status_date_responded);
                    $("#immigration-status-modal").find('#immigration_status_type').val(response.data.data.immigration_status_type);
                    $("#immigration-status-modal").find('#immigration_status_doc').val(response.data.data.immigration_status_doc);
                    $("#immigration-status-modal").find('#immigration_status_doc_original').val(response.data.data.immigration_status_doc_original);
                    if (response.data.data.immigration_status_doc != null && response.data.data.immigration_status_doc != 'undefined') {
                        $("#immigration-status-modal").find('#view-immigration_status_doc').html('<a target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + response.data.data.immigration_status_doc + '"><img src="' + baseUrl + '/img/document.png"/></a>');
                    }
                    $("#immigration-status-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".immigrationStatus-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".immigrationStatus-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#immigration-status-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        immigration_date_received: {
            required: true
        },
        immigration_status_type: {
            required: true
        }
    },
    messages: {
        immigration_date_received: {
            required: "Date received is required"
        },
        immigration_status_type: {
            required: "Type is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/immigration/store', $("#immigration-status-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#immigration-status-modal").modal('hide');
                        $(".immigration-status-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Immigration Status Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        immigrationStatusDatatable.draw();
                        loadCompletionPercentage();
                    } else {
                        $(".immigration-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".immigration-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".immigration-status-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

/**
 * on change on the file control
 */
$("#immigration_status_doc-file").on('change', function () {
    if (this.files && this.files[0]) {

        var FR = new FileReader();
        var mimeType = this.files[0].type;
        var originalName = this.files[0].name;
        $("#immigration_status_doc_original").val(this.files[0].name);
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = this.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(this).val('');
            $("#immigration_status_doc_original").val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        FR.addEventListener("load", function (e) {
            var documentData = e.target.result;
            addMasterDocument(mimeType, documentData, 'view-immigration_status_doc', 'immigration_status_doc', originalName);
        });

        FR.readAsDataURL(this.files[0]);
    }
});