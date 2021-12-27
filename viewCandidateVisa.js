var axios = require('axios');
window.camelize = function (str) {
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
            function (s) {
                return s.toUpperCase();
            });
}

window.loadCompletionPercentage = function () {
    $("#completion-percentage").block({
        'message': '<i class="fa fa-sync-alt fa-pulse fa-2x fa-fw"></i>',
        'css': {
            border: '0',
            padding: '0',
            backgroundColor: 'none',
            marginTop: '2%',
            zIndex: '10600'
        },
        overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
    });
    axios.get(baseUrl + '/v1/ajax/case-management/completion-percentage/' + btoa(visaUuid))
            .then(function (response) {
                $("#completion-percentage").unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    var percentage = parseInt(response.data.data.percentage);
                    var cssClass = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
                    if (percentage < 20) {
                        cssClass = 'progress-bar progress-bar-striped progress-bar-animated bg-danger';
                    } else if (percentage < 40) {
                        cssClass = 'progress-bar progress-bar-striped progress-bar-animated bg-warning';
                    } else if (percentage < 60) {
                        cssClass = 'progress-bar progress-bar-striped progress-bar-animated bg-info';
                    } else if (percentage < 80) {
                        cssClass = 'progress-bar progress-bar-striped progress-bar-animated bg-primary';
                    } else {
                        cssClass = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
                    }
                    $("#completion-percentage").removeAttr('class');
                    $("#completion-percentage").attr('class', cssClass);
                    $("#completion-percentage").css({width: (response.data.data.percentage) + '%'});
                    $("#completion-percentage").html(response.data.data.percentage + '%');
                    setProfileCompletion(response.data.data.completion_info);
//                    alert(response.data.data);
                }
            })
            .catch(function (error) {
                $("#completion-percentage").unblock();
            });
}

window.setProfileCompletion = function (data) {
    $.each(data, function (i, v) {
        $(".progress-bar-items").find("#" + v).find('i').removeAttr('class');
        $(".progress-bar-items").find("#" + v).find('i').attr('class', 'text-success fa fa-check-circle');
    });
    $(".progress-bar-items").removeClass('d-none');
}


window.loadRequirementStatus = function (type = null) {
    $("#headingTwo").block({
        'message': '<i class="fas fa-circle-notch fa-spin"></i>',
        'css': {
            border: '0',
            padding: '0',
            backgroundColor: 'none',
            marginTop: '1%',
            zIndex: '10600'
        },
        overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
    });
    axios.post(baseUrl + '/v1/ajax/case-management/requirement-statuses',
            {
                uuid: btoa(visaUuid),
                type: type
            })
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    console.log(response.data.data);
                    $("#headingTwo").unblock();
                    if ('statuses' in response.data.data) {
                        if ('education' in response.data.data.statuses) {
                            setRequirementStatus('education-status', response.data.data.statuses.education);
                        }
                        if ('experience' in response.data.data.statuses) {
                            setRequirementStatus('experience-status', response.data.data.statuses.experience);
                        }
                        if ('ielts' in response.data.data.statuses) {
                            setRequirementStatus('ielts-status', response.data.data.statuses.ielts);
                        }
                        if ('passport' in response.data.data.statuses) {
                            setRequirementStatus('passport-status', response.data.data.statuses.passport);
                        }
                        if ('document' in response.data.data.statuses) {
                            setRequirementStatus('document-status', response.data.data.statuses.document);
                        }
                        if ('sponsor_document' in response.data.data.statuses) {
                            setRequirementStatus('sponsor-document-status', response.data.data.statuses.sponsor_document);
                        }
                        if ('offer_letter' in response.data.data.statuses) {
                            setRequirementStatus('offer-letter', response.data.data.statuses.offer_letter, 'yes');
                        }
                        if ('gic' in response.data.data.statuses) {
                            setRequirementStatus('gic-status-status', response.data.data.statuses.gic);
                        }
                        if ('medical' in response.data.data.statuses) {
                            setRequirementStatus('medical-status', response.data.data.statuses.medical);
                        }
                        if ('fee' in response.data.data.statuses) {
                            setRequirementStatus('fee-status', response.data.data.statuses.fee);
                        }
                        if ('visa_forms' in response.data.data.statuses) {
                            setRequirementStatus('visa-form-status', response.data.data.statuses.visa_forms);
                        }
                        if ('visa_status' in response.data.data.statuses) {
                            setRequirementStatus('visa-statuses-status', response.data.data.statuses.visa_status);
                        }
                        if ('travel_history' in response.data.data.statuses) {
                            setRequirementStatus('travel_history-status', response.data.data.statuses.travel_history);
                        }
                        if ('visa_refusal' in response.data.data.statuses) {
                            setRequirementStatus('visa_refusal-status', response.data.data.statuses.visa_refusal);
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
                $("#headingTwo").unblock();
            });
}

