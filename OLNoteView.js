var axios = require('axios');
let CKeditor;
var notePage = 0;

window.showNoteModal = function () {
    $("#add-note-modal").find('textarea,input:not(input[name=_token])').val('');
    CKeditor.setData("");
    $("#note-modal").modal('show');
}

window.replyNote = function (that) {
    var parentId = $(that).data('uuid');
    $("#note-modal").find('textarea,input:not(input[name=_token])').val('');
    $("#note-modal").find('#communication_parent_uuid').val(parentId);
    CKeditor.setData("Re : ");
    $("#note-modal").modal('show');
}

$(function () {
    ClassicEditor
            .create(document.querySelector('#note_message'), {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                heading: {
                    options: [
                        {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                        {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                        {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'}
                    ]
                }
            })
            .then(editor => {
                CKeditor = editor;
                console.log(editor);
            })
            .catch(error => {
                console.error(error);
            });

    $('#add-note-form').each(function () {
        if ($(this).data('validator')) {
            $(this).data('validator').settings.ignore = ".ck";
        }
    });

    getNotes();
});

window.getNotes = function (page = 0) {
    $("#view-com-notes").block({
        'message': '<i class="fas fa-circle-notch fa-spin fa-2x"></i>',
        'css': {
            border: '0',
            padding: '0',
            backgroundColor: 'none',
            marginTop: '15%',
            zIndex: '10600',
            left: '50%'
        },
        overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
    });
    axios.get(baseUrl + '/v1/ajax/case-management/communication/get-chat/' + threadUuid + '?page=' + page)
            .then(function (response) {
                $("#view-com-notes").unblock();
                var html = '';
                if ('data' in response.data) {
                    if (response.data.data.length > 0) {
                        notePage = page;
                        $.each(response.data.data, function (i, v) {
                            var float = (loggedInUser != 'undefined' && v.user_information_uuid == loggedInUser) ? 'right' : 'left';
                            var background = (loggedInUser != 'undefined' && v.user_information_uuid == loggedInUser) ? 'success' : 'primary';
                            html += '<div class="card mt-1 float-' + float + '" style="width:80%">\n\
                        <div class="card-header bg-' + background + ' text-white">\n\
<img src="' + v.sso_user_information.user_information_profile_image + '" class="img-profile rounded-circle" style="width:30px"/>\n\
                             &nbsp;&nbsp;<strong>' + v.note_title + '</strong><span class="float-right">' + v.note_created_date + ((v.user_information_uuid != loggedInUser) ? ' <a class="text-white" href="javascript:;" data-uuid="' + btoa(v.communication_note_chat_uuid) + '" onclick="replyNote(this)"><i class="fa fa-reply"></i></a>' : '') + '</span>\n\
                        </div>\n\
                        <div class="card-body">';
                            if (v.communication_parent_uuid != null && v.communication_parent_uuid != 'undefined') {
                                html += '<a href="javascript:;"><div class="mb-1"><strong>Reply from : ' + v.case_communication_note_chat.note_title + ' on <span class="text-muted">' + v.case_communication_note_chat.chat_note_created_date + '</span></strong></div></a>';
                            }
                            html += v.note_comment + '\n\
                        </div>\n\
                        </div>';
                        });

                        $("#view-com-notes").append(html);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
                $(window).unblock();
            });
}

window.viewNoteChat = function (uuid) {
    $(window).block({
        'message': '<i class="fas fa-circle-notch fa-spin fa-2x"></i>',
        'css': {
            border: '0',
            padding: '0',
            backgroundColor: 'none',
            marginTop: '15%',
            zIndex: '10600',
            left: '50%'
        },
        overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
    });
    axios.get(baseUrl + '/v1/ajax/case-management/communication/chat/' + uuid)
            .then(function (response) {
                $(window).unblock();
                if ("data" in response.data) {
                    console.log(response.data.data)
                }
            })
            .catch(function (error) {
                console.log(error);
                alert(error.response.data.message);
                $(window).unblock();
            });
}

$("#view-com-notes").scroll(function () {
    // make sure u give the container id of the data to be loaded in.
    console.log('total', $("#view-com-notes").scrollTop() + $("#view-com-notes").height());
    console.log('height', document.getElementById('view-com-notes').scrollHeight);
    if ($("#view-com-notes").scrollTop() + $("#view-com-notes").height() >= document.getElementById('view-com-notes').scrollHeight) {
        getNotes(notePage + 1);
    }
});

$("#add-note-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        note_title: {
            required: true
        },
        note_message: {
            required: function ()
            {
                return (CKeditor.getData().trim()).length > 0 ? false : true;
            }
        }
    },
    messages: {
        note_title: {
            required: "Title is required"
        },
        note_message: {
            required: "Message is required"
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
        axios.post(baseUrl + '/v1/ajax/case-management/communication/chat/store', $("#add-note-form").serialize() + '&note_message=' + CKeditor.getData().trim() + '&case_communication_uuid=' + atob(threadUuid))
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        var html = '<div class="card mt-1 float-right" style="width:80%">\n\
                        <div class="card-header bg-success text-white">\n\
<img src="' + response.data.data.sso_user_information.user_information_profile_image + '" class="img-profile rounded-circle" style="width:30px"/>\n\
                             &nbsp;&nbsp;<strong>' + response.data.data.note_title + '</strong><span class="float-right">' + response.data.data.note_created_date + '</span>\n\
                        </div>\n\
                        <div class="card-body">\n\
                        ' + response.data.data.note_comment + '\n\
                        </div>\n\
                        </div>';
                        $("#view-com-notes").prepend(html);
                        $("#note-modal").modal('hide');
                        $(".notes-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Note Added Successfully.</span>' + alertClose() + '</div>');
                    } else {
                        $(".note-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".note-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".note-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});
