window.loadOPRContent = function (row) {
var html = '';
        if (row != null) {
$.each(row, function (i, v) {
html += '  <div class="clone_component_1">\n\
            <div class="row">\n\
                <div class="col-6">\n\
                    <div class="form-group">\n\
                        <label>Date</label>\n\
                        <input placeholder="Date" value="' + convertDate(v.date) + '" type="text" class="form-control visa-status-date" name="visa_status_date[]"/>\n\
                    </div>\n\
                </div>\n\
                <div class="col-6 col-lg-6">\n\
                    <div class="form-group">\n\
                        <label>Attachment</label>\n\
                        <div class="input-file-btn">\n\
                            <button type="button" class="btn btn-block  btn-file">\n\
                                <input type="hidden" id="visa_status_attachment_1_'+i+'" class="attachment-name" name="visa_status_attachment[]" value="' + v.attachment + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_date_1_'+i+'" class="attachment-date" name="visa_status_attachment_date[]" value="' + v.uploaded_date + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_original_1_'+i+'" class="original_attachment-name" name="visa_status_attachment_original[]" value="' + v.original_name + '"/>\n\
                                <input type="file" class="visa-status-attachment-file" data-row-id="1_'+i+'" id="visa_status_attachment_file" name="visa_status_attachment_file[]" onchange="uploadAttachmentVisaStatus(this)">\n\
                            </button>\n\
                        </div>\n\
                        <p class="m-0 small text-right">\n\
                            pdf,doc,docx - max 5MB\n\
                        </p>\n\
                    </div>\n\
                    <div class="text-center view-visa-status-attachment" id="view-visa_status_attachment_1_'+i+'">';
        if (v.attachment != null && v.attachment != ""){
html += showFileUrl(v.attachment, v.original_name);
        }
html += '</div>\n\
                </div>\n\
            </div>\n\
            <div class="row">\n\
                <div class="col-12 text-right">\n\
                    <a href="javascript:;" onclick="clone_component(this, 1)" class="btn btn-primary btn-xs btn-bold clone_component_button_1"><i class="fa fa-plus-circle"></i></a>\n\
                    <a href="javascript:;" onclick="remove_component(this, 1)" class="btn btn-danger btn-xs btn-bold remove_component_button_1 ' + (row.length < 2 ? 'd-none':'') + '"><i class="fa fa-minus-circle"></i></a>\n\
                </div>\n\
            </div>\n\
        </div>';
});
} else {
html += $("#visa-status-modal").find("#original_passport_requested-inner-div").html();
}
$("#visa-status-modal").find("#original_passport_requested-inner-div").html('');
        $("#visa-status-modal").find("#original_passport_requested-inner-div").html($($.parseHTML(html))).contents();
        $("#visa-status-modal").find(".visa-status-date").datetimepicker({
autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
        });
        }
window.loadOPSContent = function (row) {
var html = '';
        if (row != null) {
$.each(row, function (i, v) {
html += '  <div class="clone_component_2">\n\
            <div class="row">\n\
                <div class="col-6">\n\
                    <div class="form-group">\n\
                        <label>Date</label>\n\
                        <input placeholder="Date" value="' + convertDate(v.date) + '" type="text" class="form-control visa-status-date" name="visa_status_date[]"/>\n\
                    </div>\n\
                </div>\n\
                <div class="col-6 col-lg-6">\n\
                    <div class="form-group">\n\
                        <label>Attachment</label>\n\
                        <div class="input-file-btn">\n\
                            <button type="button" class="btn btn-block  btn-file">\n\
                                <input type="hidden" id="visa_status_attachment_2_'+i+'" class="attachment-name" name="visa_status_attachment[]" value="' + v.attachment + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_date_2_'+i+'" class="attachment-date" name="visa_status_attachment_date[]" value="' + v.uploaded_date + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_original_2_'+i+'" class="original_attachment-name" name="visa_status_attachment_original[]" value="' + v.original_name + '"/>\n\
                                <input type="file" class="visa-status-attachment-file" data-row-id="2_'+i+'" id="visa_status_attachment_file" name="visa_status_attachment_file[]" onchange="uploadAttachmentVisaStatus(this)">\n\
                            </button>\n\
                        </div>\n\
                        <p class="m-0 small text-right">\n\
                            pdf,doc,docx - max 5MB\n\
                        </p>\n\
                    </div>\n\
                    <div class="text-center view-visa-status-attachment" id="view-visa_status_attachment_2_'+i+'">';
        if (v.attachment != null && v.attachment != ""){
html += '<a title="' + v.original_name + '" target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + v.attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>';
        }
html += '</div>\n\
                </div>\n\
            </div>\n\
            <div class="row">\n\
                <div class="col-12 text-right">\n\
                    <a href="javascript:;" onclick="clone_component(this, 2)" class="btn btn-primary btn-xs btn-bold clone_component_button_2"><i class="fa fa-plus-circle"></i></a>\n\
                    <a href="javascript:;" onclick="remove_component(this, 2)" class="btn btn-danger btn-xs btn-bold remove_component_button_2 ' + (row.length < 2 ? 'd-none':'') + '"><i class="fa fa-minus-circle"></i></a>\n\
                </div>\n\
            </div>\n\
        </div>';
});
} else {
html += $("#visa-status-modal").find("#original_passport_submitted-inner-div").html();
}
$("#visa-status-modal").find("#original_passport_submitted-inner-div").html('');
        $("#visa-status-modal").find("#original_passport_submitted-inner-div").html($($.parseHTML(html))).contents();
        $("#visa-status-modal").find(".visa-status-date").datetimepicker({
autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
        });
        }
