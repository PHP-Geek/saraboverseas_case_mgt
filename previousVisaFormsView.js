var axios = require('axios');
var swal = require('sweetalert');
var PreviousVisaFormDatatable;
window.camelize = function (str) {
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
            function (s) {
                return s.toUpperCase();
            });
}
$(function () {
    PreviousVisaFormDatatable = $('#previous-visa-forms-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "language": {
            "emptyTable": "No Travel History"
        },
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/previous-visa-forms/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_detail_uuid = candidateUuid;
                d._visa_uuid = visaUuid;
            }
        },
        "columns": [
            {"data": "candidate_visa_uuid", 'title': '#', orderable: false, render: function (data, full, row) {
                    return '<a target="_blank" href="' + baseUrl + '/case-management/visa-detail/study/' + btoa(data) + '">#' + data + '</a>';
                }
            },
            {"data": "candidate_visa_form_date", 'title': 'Date'},
            {"data": "visa_form_type", 'title': 'Visa Form', render: function (data, full, row) {
                    return camelize((data).replaceAll("_", " ").toLowerCase());
                }
            },
            {"data": "candidate_visa_form_attachment", 'title': 'Attachment', render: function (data, full, row) {
                    return showFileUrl(baseUrl + '/get-document?_doc_token=' + data);
                }
            }
        ]
    });

    //get the previous visa detail
    axios.get(baseUrl + '/v1/ajax/case-management/previous-visa-detail/' + btoa(visaUuid))
            .then(function (response) {
                var html = '';
                if ('candidate_visa_uci_id' in response.data.data) {
                    html += '<tr><th>UCI ID</th><td>' + response.data.data.candidate_visa_uci_id + '</td></tr>';
                }
                if ('candidate_visa_app_id' in response.data.data) {
                    html += '<tr><th>Application Number</th><td>' + response.data.data.candidate_visa_app_id + '</td></tr>';
                }
                if ('final_visa_submission_date' in response.data.data) {
                    html += '<tr><th>Submission Date</th><td>' + response.data.data.final_visa_submission_date + '</td></tr>';
                }
                if ('visa_login_agent_portal' in response.data.data) {
                    html += '<tr><th>User Agent Portal</th><td>' + response.data.data.visa_login_agent_portal + '</td></tr>';
                    if (response.data.data.visa_login_agent_portal == 'NO') {
                        if ('visa_login_username' in response.data.data) {
                            html += '<tr><th>Username</th><td>' + response.data.data.visa_login_username + '</td></tr>';
                        }
                        if ('visa_login_email' in response.data.data) {
                            html += '<tr><th>Email</th><td>' + response.data.data.visa_login_email + '</td></tr>';
                        }
                        if ('visa_login_password' in response.data.data) {
                            html += '<tr><th>Login Password</th><td>' + response.data.data.visa_login_password + '</td></tr>';
                        }
                    }
                }
                $("#previous-visa-detail").html(html);
            })
            .catch(function (error) {
//                $(window).unblock();
            });

});