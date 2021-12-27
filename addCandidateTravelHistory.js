var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';

$(function () {
    $("#visa_grant_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 25,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
});

$('select').select2();

$("#travel-history-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        country_visited: {
            required: true
        },
        visa_grant_date: {
            required: true
        },
        visa_type: {
            required: true
        }
    },
    messages: {
        country_visited: {
            required: "Returned from is required"
        },
        visa_grant_date: {
            required: "Date is required"
        },
        visa_type: {
            required: "Visa type is required"
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
<td><input type="hidden" value="' + $("#travel-history-form").find("#country_visited").val() + '" name="country_visited[]"/>' + $("#travel-history-form").find("#country_visited").val() + '</td>\n\
<td><input type="hidden" value="' + $("#travel-history-form").find("#visa_grant_date").val() + '" name="grant_date[]"/>' + $("#travel-history-form").find("#visa_grant_date").val() + '</td>\n\
<td><input type="hidden" value="' + $("#travel-history-form").find("#travel_history_visa_type").val() + '" name="visa_type[]"/>' + $("#travel-history-form").find("#travel_history_visa_type").find('option:selected').text() + '</td>\n\
<td><input type="hidden" value="' + $("#travel-history-form").find("#special_remark").val() + '" name="special_remark[]"/>' + $("#travel-history-form").find("#special_remark").val() + '</td>\n\
                                        </tr>';
        $("#store-candidate-travel-history-view").append(html);
        $("#travel-history-form")[0].reset();
        $("#travel-history-form").find('select').select2('val', null);
        $("#travel-history-form").find("#view-candidate-document-attachment").html('');
        return false;
    }
});

window.removeRow = function (that) {
    $(that).closest('tr').remove();
}

$("#next-button").on('click', function () {
    if ($("#store-candidate-travel-history-view").find('input').length > 0) {
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa/candidate/travel-history/store', $("#add-candidate-travel-history-form").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#travel-history-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        window.location.href = baseUrl + '/case-management/visa/' + type + '/add/visa-refusal/' + btoa(candidateVisaUuid);
                    } else {
                        $(".add-candidate-travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#travel-history-add-view").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".add-candidate-travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".add-candidate-travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    } else {
        $('html, body').animate({
            scrollTop: $("#travel-history-add-view").offset().top
        }, 1500);
        $(".add-candidate-travel-history-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Please add one travel history detail.</span>' + alertClose() + '</div>');
    }
});

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}