window.loadVisaApprovedContent = function (row) {
var html = '';
        if (row != null) {
$.each(row, function (i, v) {
html += '<div class="clone_component_3">\n\
            <div class="row">\n\
                <div class="col-6">\n\
                    <div class="form-group">\n\
                        <label>Date</label>\n\
                        <input placeholder="Date" value="' + convertDate(v.date) + '" type="text" class="form-control visa-status-date" name="visa_status_date[]"/>\n\
                    </div>\n\
                </div>\n\
                <div class="col-6 col-lg-6">\n\
                    <div class="form-group">\n\
                        <label>Attachment</label>\n\
                        <div class="input-file-btn">\n\
                            <button type="button" class="btn btn-block  btn-file">\n\
                                <input type="hidden" id="visa_status_attachment_3_'+i+'" class="attachment-name" name="visa_status_attachment[]" value="' + v.attachment + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_date_3_'+i+'" class="attachment-date" name="visa_status_attachment_date[]" value="' + v.uploaded_date + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_original_3_'+i+'" class="original_attachment-name" name="visa_status_attachment_original[]" value="' + v.original_name + '"/>\n\
                                <input type="file" class="visa-status-attachment-file" data-row-id="3_'+i+'" id="visa_status_attachment_file" name="visa_status_attachment_file[]" onchange="uploadAttachmentVisaStatus(this)">\n\
                            </button>\n\
                        </div>\n\
                        <p class="m-0 small text-right">\n\
                            pdf,doc,docx - max 5MB\n\
                        </p>\n\
                    </div>\n\
                    <div class="text-center view-visa-status-attachment" id="view-visa_status_attachment_3_'+i+'">';
        if (v.attachment != null && v.attachment != ""){
html += '<a title="' + v.original_name + '" target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + v.attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>';
        }
html += '</div>\n\
                </div>\n\
            </div>\n\
            <div class="row">\n\
                <div class="col-12 text-right">\n\
                    <a href="javascript:;" onclick="clone_component(this, 3)" class="btn btn-primary btn-xs btn-bold clone_component_button_3"><i class="fa fa-plus-circle"></i></a>\n\
                    <a href="javascript:;" onclick="remove_component(this, 3)" class="btn btn-danger btn-xs btn-bold remove_component_button_3 ' + (row.length < 2 ? 'd-none':'') + '"><i class="fa fa-minus-circle"></i></a>\n\
                </div>\n\
            </div>\n\
        </div>';
});
} else {
html += $("#visa-status-modal").find("#visa_approved-inner-div").html();
}
$("#visa-status-modal").find("#visa_approved-inner-div").html('');
        $("#visa-status-modal").find("#visa_approved-inner-div").html($($.parseHTML(html))).contents();
        $("#visa-status-modal").find(".visa-status-date").datetimepicker({
autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
        });
        }
