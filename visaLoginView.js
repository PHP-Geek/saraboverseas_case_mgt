var axios = require('axios');
var swal = require('sweetalert');

$("#visa-agent-portal-modal").find(".radio-button-vd").on('change', function () {
    if ($("#visa_agent_portal_1").is(':checked')) {
        $("#agent-portal-username-div").addClass('d-none');
        $("#agent-portal-email-div").addClass('d-none');
        $("#agent-portal-login-url-div").addClass('d-none');
    } else {
        $("#agent-portal-username-div").removeClass('d-none');
        $("#agent-portal-email-div").removeClass('d-none');
        $("#agent-portal-login-url-div").removeClass('d-none');
    }
});

window.showVisaAgentPortalModal = function () {
    $("#visa-agent-portal-modal").modal('show');
}

$("#visa-agent-portal-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        visa_agent_portal: {
            required: function () {
                return $("#visa_agent_portal_1").is(':checked') ? false : true
            }
        },
        visa_login_username: {
            required: function () {
                return $("#visa_agent_portal_1").is(':checked') ? false : true
            }
        },
        visa_login_email: {
            required: function () {
                return $("#visa_agent_portal_1").is(':checked') ? false : true
            }
        },
//        visa_detail_login_url: {
//            required: function () {
//                return $("#visa_agent_portal_1").is(':checked') ? false : true
//            },
//            url: true
//        }
    },
    messages: {
        visa_agent_portal: {
            required: "User Agent Portal is required"
        },
        visa_login_username: {
            required: "Username is required"
        },
        visa_login_email: {
            required: "Email is required"
        },
//        visa_detail_login_url: {
//            required: "Login URL is required",
//            url: 'URL must be valid'
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa-login-detail/store', $("#visa-agent-portal-form").serialize() + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#visa-agent-portal-modal").modal('hide');
                        var html = '<tr>\n\
                        <th>\n\
                            User Agent Portal\n\
                        </th>\n\
                        <td>' + (response.data.data.visa_login_agent_portal == 'YES' ? 'Yes' : 'No') + '\n\
                        </td>\n\
                    </tr>\n\
                    <tr id="user-login-agent-portal-username-view" class="' + (response.data.data.visa_login_agent_portal == 'YES' ? 'd-none' : '') + '">\n\
                        <th>\n\
                            Username\n\
                        </th>\n\
                        <td>' + response.data.data.visa_login_username + '\n\
                        </td>\n\
                    </tr>\n\
                    <tr id="user-login-agent-portal-username-view"  class="' + (response.data.data.visa_login_agent_portal == 'YES' ? 'd-none' : '') + '">\n\
                        <th>\n\
                            Email\n\
                        </th>\n\
                        <td>' + response.data.data.visa_login_email + '\n\
                        </td>\n\
                    </tr>\n\
\n\ <tr id="user-login-agent-portal-username-view"  class="' + (response.data.data.visa_login_agent_portal == 'YES' ? 'd-none' : '') + '">\n\
                        <th>\n\
                            Login Password\n\
                        </th>\n\
                        <td>' + (response.data.data.visa_login_password != null ? response.data.data.visa_login_password : "") + '\n\
                        </td>\n\
                    </tr>\n\
                    <tr>\n\
                        <td colspan="2">\n\
                            <div class="row pt-4">\n\
                                <div class="col-12 text-md-right">\n\
                                    <a href="javascript:;" role="button" onclick="showVisaAgentPortalModal()" class="btn btn-xs btn-success btn-bold">\n\
                                        <i class="fa fa-pencil"></i>\n\
                                        Update\n\
                                    </a>\n\
                                </div>\n\
                            </div>\n\
                        </td>\n\
                    </tr>';
                        $("#visa-login-agent-view").html(html);
//                        $(".ielts-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Ielts Detail Updated Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".visa-agent-portal-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".visa-agent-portal-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".visa-agent-portal-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});