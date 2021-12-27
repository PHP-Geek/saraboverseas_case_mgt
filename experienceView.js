var axios = require('axios');
var swal = require('sweetalert');
var experienceDatatable;
$(function () {
    $("#start_date,#end_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });

    $("#experience-modal").find("#no_experience_button").on('change', function () {
        if ($(this).is(':checked')) {
            $("#experience-modal").find("#experience-view-div").addClass('d-none');
        } else {
            $("#experience-modal").find("#experience-view-div").removeClass('d-none');
        }
    });

    experienceDatatable = $('#experience-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/experience/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "candidate_experience_profile", 'title': 'Profile', orderable: false},
            {"data": "candidate_experience_start", 'title': 'Duration', orderable: false, render: function (data, full, row) {
                    return data + ' - ' + ((row.candidate_experience_end != "" && row.candidate_experience_end != null) ? row.candidate_experience_end : 'Till Date');
                }
            },
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateExperienceRow(\'' + row.candidate_experience_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deleteExperienceRow(\'' + row.candidate_experience_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
    });
});

window.showAddExperienceModal = function () {
    $("#experience-modal").find('input:not(input[name=_token])').val('');
    $("#experience-modal").find("#no-experience-checkbox-div").removeClass('d-none');
//    $("#experience-modal").find("#no-experience-checkbox-div").find('input[type=checkbox]').attr('checked', false);
    $("#experience-modal").modal('show');
}

/**
 * delete experience row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteExperienceRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/experience/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".experience-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    experienceDatatable.draw();
                                    loadCompletionPercentage();
                                    loadRequirementStatus('experience');
                                } else {
                                    $(".experience-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".experience-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".experience-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateExperienceRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/experience/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#experience-modal").find("#no-experience-checkbox-div").addClass('d-none');
                    $("#experience-modal").find("#no_experience_button").removeAttr('checked');
                    $("#experience-modal").find("#no-experience-view-div").removeClass('d-none');
                    $("#experience-modal").find('#candidate_experience_uuid').val(response.data.data.candidate_experience_uuid);
                    $("#experience-modal").find('#profile').val(response.data.data.candidate_experience_profile);
                    $("#experience-modal").find('#start_date').val(response.data.data.candidate_experience_start);
                    $("#experience-modal").find('#end_date').val(response.data.data.candidate_experience_end);
                    $("#experience-modal").find("#no-experience-checkbox-div").addClass('d-none');
                    $("#experience-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".experience-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".experience-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#experience-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    rules: {
        profile: {
            required: function () {
                return $("#experience-modall").find("#no_experience_button").is(':checked') ? false : true;
            }
        },
        start_date: {
            required: function () {
                return $("#experience-modall").find("#no_experience_button").is(':checked') ? false : true;
            }
        }
    },
    messages: {
        profile: {
            required: "Profile is required"
        },
        start_date: {
            required: "Start date is required"
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
        if ($("#experience-modal").find("#no_experience_button").is(':checked')) {
            swal({
                title: "Are you sure?",
                text: "You selected no experience. Existing experience (if there) will be deleted for the candidate.",
                icon: "warning",
                buttons: true,
                dangerMode: false,
            })
                    .then((willConfirm) => {
                        if (willConfirm) {
                            updateExperienceData(1);
                        }
                    });

        } else {
            updateExperienceData(0);
        }
    }
});

window.updateExperienceData = function (status) {
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
    axios.post(baseUrl + '/v1/ajax/case-management/experience/store', $("#experience-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&no_experience_button=' + ($("#experience-modal").find("#no_experience_button").is(':checked') ? 'YES' : 'NO'))
            .then(function (response) {
                $(window).unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#experience-modal").modal('hide');
                    $(".experience-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Experience Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    experienceDatatable.draw();
                    loadRequirementStatus('experience');
                    loadCompletionPercentage();
                    if (status == 1) {
                        $("#no_experience_button_global").attr('checked', true);
                    } else {
                        $("#no_experience_button_global").removeAttr('checked');
                    }
                } else {
                    $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                }
            })
            .catch(function (error) {
                $(window).unblock();
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
            });
}

$("#no_experience_button_global").on('change', function () {
    var status;
    if ($(this).is(':checked')) {
        status = 1
        var message = "You selected no experience. Existing experience (if there) will be deleted for the candidate.";
    } else {
        status = 0
        var message = "Are you sure to want remove no experience?";
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
                    actionExperienceCheck(status);
                } else {
                    if (status == 0) {
                        $("#no_experience_button_global").prop('checked', true);
                    } else {
                        $("#no_experience_button_global").prop('checked', false);
                    }
                }
            });
});

window.actionExperienceCheck = function (status) {
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
                column: 'no_experience_status',
                value: ($("#no_experience_button_global").is(':checked')) ? 'YES' : 'NO'
            })
            .then(function (response) {
                $(window).unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#experience-modal").modal('hide');
                    if (status == 1) {
                        $("#experience-modal").find("#no_experience_button").attr('checked', true);
                        $("#experience-modal").find("#experience-view-div").addClass('d-none');
                    } else {
                        $("#experience-modal").find("#no_experience_button").removeAttr('checked');
                        $("#experience-modal").find("#experience-view-div").removeClass('d-none');
                    }
                    swal("", 'Experience Detail Updated Successfully', 'success');
                    experienceDatatable.draw();
                    loadRequirementStatus('experience');
                    loadCompletionPercentage();
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