window.loadVisaRefusedContent = function (row) {
var html = '';
        if (row != null) {
$.each(row, function (i, v) {
html += '  <div class="clone_component_4">\n\
            <div class="row">\n\
                <div class="col-6">\n\
                    <div class="form-group">\n\
                        <label>Date</label>\n\
                        <input placeholder="Date" value="' + convertDate(v.date) + '" type="text" class="form-control visa-status-date" name="visa_status_date[]"/>\n\
                    </div>\n\
                </div>\n\
                <div class="col-6 col-lg-6">\n\
                    <div class="form-group">\n\
                        <label>Attachment</label>\n\
                        <div class="input-file-btn">\n\
                            <button type="button" class="btn btn-block  btn-file">\n\
                                <input type="hidden" id="visa_status_attachment_4_'+i+'" class="attachment-name" name="visa_status_attachment[]" value="' + v.attachment + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_date_4_'+i+'" class="attachment-date" name="visa_status_attachment_date[]" value="' + v.uploaded_date + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_original_4_'+i+'" class="original_attachment-name" name="visa_status_attachment_original[]" value="' + v.original_name + '"/>\n\
                                <input type="file" class="visa-status-attachment-file" data-row-id="4_'+i+'" id="visa_status_attachment_file" name="visa_status_attachment_file[]" onchange="uploadAttachmentVisaStatus(this)">\n\
                            </button>\n\
                        </div>\n\
                        <p class="m-0 small text-right">\n\
                            pdf,doc,docx - max 5MB\n\
                        </p>\n\
                    </div>\n\
                    <div class="text-center view-visa-status-attachment" id="view-visa_status_attachment_4_'+i+'">';
        if (v.attachment != null && v.attachment != ""){
html += '<a title="' + v.original_name + '" target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + v.attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>';
        }
html += '</div>\n\
                </div>\n\
            </div>\n\
            <div class="row">\n\
                <div class="col-12 text-right">\n\
                    <a href="javascript:;" onclick="clone_component(this, 4)" class="btn btn-primary btn-xs btn-bold clone_component_button_4"><i class="fa fa-plus-circle"></i></a>\n\
                    <a href="javascript:;" onclick="remove_component(this, 4)" class="btn btn-danger btn-xs btn-bold remove_component_button_4 ' + (row.length < 2 ? 'd-none':'') + '"><i class="fa fa-minus-circle"></i></a>\n\
                </div>\n\
            </div>\n\
        </div>';
});
} else {
html += $("#visa-status-modal").find("#visa_refused-inner-div").html();
}
$("#visa-status-modal").find("#visa_refused-inner-div").html('');
        $("#visa-status-modal").find("#visa_refused-inner-div").html($($.parseHTML(html))).contents();
        $("#visa-status-modal").find(".visa-status-date").datetimepicker({
autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
        });
        }
window.loadFDRContent = function (row) {
var html = '';
        if (row != null) {
$.each(row, function (i, v) {
html += '  <div class="clone_component_5">\n\
            <div class="row">\n\
                <div class="col-6 col-md-4">\n\
                    <div class="form-group">\n\
                        <label>Date</label>\n\
                        <input placeholder="Date" value="' + convertDate(v.date) + '" type="text" class="form-control visa-status-date" name="visa_status_date[]"/>\n\
                    </div>\n\
                </div>\n\
                <div class="col-6 col-md-4">\n\
                    <div class="form-group">\n\
                        <label>Attachment</label>\n\
                        <div class="input-file-btn">\n\
                            <button type="button" class="btn btn-block  btn-file">\n\
                                <input type="hidden" id="visa_status_attachment_5_'+i+'" class="attachment-name" name="visa_status_attachment[]" value="' + v.attachment + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_date_5_'+i+'" class="attachment-date" name="visa_status_attachment_date[]" value="' + v.uploaded_date + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_original_5_'+i+'" class="original_attachment-name" name="visa_status_attachment_original[]" value="' + v.original_name + '"/>\n\
                                <input type="file" class="visa-status-attachment-file" data-row-id="5_'+i+'" id="visa_status_attachment_file" name="visa_status_attachment_file[]" onchange="uploadAttachmentVisaStatus(this)">\n\
                            </button>\n\
                        </div>\n\
                        <p class="m-0 small text-right">\n\
                            pdf,doc,docx - max 5MB\n\
                        </p>\n\
                    </div>\n\
                    <div class="text-center view-visa-status-attachment" id="view-visa_status_attachment_5_'+i+'">';
        if (v.attachment != null && v.attachment != ""){
html += '<a title="' + v.original_name + '" target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + v.attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>';
        }
html += '</div>\n\
                </div>\n\
\n\<div class="col-6 col-md-4">\n\
                    <div class="form-group">\n\
                        <label>Comment (Optional)</label>\n\
                        <textarea rows="3" placeholder="Comment" class="form-control" name="visa_status_comment[]">' + (v.hasOwnProperty('comment') ? v.comment:'') + '</textarea>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <div class="row">\n\
                <div class="col-12 text-right">\n\
                    <a href="javascript:;" onclick="clone_component(this, 5)" class="btn btn-primary btn-xs btn-bold clone_component_button_5"><i class="fa fa-plus-circle"></i></a>\n\
                    <a href="javascript:;" onclick="remove_component(this, 5)" class="btn btn-danger btn-xs btn-bold remove_component_button_5 ' + (row.length < 2 ? 'd-none':'') + '"><i class="fa fa-minus-circle"></i></a>\n\
                </div>\n\
            </div>\n\
        </div>';
});
} else {
html += $("#visa-status-modal").find("#further_doc_requested-inner-div").html();
}
$("#visa-status-modal").find("#further_doc_requested-inner-div").html('');
        $("#visa-status-modal").find("#further_doc_requested-inner-div").html($($.parseHTML(html))).contents();
        $("#visa-status-modal").find(".visa-status-date").datetimepicker({
autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
        });
        }
