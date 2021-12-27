var axios = require('axios');
var swal = require('sweetalert');
var travelHistoryDatatable;
$(function () {


    $("#travel-history-modal").find("#no_travel_history_button").on('change', function () {
        if ($(this).is(':checked')) {
            $("#travel-history-modal").find("#travel-history-view-div").addClass('d-none');
        } else {
            $("#travel-history-modal").find("#travel-history-view-div").removeClass('d-none');
        }
    });

    $("#travel-history-modal").find("#country_visited").on('change', function () {
        if ($(this).val() == 'Other') {
            $("#travel-history-modal").find("#other_country_visited").closest('.form-group').removeClass('d-none');
        } else {
            $("#travel-history-modal").find("#other_country_visited").closest('.form-group').addClass('d-none');
        }
    });


    $("#grant_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    travelHistoryDatatable = $('#travel-history-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "language": {
            "emptyTable": "No Travel History"
        },
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/travel-history/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._travelled = 'YES';
                d._candidate_detail_uuid = candidateUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "country_visited", 'title': 'Country Visited', orderable: false, render: function (data, full, row) {
                    return data == 'Other' ? row.other_country_visited : data;
                }},
            {"data": "master_visa_type_name", 'title': 'Visa Type', orderable: false},
            {"data": "visa_grant_date", 'title': 'Date', orderable: false},
            {"data": "travel_history_comment", 'title': 'Special Remark', orderable: false},
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updatetravelHistoryRow(\'' + row.travel_history_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deletetravelHistoryRow(\'' + row.travel_history_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
    });
});
window.showAddtravelHistoryModal = function () {
    $("#travel-history-modal").find('textarea,input:not(input[name=_token])').val('');
    $('select').select2('val', null);
    $("#travel-history-modal").find("#other_country_visited").closest('.form-group').removeClass('d-none');
    $("#travel-history-modal").find("#no-travel-history-checkbox-div").removeClass('d-none');
    $("#travel-history-modal").modal('show');
}

/**
 * delete travelHistory row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deletetravelHistoryRow = function (uuid) {
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
                                    $(".travel-history-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    loadRequirementStatus('travel_history');
                                    travelHistoryDatatable.draw();
                                } else {
                                    $(".travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updatetravelHistoryRow = function (id) {
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
                    $("#travel-history-modal").find("#no-travel-history-checkbox-div").addClass('d-none');
                    $("#travel-history-modal").find("#no_travel_history_button").removeAttr('checked');
                    $("#travel-history-modal").find("#travel-history-view-div").removeClass('d-none');
                    $("#travel-history-modal").find('#travel_history_uuid').val(response.data.data.travel_history_uuid);
                    $("#travel-history-modal").find('#country_visited').select2('val', response.data.data.country_visited);
                    if (response.data.data.country_visited == 'Other') {
                        $("#travel-history-modal").find("#other_country_visited").closest('.form-group').removeClass('d-none');
                        $("#travel-history-modal").find("#other_country_visited").val(response.data.data.other_country_visited);
                    } else {
                        $("#travel-history-modal").find("#other_country_visited").closest('.form-group').addClass('d-none');
                        $("#travel-history-modal").find("#other_country_visited").val('');
                    }
                    $("#travel-history-modal").find('#travel_history_visa_type').select2('val', response.data.data.master_visa_type_uuid);
                    $("#travel-history-modal").find('#grant_date').val((response.data.data.visa_grant_date));
                    $("#travel-history-modal").find('#special_remark').val(response.data.data.travel_history_comment);
                    $("#travel-history-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".travelHistory-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".travelHistory-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$('select').change(function () {
    $("#travel-history-form").validate().element($(this));
});
$("#travel-history-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        country_visited: {
            required: function () {
                return $("#travel-history-modal").find("#no_travel_history_button").is(':checked') ? false : true;
            }
        },
        grant_date: {
            required: function () {
                return $("#travel-history-modal").find("#no_travel_history_button").is(':checked') ? false : true;
            }
        },
        visa_type: {
            required: function () {
                return $("#travel-history-modal").find("#no_travel_history_button").is(':checked') ? false : true;
            }
        },
        other_country_visited: {
            required: function () {
                return $("#travel-history-modal").find("#country_visited").val() == 'Other' ? true : false;
            }
        }
    },
    messages: {
        country_visited: {
            required: "Please select country"
        },
        grant_date: {
            required: "Date is required"
        },
        visa_type: {
            required: "Visa type is required"
        },
        other_country_visited: {
            required: "Please enter country name"
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
        if ($("#travel-history-modal").find("#no_travel_history_button").is(':checked')) {
            swal({
                title: "Are you sure?",
                text: "You selected no travel history. Existing travel histories (if there) will be deleted for the candidate.",
                icon: "warning",
                buttons: true,
                dangerMode: false,
            })
                    .then((willConfirm) => {
                        if (willConfirm) {
                            updateTravelHistoryData(1);
                        }
                    });
        } else {
            updateTravelHistoryData(0);
        }
    }
});

window.updateTravelHistoryData = function (status) {
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
    axios.post(baseUrl + '/v1/ajax/case-management/travel-history/store', $("#travel-history-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_travelled=YES&travel_history_status=APPROVED&no_travel_history_button=' + ($("#travel-history-modal").find("#no_travel_history_button").is(':checked') ? 'YES' : 'NO'))
            .then(function (response) {
                $(window).unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#travel-history-modal").modal('hide');
                    $(".travel-history-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Travel History Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    loadRequirementStatus('travel_history');
                    travelHistoryDatatable.draw();
                    if (status == 1) {
                        $("#no_travel_button_global").attr('checked', true);
                    } else {
                        $("#no_travel_button_global").removeAttr('checked');
                    }
                } else {
                    $(".travel-history-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                }
            })
            .catch(function (error) {
                $(window).unblock();
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".travel-history-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".travel-history-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
            });
}


$("#no_travel_button_global").on('change', function () {
    var status;
    if ($(this).is(':checked')) {
        status = 1
        var message = "You selected no travel history. Existing travel history (if there) will be deleted for the candidate.";
    } else {
        status = 0
        var message = "Are you sure to want remove no travel history?";
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
                    actionTravelCheck(status);
                } else {
                    if (status == 0) {
                        $(this).prop('checked', true);
                    } else {
                        $(this).prop('checked', false);
                    }
                }
            });
});
window.actionTravelCheck = function (status) {
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
                column: 'no_travel_history_status',
                value: ($("#no_travel_button_global").is(':checked')) ? 'YES' : 'NO'
            })
            .then(function (response) {
                $(window).unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    loadRequirementStatus('travel_history');
                    if (status == 1) {
                        $("#travel-history-modal").find("#no_travel_history_button").attr('checked', true);
                        $("#travel-history-modal").find("#travel-history-view-div").addClass('d-none');
                    } else {
                        $("#travel-history-modal").find("#no_travel_history_button").removeAttr('checked');
                        $("#travel-history-modal").find("#travel-history-view-div").removeClass('d-none');
                    }
                    swal("", 'Travel History Detail Updated Successfully', 'success');
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