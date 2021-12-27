var axios = require('axios');
var swal = require('sweetalert');
var educationDatatable;
$(function () {

    educationDatatable = $('#education-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/education/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "candidate_education_degree_type", 'title': 'Degree Type', orderable: false},
            {"data": "candidate_education_board", 'title': 'Board/University', orderable: false},
            {"data": "candidate_education_year_from", 'title': 'Year From', orderable: false},
            {"data": "candidate_education_year_to", 'title': 'Year To', orderable: false},
            {"data": "candidate_education_grade", 'title': '%/CGPA', orderable: false},
            {"data": "candidate_education_math", 'title': 'Math', orderable: false},
            {"data": "candidate_education_english", 'title': 'English', orderable: false},
            {"data": "candidate_education_backlogs", 'title': 'No. of Backlogs', orderable: false},
            {"data": "candidate_education_certification_name", 'title': 'Certification Name', orderable: false},
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateEducationRow(\'' + row.candidate_education_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deleteEducationRow(\'' + row.candidate_education_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>' : '');
                }
            }
        ],
    });
});
window.showAddEducationModal = function () {
    $("#education-modal").find('input:not(input[name=_token],#grade_type1,#grade_type2)').val('');
    $("#education-modal").find('#grade_type1').prop('checked', true);
    $("#education-modal").find('#no_of_backlogs').val('NA');
    $("#education-modal").find('#education-modal-other-board-univ-div').addClass('d-none');
    $("#education-modal").find('select').select2('val', null);
    $("#education-modal").modal('show');
}

$("#education-modal").find('#board').on('change', function () {
    if ($(this).val() == 'Other') {
        $("#education-modal").find("#education-modal-other-board-univ-div").removeClass('d-none');
    } else {
        $("#education-modal").find("#education-modal-other-board-univ-div").find('input[type=text]').val('');
        $("#education-modal").find("#education-modal-other-board-univ-div").addClass('d-none');
    }
});

$("#education-modal").find('#certification_name').on('change', function () {
    if ($(this).val() == 'Other') {
        $("#education-modal").find("#education-modal-other-certificate-div").removeClass('d-none');
    } else {
        $("#education-modal").find("#education-modal-other-certificate-div").find('input[type=text]').val('');
        $("#education-modal").find("#education-modal-other-certificate-div").addClass('d-none');
    }
});

$("#education-modal").find('#other_board').on('blur', function () {
    if ($(this).val() != "") {
        var options = $("#education-modal").find('#board option');
        var values = $.map(options, e => $(e).val())
        if ($.inArray($(this).val(), values) != '-1') {
            $("#education-modal").find('#other_board').val('');
            alert('This name already exist in dropdown');
        }
    }
});
$("#education-modal").find('#other_certification_name').on('blur', function () {
    if ($(this).val() != "") {
        var options = $("#education-modal").find('#certification_name option');
        var values = $.map(options, e => $(e).val())
        console.log(values);
        if ($.inArray($(this).val(), values) != '-1') {
            $("#education-modal").find('#other_certification_name').val('');
            alert('This name already exist in dropdown');
        }
    }
});

