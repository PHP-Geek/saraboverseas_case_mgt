var axios = require('axios');
var swal = require('sweetalert');

$(function () {
    $("#start_date,#end_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 25,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
});

$("#add-candidate-experience").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        experience_profile: {
            required: true
        },
        start_date: {
            required: true,
        }
    },
    messages: {
        experience_profile: {
            required: "Profile/Experience is required"
        },
        start_date: {
            required: "Start Date is required",
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
                                        <input type="hidden" value="' + $("#add-candidate-experience").find('#experience_profile').val() + '" name="experience_profile[]"/>' + $("#add-candidate-experience").find('#experience_profile').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-experience").find('#start_date').val() + '" name="start_date[]"/>' + $("#add-candidate-experience").find('#start_date').val() + '\n\
                                    </td>\n\
                                    <td>\n\
                                        <input type="hidden" value="' + $("#add-candidate-experience").find('#end_date').val() + '" name="end_date[]"/>' + $("#add-candidate-experience").find('#end_date').val() + '\n\
                                    </td>\n\
                                </tr>';
        $("#store-candidate-experience-view").append(html);
        $("#add-candidate-experience")[0].reset();
        return false;
    }
});

window.removeRow = function (that) {
    $(that).closest('tr').remove();
}

$("#next-button").on('click', function () {
    if ($("#store-candidate-experience-view").find('input').length > 0) {
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa/candidate/experience/store', $("#add-experience-form").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#experience-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        if (type == 'spouse') {
                            window.location.href = baseUrl + '/case-management/visa/' + type + '/add/document/' + btoa(candidateVisaUuid);
                        } else {
                            window.location.href = baseUrl + '/case-management/visa/' + type + '/add/ielts-score/' + btoa(candidateVisaUuid);
                        }
                    } else {
                        $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#experience-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    } else {
        $('html, body').animate({
            scrollTop: $("#experience-add-view").offset().top
        }, 1500);
        $(".experience-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please add one experience detail.</span>' + alertClose() + '</div>');
    }
});

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}
