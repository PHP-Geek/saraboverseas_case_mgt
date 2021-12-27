var axios = require('axios');
var swal = require('sweetalert');

$(function () {
    $('select').select2();
});


$('#board').on('change', function () {
    if ($(this).val() == 'Other') {
        $("#education-modal-other-board-univ-div").removeClass('d-none');
    } else {
        $("#education-modal-other-board-univ-div").find('input[type=text]').val('');
        $("#education-modal-other-board-univ-div").addClass('d-none');
    }
});

$('#certification_name').on('change', function () {
    if ($(this).val() == 'Other') {
        $("#education-modal-other-certificate-div").removeClass('d-none');
    } else {
        $("#education-modal-other-certificate-div").find('input[type=text]').val('');
        $("#education-modal-other-certificate-div").addClass('d-none');
    }
});

$('#other_board').on('blur', function () {
    if ($(this).val() != "") {
        var options = $('#board option');
        var values = $.map(options, e => $(e).val());
        if ($.inArray($(this).val(), values) != '-1') {
            $('#other_board').val('');
            alert('This name already exist in dropdown');
        }
    }
});

$('#other_certification_name').on('blur', function () {
    if ($(this).val() != "") {
        var options = $('#certification_name option');
        var values = $.map(options, e => $(e).val());
        console.log(values);
        if ($.inArray($(this).val(), values) != '-1') {
            $('#other_certification_name').val('');
            alert('This name already exist in dropdown');
        }
    }
});


$("#add-candidate-education").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        degree_type: {
            required: true
        },
        other_board: {
            required: function () {
                return $('#board').val() == 'Other' ? true : false;
            }
        },
        other_certification_name: {
            required: function () {
                return $('#certification_name').val() == 'Other' ? true : false;
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
            required: "Please fill other certificate name"
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
        var html = '<tr>\n\
                                    <td><a href="javascript:;" class="text-danger" title="Remove" onclick="removeRow(this)"><i class="fa fa-trash"></i></a></td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#degree_type').val() + '" name="degree_type[]"/>' + $("#add-candidate-education").find('#degree_type').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#board').val() + '" name="board[]"/>' + $("#add-candidate-education").find('#board').val() + '\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#other_board').val() + '" name="other_board[]"/>' + ($("#add-candidate-education").find('#other_board').val() != "" ? '(' + $("#add-candidate-education").find('#other_board').val() + ')' : "") + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#year_from').val() + '" name="year_from[]"/>' + $("#add-candidate-education").find('#year_from').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#year_to').val() + '" name="year_to[]"/>' + $("#add-candidate-education").find('#year_to').val() + '\n\
                                    </td>';
        if ($('#grade_type1').is(':checked')) {
            html += '<input type="hidden" value="PERCENTAGE" name="grade_type[]"/>';
        } else {
            html += '<input type="hidden" value="CGPA" name="grade_type[]"/>';
        }
        html += '<td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#grade').val() + '" name="grade[]"/>' + $("#add-candidate-education").find('#grade').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#math').val() + '" name="math[]"/>' + $("#add-candidate-education").find('#math').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#english').val() + '" name="english[]"/>' + $("#add-candidate-education").find('#english').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#no_of_backlogs').val() + '" name="backlogs[]"/>' + $("#add-candidate-education").find('#no_of_backlogs').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#certification_name').val() + '" name="certification_name[]"/>' + $("#add-candidate-education").find('#certification_name').val() +
                '\n\
                                        <input type="hidden" value="' + $("#add-candidate-education").find('#other_certification_name').val() + '" name="other_certification_name[]"/>' + ($("#add-candidate-education").find('#other_certification_name').val() != "" ? '(' + $("#add-candidate-education").find('#other_certification_name').val() + ')' : "") + '\n\
                                    </td>\n\
                                </tr>';
        $("#store-candidate-education-view").append(html);
        if ($('#board').val() == 'Other') {
            $("#board").find('option[value=Other]').remove();
            var html = '<option value="' + $("#other_board").val() + '">' + $("#other_board").val() + '</option><option value="Other">Other</option>';
            $("#board").append(html);
        }
        $('#education-modal-other-board-univ-div').addClass('d-none');
        if ($('#certification_name').val() == 'Other') {
            $("#certification_name").find('option[value=Other]').remove();
            var html1 = '<option value="' + $("#other_certification_name").val() + '">' + $("#other_certification_name").val() + '</option><option value="Other">Other</option>';
            $("#certification_name").append(html1);
        }
        $('#education-modal-other-certificate-div').addClass('d-none');
        $("#other_board").val('');
        $("#other_certification_name").val('');
        $("#add-candidate-education").find('#no_of_backlogs').val('0');
        $("#add-candidate-education")[0].reset();
        $("#add-candidate-education").find('select').select2('val', null);
        return false;
    }
});

window.removeRow = function (that) {
    $(that).closest('tr').remove();
}

$("#next-button").on('click', function () {
    if ($("#store-candidate-education-view").find('input').length > 0) {
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa/candidate/education/store', $("#add-education-form").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#education-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        window.location.href = baseUrl + '/case-management/visa/' + type + '/add/experience/' + btoa(candidateVisaUuid);
                    } else {
                        $(".add-education-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#education-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".add-education-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".add-education-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    } else {
        $('html, body').animate({
            scrollTop: $("#education-add-view").offset().top
        }, 1500);
        $(".add-education-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please add one education detail.</span>' + alertClose() + '</div>');
    }
});

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}

window.setGradeDropDown = function (type) {
    switch (type) {
        case 'PERCENTAGE':
            $('#grade').attr('max', '100');
            $('#grade').attr('step', '0.01');
            $('#grade').attr('placeholder', 'Enter Percentage');
            break;
        case 'CGPA':
            $('#grade').attr('max', '10');
            $('#grade').attr('step', '0.1');
            $('#grade').attr('placeholder', 'Enter CGPA');
            break;
    }
}

$('#grade_type1').on('change', function () {
    setGradeDropDown('PERCENTAGE');
});
$('#grade_type2').on('change', function () {
    setGradeDropDown('CGPA');
});

$("#degree_type").on('change', function () {
    if ($(this).val() == 'High School' || $(this).val() == 'Senior Secondary') {
        $("#no_of_backlogs").val('NA');
        $("#no_of_backlogs").attr('readonly', true);
        $("#education-modal").find("#no_of_backlogs").removeAttr('min');
        $("#education-modal").find("#no_of_backlogs").removeAttr('max');
    } else {
        $("#no_of_backlogs").val('');
        $("#no_of_backlogs").removeAttr('readonly');
        $("#no_of_backlogs").attr('min', 0);
        $("#no_of_backlogs").attr('max', 15);
    }
});