/**
 * set requirement status
 * @param {type} id
 * @param {type} value
 * @returns {undefined}
 */
window.setRequirementStatus = function (id, value, multi = 'no') {
    console.log(value);
    if (multi == 'yes') {
        $("." + id).html('0');
        if (value.status == 'COMPLETED') {
            $.each(value.message, function (i, v) {
                $("#" + id + "-" + i).html(v);
            });
        }
    } else {
        switch (value.status) {
            case 'COMPLETED':
                $("#" + id).html('<i class="fa fa-check-circle"></i> ' + value.message + '</span>');
                $("#" + id).removeAttr('class');
                $("#" + id).attr('class', 'text-success');
                break;
            case 'PRIMARY':
                $("#" + id).html('<i class="fas fa-hourglass"></i> ' + value.message + '</span>');
                $("#" + id).removeAttr('class');
                $("#" + id).attr('class', 'text-primary');
                break;
            case 'PENDING':
                $("#" + id).html('<i class="fa fa-exclamation-triangle"></i> ' + value.message + '</span>');
                $("#" + id).removeAttr('class');
                $("#" + id).attr('class', 'text-danger');
                break;
        }
}
}

$(function () {
    loadRequirementStatus();
    loadCompletionPercentage();
    $('input[type=file]:not(#upload-profile-image)').attr('accept', '.png,.jpg,.pdf,.doc,.jpeg');
    loadVisaType();
    $("#candidate-dob").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    var basic = $('#show-p-image').croppie({
        viewport: {width: 150, height: 200},
        boundary: {width: 400, height: 400},
//        url: baseUrl + '/img/default.png'
    });
    basic.croppie('setZoom', 0.1);
    var master_document_mime = '';
    $("#upload-profile-image").on('change', function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var mimeType = this.files[0].type;
            if ($.inArray(mimeType, ['image/jpeg', 'image/png']) == -1) {
                $(this).val('');
                alert("Please upload a valid image file. Must be jpg or png image.");
                return false;
            }
            master_document_mime = mimeType;
            //check the file size
            var size = this.files[0].size;
            if (size > 4 * 1024 * 1024) {
                $(this).val('');
                alert("File must not be greater than 4 MB");
                return false;
            }
            reader.onload = function (e) {
                $('#show-p-image').croppie('bind', {
                    url: e.target.result
                }).then(function () {
                    $('.cr-slider').attr({'min': 0.2000, 'max': 2.0000});
                });
            }
        }
        reader.readAsDataURL(this.files[0]);
        $("#update-profile-image-modal").modal('show');
    });
    $("#upload-profile-image-button").on('click', function () {
        basic.croppie('result').then(function (result) {
            console.log(result);
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
            axios.post(baseUrl + '/v1/ajax/case-management/change-candidate-image',
                    {
                        master_document_data: result,
                        master_document_mime: master_document_mime,
                        candidate_detail_uuid: candidateUuid
                    })
                    .then(function (response) {
                        if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                            $(".response-message").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Updated</span>' + alertClose() + '</div>');
                            $("#candidate-profile-image").attr('src', response.data.data.document_url);
                            $("#update-profile-image-modal").modal('hide');
                        } else {
                            $(".update-candidate-photo-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                        }
                        $(window).unblock();
                    })
                    .catch(function (error) {
                        if ((error.response.data).hasOwnProperty('message')) {
                            $(".update-candidate-photo-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                        } else {
                            $(".update-candidate-photo-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                        }
                        $(window).unblock();
                    });
        });
    });
});

window.changeCaseType = function (that) {
    swal({
        title: "Are you sure?",
        text: "Are you sure change the case?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.post(baseUrl + '/v1/ajax/case-management/change-case-type',
                            {
                                case_type: $(that).data('value'),
                                candidate_visa_uuid: visaUuid
                            })
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".response-message").html('<div class="alert alert-success justify-content-between">Case Converted Successfully</span>' + alertClose() + '</div>');
                                    $(that).remove();
                                    setTimeout(function () {
                                        if ($(that).data('value') == 'DROPPED') {
                                            window.location.href = baseUrl + '/case-management/dropped';
                                        } else {
                                            window.location.href = baseUrl + '/case-management/list/' + type + '?case=' + $(that).data('value');
                                        }
                                    }, 3000);
                                } else {
                                    $(".response-message").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".response-message").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });

}


$("#special_remark_check").on('change', function () {
    if ($(this).is(':checked')) {
        $("#travel_history_remark").show();
    } else {
        $("#travel_history_remark").hide();
    }
});
window.editColumn = function (id) {
    $("#" + id).find('.rec-edit').show();
    $("#" + id).find('.rec-view').hide();
    $("#" + id).find('.rec-btn-submit').show();
    $("#" + id).find('.rec-btn-edit').css({display: 'none'});
}