/**
 * delete education row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteEducationRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/education/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".education-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    educationDatatable.draw();
                                    loadRequirementStatus('education');
                                    loadCompletionPercentage();
                                } else {
                                    $(".education-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".education-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".education-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateEducationRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/education/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#education-modal").find('#board').select2('val', response.data.data.candidate_education_board);
                    $("#education-modal").find('#candidate_education_uuid').val(response.data.data.candidate_education_uuid);
                    $("#education-modal").find('#year_from').select2('val', response.data.data.candidate_education_year_from);
                    $("#education-modal").find('#year_to').select2('val', response.data.data.candidate_education_year_to);
                    $("#education-modal").find('#grade').val(response.data.data.candidate_education_grade);
                    $("#education-modal").find('#math').val(response.data.data.candidate_education_math);
                    $("#education-modal").find('#english').val(response.data.data.candidate_education_english);
                    $("#education-modal").find('#no_of_backlogs').val(response.data.data.candidate_education_backlogs);
                    $("#education-modal").find('#certification_name').select2('val', response.data.data.candidate_education_certification_name);
                    $("#education-modal").find('#stream').val(response.data.data.candidate_education_stream);
                    $("#education-modal").find('#degree_type').select2('val', response.data.data.candidate_education_degree_type);
                    if (response.data.data.candidate_education_grade_type == 'CGPA') {
                        $("#education-modal").find('#grade_type2').prop('checked', true);
                        $("#education-modal").find('#grade_type1').removeAttr('checked');
                    } else {
                        $("#education-modal").find('#grade_type1').prop('checked', true);
                        $("#education-modal").find('#grade_type2').removeAttr('checked');
                    }
                    setGradeDropDown(response.data.data.candidate_education_grade_type);
                    $("#education-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".education-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".education-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#education-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        degree_type: {
            required: true
        },
        other_board: {
            required: function () {
                return $("#education-form").find('#board').val() == 'Other' ? true : false;
            }
        },
        other_certification_name: {
            required: function () {
                return $("#education-form").find('#certification_name').val() == 'Other' ? true : false;
            }
        }
    },
    messages: {
        degree_type: {
            required: "Degree type is required"
        },
        other_board: {
            required: "Please fill other board/university"
        },
        other_certification_name: {
            required: "Please fill other certification name"
        }
//        year_to: {
//            greaterThan: "Year To must be less than Year From"
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
        axios.post(baseUrl + '/v1/ajax/case-management/education/add', $("#education-form").serialize() + '&candidate_detail_uuid=' + candidateUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#education-modal").modal('hide');
                        if ($("#education-modal").find('#board').val() == 'Other') {
                            $("#education-modal").find("#board").find('option[value=Other]').remove();
                            var html = '<option value="' + $("#education-modal").find("#other_board").val() + '">' + $("#education-modal").find("#other_board").val() + '</option><option value="Other">Other</option>';
                            $("#education-modal").find("#board").append(html);
                        }
                        $("#education-modal").find('#education-modal-other-board-univ-div').addClass('d-none');
                        if ($("#education-modal").find('#certification_name').val() == 'Other') {
                            $("#education-modal").find("#certification_name").find('option[value=Other]').remove();
                            var html1 = '<option value="' + $("#education-modal").find("#other_certification_name").val() + '">' + $("#education-modal").find("#other_certification_name").val() + '</option><option value="Other">Other</option>';
                            $("#education-modal").find("#certification_name").append(html1);
                        }
                        $("#education-modal").find('#education-modal-other-certificate-div').addClass('d-none');
                        $("#education-modal").find("#other_board").val('');
                        $("#education-modal").find("#other_certification_name").val('');
                        $(".education-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Education Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        educationDatatable.draw();
                        loadCompletionPercentage();
                        loadRequirementStatus('education');
                    } else {
                        $(".education-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".education-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".education-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});
$('#grade_type1').on('change', function () {
    setGradeDropDown('PERCENTAGE');
});
$('#grade_type2').on('change', function () {
    setGradeDropDown('CGPA');
});
window.setGradeDropDown = function (type) {
    switch (type) {
        case 'PERCENTAGE':
            $("#education-modal").find('#grade').attr('max', '100');
            $("#education-modal").find('#grade').attr('step', '0.01');
            $("#education-modal").find('#grade').attr('placeholder', 'Enter Percentage');
            break;
        case 'CGPA':
            $("#education-modal").find('#grade').attr('max', '10');
            $("#education-modal").find('#grade').attr('step', '0.1');
            $("#education-modal").find('#grade').attr('placeholder', 'Enter CGPA');
            break;
    }
}

$("#education-modal").find("#degree_type").on('change', function () {
    if ($(this).val() == 'High School' || $(this).val() == 'Senior Secondary') {
        $("#education-modal").find("#no_of_backlogs").val('NA');
        $("#education-modal").find("#no_of_backlogs").attr('readonly', true);
        $("#education-modal").find("#no_of_backlogs").removeAttr('min');
        $("#education-modal").find("#no_of_backlogs").removeAttr('max');
    } else {
        $("#education-modal").find("#no_of_backlogs").val('');
        $("#education-modal").find("#no_of_backlogs").removeAttr('readonly');
        $("#education-modal").find("#no_of_backlogs").attr('min', 1);
        $("#education-modal").find("#no_of_backlogs").attr('max', 15);
    }
});