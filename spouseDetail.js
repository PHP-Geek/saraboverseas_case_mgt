var axios = require('axios');
var swal = require('sweetalert');
$(function () {
    $("#spouse-modal").find("#spouse_dob").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 90,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    $("#spouse-visa-status-modal").find("#spouse_employment_start_date,#spouse_employment_end_date,#spouse_enrolment_issue_date,#spouse_enrolment_expiry_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 90,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    getSpouseDetail();
});
$("#spouse-visa-status-modal").find("#spouse_visa_status").on('change', function () {
    if ($(this).val() != "") {
        $("#spouse-visa-status-modal").find(".status-view").addClass('d-none');
        $("#spouse-visa-status-modal").find("#" + $(this).val() + "_div").removeClass('d-none');
    }
});
$("#spouse-visa-status-modal").find("#spouse_employment_status").on('change', function () {
    if ($(this).val() == "EMPLOYED") {
        $("#spouse-visa-status-modal").find("#spouse-employment-status-div").removeClass('d-none');
    } else {
        $("#spouse-visa-status-modal").find("#spouse-employment-status-div").addClass('d-none');
    }
});
window.getSpouseDetail = function () {
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
    axios.get(baseUrl + '/v1/ajax/case-management/visa-spouse/detail?visa-uuid=' + visaUuid)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    var html = '';
                    var html1 = '';
                    var html2 = '';
                    if (Object.keys(response.data.data).length > 0) {
                        if (response.data.data.spouse_name != null) {
                            html += '<tr>\n\
<th>Name</th><td>' + response.data.data.spouse_name + '</td>\n\
</tr>';
                            $("#spouse-modal").find("#spouse_name").val(response.data.data.spouse_name);
                            html += '<tr>\n\
<th>DOB</th><td>' + response.data.data.spouse_dob + '</td>\n\
</tr>';
                            $("#spouse-modal").find("#spouse_dob").val(response.data.data.spouse_dob);
                            html += '<tr>\n\
<th>Address</th><td>' + response.data.data.spouse_address + '</td>\n\
</tr>';
                            $("#spouse-modal").find("#spouse_address").val(response.data.data.spouse_address);
                            html += '<tr>\n\
<th>Contact</th><td>' + response.data.data.spouse_contact + '</td>\n\
</tr>';
                            $("#spouse-modal").find("#spouse_contact").val(response.data.data.spouse_contact);
                            html += '<tr><td colspan="2" class="text-right"><a href="javascript:;" onclick="showSpouseDetailModal()" role="button" class="btn btn-xs btn-success btn-bold"><i class="fa fa-edit"></i> Update</a></td></tr>';
                        } else {
                            html += '<tr><td>No Sponsor/Spouse Detail Added.</td></tr>';
                            html += '<tr><td class="text-right"><a href="javascript:;" onclick="showSpouseDetailModal()" role="button" class="btn btn-xs btn-success btn-bold"><i class="fa fa-plus"></i> Add</a></td></tr>';
                        }
                        //employment status
                        if (response.data.data.spouse_visa_status != null) {
                            html1 += '<tr>\n\
<th>Status</th><td class="text-capitalize">' + (response.data.data.spouse_visa_status != null ? ((response.data.data.spouse_visa_status).toLowerCase()).replace('_', ' ') : '') + '</td>\n\
</tr>';
                            $("#spouse-visa-status-modal").find("#spouse_visa_status").select2('val', response.data.data.spouse_visa_status);
                            if (response.data.data.spouse_visa_status == 'WORK_PERMIT') {
                                html1 += '<tr>\n\
<th>Employment Status</th><td class="text-capitalize">' + (response.data.data.spouse_employement_status != null ? ((response.data.data.spouse_employement_status).toLowerCase()).replace('_', ' ') : '') + '</td>\n\
</tr>';
                                $("#spouse-visa-status-modal").find("#WORK_PERMIT_div").removeClass('d-none');
                                $("#spouse-visa-status-modal").find("#STUDY_PERMIT_div").addClass('d-none');
                                $("#spouse-visa-status-modal").find("#spouse_employment_status").select2('val', response.data.data.spouse_employement_status);
                                $("#spouse-visa-status-modal").find("#spouse-employment-status-div").addClass('d-none');
                                if (response.data.data.spouse_employement_status == 'EMPLOYED') {
                                    $("#spouse-visa-status-modal").find("#spouse-employment-status-div").removeClass('d-none');
                                    html1 += '<tr>\n\
<th>Job Title</th><td>' + (response.data.data.spouse_job_title != null ? response.data.data.spouse_job_title : '') + '</td>\n\
</tr>';
                                    $("#spouse-visa-status-modal").find("#spouse_job_title").val(response.data.data.spouse_job_title);
                                    html1 += '<tr>\n\
<th>Employer Name</th><td>' + (response.data.data.spouse_employer_name != null ? response.data.data.spouse_employer_name : '') + '</td>\n\
</tr>';
                                    $("#spouse-visa-status-modal").find("#spouse_employer_name").val(response.data.data.spouse_employer_name);
                                    html1 += '<tr>\n\
<th>Start Date</th><td>' + (response.data.data.spouse_employement_start_date != null ? response.data.data.spouse_employement_start_date : '') + '</td>\n\
</tr>';
                                    $("#spouse-visa-status-modal").find("#spouse_employment_start_date").val(response.data.data.spouse_employement_start_date);
                                    html1 += '<tr>\n\
<th>End Date</th><td>' + (response.data.data.spouse_employement_end_date != null ? response.data.data.spouse_employement_end_date : '') + '</td>\n\
</tr>';
                                    $("#spouse-visa-status-modal").find("#spouse_employment_end_date").val(response.data.data.spouse_employement_end_date);
                                }
                            }
                            if (response.data.data.spouse_visa_status == 'STUDY_PERMIT') {
                                $("#spouse-visa-status-modal").find("#WORK_PERMIT_div").addClass('d-none');
                                $("#spouse-visa-status-modal").find("#STUDY_PERMIT_div").removeClass('d-none');
                                //ENROLLMENT status
                                html1 += '<tr>\n\
<th>College Name</th><td>' + (response.data.data.spouse_college_name != null ? response.data.data.spouse_college_name : '') + '</td>\n\
</tr>';
                                $("#spouse-visa-status-modal").find("#spouse_college_name").val(response.data.data.spouse_college_name);
                                html1 += '<tr>\n\
<th>Course Name</th><td>' + (response.data.data.spouse_course_name != null ? response.data.data.spouse_course_name : '') + '</td>\n\
</tr>';
                                $("#spouse-visa-status-modal").find("#spouse_course_name").val(response.data.data.spouse_course_name);
                                html1 += '<tr>\n\
<th>Enrolment Issue Date</th><td>' + (response.data.data.spouse_enrolment_issue_date != null ? response.data.data.spouse_enrolment_issue_date : '') + '</td>\n\
</tr>';
                                $("#spouse-visa-status-modal").find("#spouse_enrolment_issue_date").val(response.data.data.spouse_enrolment_issue_date);
                                html1 += '<tr>\n\
<th>Enrolment Expiry Date</th><td>' + (response.data.data.spouse_enrolment_expiry_date != null ? response.data.data.spouse_enrolment_expiry_date : '') + '</td>\n\
</tr>';
                                $("#spouse-visa-status-modal").find("#spouse_enrolment_expiry_date").val(response.data.data.spouse_enrolment_expiry_date);
                                html1 += '<tr>\n\
<th>Enrolment Status</th><td class="text-capitalize">' + (response.data.data.spouse_enrolled_status != null ? ((response.data.data.spouse_enrolled_status).toLowerCase()).replace('_', ' ') : '') + '</td>\n\
</tr>';
                                $("#spouse-visa-status-modal").find("#spouse_enrolled_status").select2('val', response.data.data.spouse_enrolled_status);
                            }
                            html1 += '<tr><td colspan="2" class="text-right"><a href="javascript:;" onclick="showSpouseVisaStatusModal()" role="button" class="btn btn-xs btn-success btn-bold"><i class="fa fa-edit"></i> Update</a></td></tr>';
                        } else {
                            html1 += '<tr><td>No Sponsor/Spouse Visa Status Added.</td></tr>';
                            html1 += '<tr><td class="text-right"><a href="javascript:;" onclick="showSpouseVisaStatusModal()" role="button" class="btn btn-xs btn-success btn-bold"><i class="fa fa-plus"></i> Add</a></td></tr>';
                        }
                    } else {
                        html += '<tr><td>No Sponsor/Spouse Detail Added.</td></tr>';
                        html += '<tr><td class="text-right"><a href="javascript:;" onclick="showSpouseDetailModal()" role="button" class="btn btn-xs btn-success btn-bold"><i class="fa fa-plus"></i> Add</a></td></tr>';
                        html1 += '<tr><td>No Sponsor/Spouse Visa Status Added.</td></tr>';
                        html1 += '<tr><td class="text-right"><a href="javascript:;" onclick="showSpouseVisaStatusModal()" role="button" class="btn btn-xs btn-success btn-bold"><i class="fa fa-plus"></i> Add</a></td></tr>';
                    }
                    $("#spouse-view").html(html);
                    $("#spouse-visa-status-view").html(html1);
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

window.showSpouseDetailModal = function () {
    $("#spouse-modal").modal('show');
}
window.showSpouseVisaStatusModal = function () {
    $("#spouse-visa-status-modal").modal('show');
}

$("#spouse-detail-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        spouse_name: {
            required: true
        },
        spouse_dob: {
            required: true
        },
        spouse_contact: {
            required: true,
            maxlength: 12,
            minlength: 10
        },
        spouse_address: {
            required: true
        },
    },
    messages: {
        spouse_name: {
            required: "Name is required"
        },
        spouse_dob: {
            required: "Dob is required"
        },
        spouse_contact: {
            required: "Contact is required",
            maxlength: "Contact number must be valid",
            minlength: "Contact number must be valid"
        },
        spouse_address: {
            required: "Address is required"
        },
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa-spouse/store', $("#spouse-detail-form").serialize() + '&type=spouse-detail&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#spouse-modal").modal('hide');
                        $(".spouse-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Spouse Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        getSpouseDetail();
                    } else {
                        $(".spouse-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".spouse-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".spouse-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});
$("#spouse-visa-status-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        spouse_visa_status: {
            required: true
        },
        spouse_employment_status: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'WORK_PERMIT' ? true : false;
            }
        },
        spouse_job_title: {
            required: function () {
                return ($("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'WORK_PERMIT' && $("#spouse-visa-status-form").find("#spouse_employement_status").val() == 'EMPLOYED') ? true : false;
            }
        },
        spouse_employer_name: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'WORK_PERMIT' && $("#spouse-visa-status-form").find("#spouse_employement_status").val() == 'EMPLOYED' ? true : false;
            }
        },
        spouse_employment_start_date: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'WORK_PERMIT' && $("#spouse-visa-status-form").find("#spouse_employement_status").val() == 'EMPLOYED' ? true : false;
            }
        },
        spouse_college_name: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'STUDY_PERMIT' ? true : false;
            }
        },
        spouse_course_name: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'STUDY_PERMIT' ? true : false;
            }
        },
        spouse_enrolment_issue_date: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'STUDY_PERMIT' ? true : false;
            }
        },
        spouse_enrolled_status: {
            required: function () {
                return $("#spouse-visa-status-form").find("#spouse_visa_status").val() == 'STUDY_PERMIT' ? true : false;
            }
        }
    },
    messages: {
        spouse_visa_status: {
            required: "Status is required"
        },
        spouse_employment_status: {
            required: "Employment status is required"
        },
        spouse_job_title: {
            required: "Job title is required"
        },
        spouse_employer_name: {
            required: "Employer name is required"
        },
        spouse_employment_start_date: {
            required: "Start date is required"
        },
        spouse_college_name: {
            required: "College name is required"
        },
        spouse_course_name: {
            required: "Course name is required"
        },
        spouse_enrolment_issue_date: {
            required: "Issue date is required"
        },
        spouse_enrolled_status: {
            required: "Enrolled status is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa-spouse/store', $("#spouse-visa-status-form").serialize() + '&type=visa-status&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#spouse-visa-status-modal").modal('hide');
                        $(".spouse-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Spouse Visa Updated Successfully.</span>' + alertClose() + '</div>');
                        getSpouseDetail();
                    } else {
                        $(".spouse-visa-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".spouse-visa-status-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".spouse-visa-status-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});