window.submitColumn = function (id, type) {
    if (type == 'true') {
        $("#" + id).find('.rec-edit').hide();
        $("#" + id).find('.rec-view').show();
        $("#" + id).find('.rec-btn-submit').hide();
        $("#" + id).find('.rec-btn-edit').show();
    } else {
        var validation = validateColumn(id);
        if (validation == false) {
            return false;
        }
        updateColumnValue(id);
    }
}

window.validateColumn = function (column) {
    $("#" + column).find(".rec-edit").find('.error-msg').remove();
    switch (column) {
        case 'passport-col':
            var regex = new RegExp("^[a-zA-Z0-9]+$");
            var str = $("#passport-col").find(".rec-edit").find('.col-value').val();
            if (!regex.test(str)) {
                $("#passport-col").find(".rec-edit").append('<span class="text-danger error-msg">Passport no must be only alphanumeric characters.</span>');
                return false;
            }
            if (str.length > 8) {
                $("#passport-col").find(".rec-edit").append('<span class="text-danger error-msg">Passport must not exceed 8 characters.</span>');
                return false;
            }
            break;
    }
    return true;
}

/**
 * update the column value
 * @param {type} column
 * @param {type} value
 * @returns {undefined}
 */
window.updateColumnValue = function (id) {
    var value = [];
    $("#" + id).find(".rec-edit").find('.col-value:not(.select2-container)').each(function (i, v) {
        value.push($(v).val());
    });
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
    axios.post(baseUrl + '/v1/ajax/case-management/update-user-column-value',
            {
                user_information_uuid: userUuid,
                candidate_detail_uuid: candidateUuid,
                column: id,
                value: value
            })
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $(".response-message").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Updated</span>' + alertClose() + '</div>');
                    if (id == 'medical-date-col') {
                        if (typeof (response.data.data)[0] === 'undefined') {

                        } else {
                            $("#" + id).find('.rec-view').html((response.data.data)[0]);
                        }
                        if (typeof (response.data.data)[1] === 'undefined') {

                        } else {
                            $("#medical-expiry-date-col").find('.rec-view').html((response.data.data)[1]);
                        }
                    } else if (id == 'passport-col') {
                        $("#" + id).find('.rec-view').html(response.data.data);
                        $("#passport-view-p").html(response.data.data);
                    } else {
                        $("#" + id).find('.rec-view').html(response.data.data);
                    }
                    $("#" + id).find('.rec-edit').hide();
                    $("#" + id).find('.rec-view').show();
                    $("#" + id).find('.rec-btn-submit').hide();
                    $("#" + id).find('.rec-btn-edit').show();
                    $("#" + id).find('input[type=file]').val('');
                    $("#" + id).find('.view-rec-file').html('');
//                    $("#" + id).find('input[type=hidden]').val('');
                    if ($.inArray(id, ['passport-col', 'passport-expiry-col', 'passport-attachment-col']) != -1) {
                        loadRequirementStatus('passport');
                    } else if ($.inArray(id, ['medical-status-col', 'medical-status-attachment', 'medical-date-col']) != -1) {
                        loadRequirementStatus('medical');
                    }
                    loadCompletionPercentage();
                } else {
                    $(".response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".response-message").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}


window.loadVisaType = function () {
    $("#travel-history-visa-type-div").block({
        'message': '<i class="fa fa-sync-alt fa-pulse fa-2x fa-fw"></i>',
        'css': {
            border: '0',
            padding: '0',
            backgroundColor: 'none',
            marginTop: '2%',
            zIndex: '10600'
        },
        overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
    });
    axios.get(baseUrl + '/v1/ajax/visa-type/list')
            .then(function (response) {
                $("#travel-history-visa-type-div").unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    var html = '<option value="" disabled="disabled" selected>Select Visa Type</option>';
                    $.each(response.data.data, function (i, v) {
                        html += '<option value="' + (v.master_visa_type_uuid) + '">' + (v.master_visa_type_name) + '</option>';
                    });
                    $("#travel_history_visa_type").html(html);
                    $("#visa_refusal_visa_type").html(html);
                }
            })
            .catch(function (error) {
                $("#travel-history-visa-type-div").unblock();
            });
}

window.showFileUrl = function (data, title = '') {
    if (data != null && data != 'undefined') {
        return '<a title="' + title + '" target="_blank" href="' + data + '"><img  style="margin-top:5px" src="' + baseUrl + '/img/document.png"/></a>';
    }
    return '';
}

var visaFamilyDatatable = $('#visa-family-datatable').DataTable({
    "processing": true,
    searching: false,
    lengthChange: false,
    "serverSide": true,
    "ajax": {
        "url": baseUrl + "/v1/ajax/case-management/family-mapping/datatable",
        "type": "POST",
        'data': function (d) {
            d._token = $('meta[name="csrf-token"]').attr('content');
            d._candidate_visa_uuid = visaUuid;
        }
    },
    "columns": [
        {"data": "visa_family_name", 'title': 'Name'},
        {"data": "visa_family_email", 'title': 'Email'},
        {"data": "visa_family_dob", 'title': 'DOB'},
        {"data": "visa_family_passport_no", 'title': 'Passport No'},
        {"data": "visa_family_passport_expiry", 'title': 'Passport Expiry'},
        {"data": "visa_family_relation", 'title': 'Relation'},
        {"data": null, 'title': 'Action', render: function (data, full, row) {
                return ' <a onclick="updatevisaFamilyRow(\'' + row.visa_family_mapping_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> <a href="javascript:;" onclick="deletevisaFamilyRow(\'' + row.visa_family_mapping_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>';
            }
        }
    ],
});

$("#visa-family-modal").find("#dob").datetimepicker({
    autoClose: true,
    scrollInput: false,
    format: 'd/m/Y',
    timepicker: false,
    yearStart: (new Date()).getFullYear() - 50,
    yearEnd: (new Date()).getFullYear(),
    maxDate: new Date()
});
$("#visa-family-modal").find("#passport_expiry_date").datetimepicker({
    autoClose: true,
    scrollInput: false,
    format: 'd/m/Y',
    timepicker: false,
    yearStart: (new Date()).getFullYear(),
    yearEnd: (new Date()).getFullYear() + 50,
    minDate: new Date()
});

window.showAddVisaFamilyModal = function () {
    $("#visa-family-modal").find('textarea,input:not(input[name=_token])').val('');
    $("#visa-family-modal").modal('show');
}


$("#visa-family-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        name: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        dob: {
            required: true
        },
        passport_no: {
            required: true
        },
        passport_expiry_date: {
            required: true
        }
    },
    messages: {
        name: {
            required: "Name is required"
        },
        email: {
            required: "Email is required",
            email: "Email must be valid"
        },
        dob: {
            required: "Date of birth is required"
        },
        passport_no: {
            required: "Passport no is required"
        },
        passport_expiry_date: {
            required: "Passport expiry date is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/family-mapping/store', $("#visa-family-form").serialize() + '&candidate_detail_uuid=' + candidateUuid + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#visa-family-modal").modal('hide');
                        $(".visa-family-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Member Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        visaFamilyDatatable.draw();
                    } else {
                        $(".visa-family-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".visa-family-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".visa-family-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});


/**
 * delete visaFamily row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deletevisaFamilyRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/family-mapping/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".visa-family-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    visaFamilyDatatable.draw();
                                } else {
                                    $(".visa-family-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".visa-family-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".visa-family-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updatevisaFamilyRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/family-mapping/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#visa-family-modal").find('#visa_family_mapping_uuid').val(response.data.data.visa_family_mapping_uuid);
                    $("#visa-family-modal").find('#name').val(response.data.data.visa_family_name);
                    $("#visa-family-modal").find('#mobile').val(response.data.data.visa_family_mobile);
                    $("#visa-family-modal").find('#email').val(response.data.data.visa_family_email);
                    $("#visa-family-modal").find('#passport_no').val(response.data.data.visa_family_passport_no);
                    $("#visa-family-modal").find('#passport_expiry_date').val(response.data.data.visa_family_passport_expiry);
                    $("#visa-family-modal").find('#dob').val(response.data.data.visa_family_dob);
                    $("#visa-family-modal").find('#relation').val(response.data.data.visa_family_relation);
                    $("#visa-family-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".visaFamily-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".visaFamily-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}



$("#reapply-visa-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        reapply_selection: {
            required: true
        }
    },
    messages: {
        reapply_selection: {
            required: "Please select an option"
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa-detail/reapply', $("#reapply-visa-form").serialize() + "&candidate_visa_uuid=" + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $(".response-message").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Case Re-applied Successfully</span>' + alertClose() + '</div>');
                        $("#reapply-modal").modal("hide");
                        setTimeout(function () {
                            window.location.href = baseUrl + "/case-management/visa-detail/" + type + "/" + btoa(response.data.data.candidate_visa_uuid);
                        }, 2000);
                    } else {
                        $(this).removeAttr('disabled');
                        $(".response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(this).removeAttr('disabled');
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".response-message").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

$("#reapply-button").on('click', function () {
    swal({
        title: "Re-apply the visa",
        text: "Are you sure re-apply?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    $("#reapply-modal").modal("show");
                }
            });
});