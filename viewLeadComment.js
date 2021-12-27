var axios = require('axios');
var swal = require('sweetalert');
var page = 0;
$(function () {
    loadComments();
});

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}

window.reloadComments = function () {
    page = 0;
    loadComments();
}

/**
 * load child comments
 * @param {type} parentUuid
 * @returns {undefined}
 */
window.loadChildComments = function (parentUuid) {
    axios.get(baseUrl + '/v1/ajax/lead/comment/child/list?lead_comment_uuid=' + parentUuid)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    var html = '<div class="lead-comment-response-message"></div>';
                    $.each(response.data.data, function (i, v) {
                        html += '<div class="media mt-4"> <a class="pr-3" href="#"><img class="rounded-circle img-small" alt="Bootstrap Media Another Preview" src="' + ((v.hasOwnProperty('sso_user_information') && v.sso_user_information != null && v.sso_user_information.user_information_profile_image != null) ? baseUrl + '/get-document?_doc_token=' + v.sso_user_information.user_information_profile_image : baseUrl + '/img/comment_1.png') + '" /></a>';
                        html += '<div class="media-body">';
                        html += '<div class="row">';
                        html += '<div class="col-12 d-flex">';
                        html += '<h5>' + ((v.hasOwnProperty('sso_user_information') && v.sso_user_information != null && v.sso_user_information.user_information_fullname) ? v.sso_user_information.user_information_fullname : "No Name") + '</h5> <span>- ' + v.lead_comment_created_date + '</span>';
                        html += '</div>';
                        html += '</div>' + v.lead_comment_note;
                        html += '</div>';
                        html += '</div>';
                    });
                    //reply block
                    html += '<div class="media mt-4"> <a class="pr-3" href="#"><img class="rounded-circle img-small" alt="Bootstrap Media Another Preview" src="' + myProfileImage + '" /></a>';
                    html += '<div class="media-body">';
                    html += '<div class="row">';
                    html += '<div class="col-12 d-flex"><div class="input-group">';
                    html += '<input type="text" placeholder="Reply" maxlength="100" class="form-control reply-comment-value"/>';
                    html += '<div class="input-group-append"><button type="button" onclick="replyLeadComment(this)" id="reply-button" data-id="' + parentUuid + '" class="btn btn-xs btn-primary reply-button"><i class="fa fa-reply" aria-hidden="true"></i></button></div></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    //end of reply block
                    $("#comment-" + parentUuid).html(html);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
}

window.loadComments = function () {
    $("#load-more-button").remove();
    page++;
    if (page == 1) {
        $("#comment-list").html('');
    }
    $("#comment-list").block({
        'message': '<i class="fa fa-sync-alt fa-pulse fa-3x fa-fw"></i>',
        'css': {
            border: '0',
            padding: '0',
            backgroundColor: 'none',
            marginTop: '50%',
            zIndex: '10600'
        },
        overlayCSS: {backgroundColor: '#555', opacity: 0.3, cursor: 'wait', zIndex: '10600'},
    });
    axios.get(baseUrl + '/v1/ajax/lead/comment/list?lead_uuid=' + leaduuid + '&page=' + page)
            .then(function (response) {
                $("#comment-list").unblock();
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#total-comments-count").html(response.data.data.total + ' Comments');
                    var html = '';
                    $.each(response.data.data.data, function (i, v) {
                        html += '<div class="media">';
                        html += '<img class="mr-3 img-thumb rounded-circle" alt="Bootstrap Media Preview" src="' + (v.sso_user_information.user_information_profile_image != null ? baseUrl + '/get-document?_doc_token=' + v.sso_user_information.user_information_profile_image : baseUrl + '/img/comment_1.png') + '" />';
                        html += '<div class="media-body">';
                        html += '<div class="row">';
                        html += '<div class="col-12 d-flex">';
                        html += '<h5>' + (v.sso_user_information.user_information_fullname) + '</h5> <span>- ' + (v.lead_comment_created_date) + '</span>';
                        html += '</div>';
                        html += '</div> ' + v.lead_comment_note;
                        html += '<div id="comment-' + v.lead_comment_uuid + '"><div class="lead-comment-response-message"></div>';
                        if (v.hasOwnProperty('lead_comments')) {
                            if (v.lead_comments != null) {
                                $.each(v.lead_comments, function (i1, v1) {
                                    html += '<div class="media mt-4"> <a class="pr-3" href="#"><img class="rounded-circle img-small" alt="Bootstrap Media Another Preview" src="' + ((v1.hasOwnProperty('sso_user_information') && v1.sso_user_information != null && v1.sso_user_information.user_information_profile_image != null) ? baseUrl + '/get-document?_doc_token=' + v1.sso_user_information.user_information_profile_image : baseUrl + '/img/comment_1.png') + '" /></a>';
                                    html += '<div class="media-body">';
                                    html += '<div class="row">';
                                    html += '<div class="col-12 d-flex">';
                                    html += '<h5>' + ((v1.hasOwnProperty('sso_user_information') && v1.sso_user_information != null && v1.sso_user_information.user_information_fullname) ? v1.sso_user_information.user_information_fullname : "No Name") + '</h5> <span>- ' + v1.lead_comment_created_date + '</span>';
                                    html += '</div>';
                                    html += '</div>' + v1.lead_comment_note;
                                    html += '</div>';
                                    html += '</div>';
                                });
                            }
                        }
                        //reply block
                        html += '<div class="media mt-4"> <a class="pr-3" href="#"><img class="rounded-circle img-small" alt="Bootstrap Media Another Preview" src="' + myProfileImage + '" /></a>';
                        html += '<div class="media-body">';
                        html += '<div class="row">';
                        html += '<div class="col-12 d-flex"><div class="input-group">';
                        html += '<input type="text" placeholder="Reply" maxlength="100" class="form-control reply-comment-value"/>';
                        html += '<div class="input-group-append"><button type="button" onclick="replyLeadComment(this)" id="reply-button" data-id="' + v.lead_comment_uuid + '" class="btn btn-xs btn-primary reply-button"><i class="fa fa-reply" aria-hidden="true"></i></button></div></div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        //end of reply block
                        html += '</div>';
                        html += '</div>';
                    });
                    if (((response.data.data.total) / 5) > page) {
                        html += '<div id="load-more-button" class="text-center"><button onclick="loadMore(this)" class="btn btn-primary btn-xs"><i class="fa fa-sync-alt"></i> Load More</button></div>';
                    }
                    $("#comment-list").append(html);
                }
                $("#comment-list").unblock();
            })
            .catch(function (error) {
                console.log(error);
                $("#comment-list").unblock();
            });
}

window.loadMore = function (that) {
    loadComments();
}

/**
 * replay lead comment
 * @param {type} that
 * @returns {undefined}
 */
window.replyLeadComment = function (that) {
    var parentUuid = $(that).data('id');
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
    axios.post(baseUrl + '/v1/ajax/lead/comment/save',
            {
                'lead_comment_parent_uuid': parentUuid,
                comment: $("#comment-" + parentUuid).find(".reply-comment-value").val(),
                master_lead_uuid: leaduuid
            })
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#comment-" + parentUuid).find(".reply-comment-value").val('');
                    $("#comment-" + parentUuid).find(".lead-comment-response-message").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Comment Added</span>' + alertClose() + '</div>');
                    loadChildComments(parentUuid);
                } else {
                    $("#comment-" + parentUuid).find(".lead-comment-response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $("#comment-" + parentUuid).find(".lead-comment-response-message").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $("#comment-" + parentUuid).find(".lead-comment-response-message").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}


