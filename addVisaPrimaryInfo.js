var axios = require('axios');
var swal = require('sweetalert');
import '../common/masterDocumentUpload';

$(function () {
    $("#passport_expiry_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear(),
        yearEnd: (new Date()).getFullYear() + 20,
        minDate: new Date()
    });
    $("#dob,#medical_date").datetimepicker({
        autoClose: true,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 50,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    $('select').select2();
//    listAgents();
});

var basic = $('#show-p-image').croppie({
    viewport: {width: 150, height: 200},
    boundary: {width: 400, height: 400},
//        url: baseUrl + '/img/default.png'
});
basic.croppie('setZoom', 0.1);
var master_document_mime = '';
$("#profile_photo").on('change', function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        var mimeType = this.files[0].type;
        if ($.inArray(mimeType, ["image/png", "image/jpeg", 'image/jpg']) == -1) {
            $(this).val('');
            alert("Please upload a valid file");
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
                axios.post(baseUrl + '/v1/ajax/upload/file',
                        {
                            'master_document_data': result,
                            'master_document_mime': master_document_mime,
                            _token: $('meta[name="csrf-token"]').attr('content')
                        })
                        .then(function (response) {
                            if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                $("#candidate_photo").val(response.data.data.master_document_uuid);
                                $("#view-candidate_photo").html('<img height="80px" width="80px" src="' + response.data.data.master_document_url + '" alt="profile-image"/>');
                                $("#update-profile-image-modal").modal('hide');
                            } else {
                                swal('', 'Something went wrong. Please try again', 'error');
                            }
                            $(window).unblock();
                        })
                        .catch(function (error) {
                            if ((error.response.data).hasOwnProperty('message')) {
                                swal('', error.response.data.message, 'error');
                            } else {
                                swal('', 'Something went wrong', 'error');
                            }
                            $(window).unblock();
                        });
            });
        });
    });
});

window.listAgents = function () {
    axios.get(baseUrl + '/v1/ajax/agents/list')
            .then(function (response) {
                var html = '<option></option>';
                $.each(response.data, function (i, v) {
                    html += '<option value="' + v.user_information_uuid + '">' + v.user_information_fullname + '</option>';
                });
                $("#agent_name").html(html);
//                $(window).unblock();
            })
            .catch(function (error) {
//                $(window).unblock();
            });
}

$("#add-candidate-primary-info").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        fullname: {
            required: true,
            alpha: true
        },
        email: {
            required: true,
            email: true
        },
        phone: {
            required: true,
            number: true,
            minlength: 10,
            maxlength: 10
        },
        dob: {
            required: true
        },
        address: {
            required: true
        },
        country: {
            required: true
        },
        candidate_photo: {
            required: $.inArray(role, ['admin']) != -1 ? true : false
        },
        passport_number: {
            required: true,
            maxlength: 8
        },
        passport_expiry_date: {
            required: true
        }
    },
    messages: {
        fullname: {
            required: "Name is required",
            alpha: "Name must be valid"
        },
        email: {
            required: "Email is required",
            email: "Email must be valid"
        },
        phone: {
            required: "Mobile Number is required",
            number: "Mobile number must be valid",
            minlength: "Mobile number must be valid",
            maxlength: "Mobile number must be valid"
        },
        dob: {
            required: "Date of Birth is required"
        },
        address: {
            required: "Address is required"
        },
        country: {
            required: "Please select the country to be visited"
        },
        candidate_photo: {
            required: "Photo is required"
        },
        passport_number: {
            required: "Passport number is required",
            maxlength: "Passport number must not exceed 8 characters"
        },
        passport_expiry_date: {
            required: "Expiry date is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/visa/primary-info/store', $("#add-candidate-primary-info").serialize())
                .then(function (response) {
                    $('html, body').animate({
                        scrollTop: $("#add-candidate-primary-info").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        window.location.href = baseUrl + '/case-management/visa/' + type + '/add/education/' + btoa(response.data.data.candidate_visa_uuid);
                    } else {
                        $(".add-visa-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $('html, body').animate({
                        scrollTop: $("#add-candidate-primary-info").offset().top
                    }, 1500);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".add-visa-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".add-visa-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});

$("#passport_attachment").on('change', function () {
    uploadFiles(this, 'view-passport-attachment', 'passport_attachment_file', 'candidate_passport_original_name');
});
$("#medical_attachment").on('change', function () {
    uploadFiles(this, 'view-medical-attachment', 'medical_attachment_file');
});

window.uploadFiles = function (that, viewAttachmentDiv, attachmentControl, original) {
    console.log(that.files);
    if (that.files && that.files[0]) {
        var FR = new FileReader();
        var mimeType = that.files[0].type;
        var originalName = that.files[0].name;
        if ($.inArray(mimeType, ['application/pdf', 'application/msword']) == -1) {
            $(that).val('');
            alert("Please upload a valid file");
            return false;
        }
        //check the file size
        var size = that.files[0].size;
        if (size > 5 * 1024 * 1024) {
            $(that).val('');
            alert("File must not be greater than 5 MB");
            return false;
        }
        if (original != null) {
            $("#" + original).val(that.files[0].name);
        }
        FR.addEventListener("load", function (e) {
            var fileData = e.target.result;
            addMasterDocument(mimeType, fileData, viewAttachmentDiv, attachmentControl, originalName);
        });
        FR.readAsDataURL(that.files[0]);
    }
}

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}


window.removeFile = function (that, fileControl) {
    $(that).parent().remove();
    $("#" + fileControl).val('');
    $("#" + fileControl).parent().find('input[type=file]').val('');
}