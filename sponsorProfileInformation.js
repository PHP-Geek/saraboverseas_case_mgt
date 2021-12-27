var axios = require('axios');
var swal = require('sweetalert');
var sponsorDatatable;
$(function () {
    sponsorDatatable = $('#sponsor-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/sponsor/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_visa_uuid = visaUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "visa_sponsor_name", 'title': 'Sponsor Name', orderable: false},
            {"data": "visa_sponsor_relationship_status", 'title': 'Relationship Status', orderable: false},
            {"data": "visa_sponsor_canada_status", 'title': 'Status in Canada', orderable: false, render: function (data, full, row) {
                    return data;
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateSponsorRow(\'' + row.candidate_visa_sponsor_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> <a href="javascript:;" onclick="deleteSponsorRow(\'' + row.candidate_visa_sponsor_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>';
                }
            }
        ],
    });
});

window.showAddSponsorModal = function () {
    $("#sponsor-modal").find('input:not(input[name=_token])').val('');
    $("#sponsor-modal").find('select').select2('val', null);
    $("#sponsor-modal").modal('show');
}

/**
 * delete sponsor row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteSponsorRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/sponsor/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".sponsor-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    sponsorDatatable.draw();
                                } else {
                                    $(".sponsor-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".sponsor-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".sponsor-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateSponsorRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/sponsor/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#sponsor-modal").find('#candidate_visa_sponsor_uuid').val(response.data.data.candidate_visa_sponsor_uuid);
                    $("#sponsor-modal").find('#sponsor_name').val(response.data.data.visa_sponsor_name);
                    $("#sponsor-modal").find('#relationship_status').val(response.data.data.visa_sponsor_relationship_status);
                    $("#sponsor-modal").find('#status_in_canada').select2('val', response.data.data.visa_sponsor_canada_status);
                    $("#sponsor-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".sponsor-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".sponsor-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#sponsor-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        sponsor_name: {
            required: true
        },
        relationship_status: {
            required: true
        },
        status_in_canada: {
            required: true
        }
    },
    messages: {
        sponsor_name: {
            required: "Sponsor name is required"
        },
        relationship_status: {
            required: "Relationship status is required"
        },
        status_in_canada: {
            required: "Status in canada is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/sponsor/store', $("#sponsor-form").serialize() + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#sponsor-modal").modal('hide');
                        $(".sponsor-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Sponsor Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        sponsorDatatable.draw();
                    } else {
                        $(".sponsor-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".sponsor-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".sponsor-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});