window.loadAIPReceivedContent = function (row) {
var html = '';
        if (row != null) {
$.each(row, function (i, v) {
html += '  <div class="clone_component_6">\n\
            <div class="row">\n\
                <div class="col-6 col-md-6">\n\
                    <div class="form-group">\n\
                        <label>Date</label>\n\
                        <input placeholder="Date" value="' + convertDate(v.date) + '" type="text" class="form-control visa-status-date" name="visa_status_date[]"/>\n\
                    </div>\n\
                </div>\n\
                <div class="col-6 col-md-6">\n\
                    <div class="form-group">\n\
                        <label>Attachment</label>\n\
                        <div class="input-file-btn">\n\
                            <button type="button" class="btn btn-block  btn-file">\n\
                                <input type="hidden" id="visa_status_attachment_6_'+i+'" class="attachment-name" name="visa_status_attachment[]" value="' + v.attachment + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_date_6_'+i+'" class="attachment-date" name="visa_status_attachment_date[]" value="' + v.uploaded_date + '"/>\n\
                                <input type="hidden" id="visa_status_attachment_original_6_'+i+'" class="original_attachment-name" name="visa_status_attachment_original[]" value="' + v.original_name + '"/>\n\
                                <input type="file" class="visa-status-attachment-file" data-row-id="6_'+i+'" id="visa_status_attachment_file" name="visa_status_attachment_file[]" onchange="uploadAttachmentVisaStatus(this)">\n\
                            </button>\n\
                        </div>\n\
                        <p class="m-0 small text-right">\n\
                            pdf,doc,docx - max 5MB\n\
                        </p>\n\
                    </div>\n\
                    <div class="text-center view-visa-status-attachment" id="view-visa_status_attachment_6_'+i+'">';
        if (v.attachment != null && v.attachment != ""){
html += '<a title="' + v.original_name + '" target="_blank" href="' + baseUrl + '/get-document?_doc_token=' + v.attachment + '"><img src="' + baseUrl + '/img/document.png"/></a>';
        }
html += '</div>\n\
                </div>\n\
            </div>\n\
            <div class="row">\n\
                <div class="col-12 text-right">\n\
                    <a href="javascript:;" onclick="clone_component(this, 6)" class="btn btn-primary btn-xs btn-bold clone_component_button_5"><i class="fa fa-plus-circle"></i></a>\n\
                    <a href="javascript:;" onclick="remove_component(this, 6)" class="btn btn-danger btn-xs btn-bold remove_component_button_5 ' + (row.length < 2 ? 'd-none':'') + '"><i class="fa fa-minus-circle"></i></a>\n\
                </div>\n\
            </div>\n\
        </div>';
});
} else {
html += $("#visa-status-modal").find("#visa_AIP-inner-div").html();
}
$("#visa-status-modal").find("#visa_AIP-inner-div").html('');
        $("#visa-status-modal").find("#visa_AIP-inner-div").html($($.parseHTML(html))).contents();
        $("#visa-status-modal").find(".visa-status-date").datetimepicker({
autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
        });
        }