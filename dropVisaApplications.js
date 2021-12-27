var axios = require('axios');
var swal = require('sweetalert');
var visaDatatable;
$(function () {
    getDatatable();
});

window.getDatatable = function (data, columns) {
    if (visaDatatable instanceof $.fn.dataTable.Api) {
        visaDatatable.clear().draw();
        visaDatatable.destroy();
    }
    $("#datatable-container").empty();
    $("#datatable-container").html('<table class="table table-bordered" id="visa-datatable" width="100%" cellspacing="0"></table>');
    visaDatatable = $('#visa-datatable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/visa-datatable",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._case_type = 'DROPPED';
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "id", name: "id", orderable: false, 'title': '#ID', render: function (data, full, row) {
                    return '#SID-' + data;
                }
            },
            {"data": "candidate_name", 'title': 'Name', orderable: false},
            {"data": "master_visa_type_name", 'title': 'Visa Type', orderable: false},
            {"data": "candidate_dob", 'title': 'DOB', orderable: false},
             {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
            {"data": "visa_status_type", 'title': 'Visa Status', orderable: false, render: function (data, full, row) {
                    return data != null ? camelize((data.toLowerCase()).split("_").join(" ")) : '';
                }},
//            {"data": "candidate_passport_no", 'title': 'Passport'}, {"data": "offer_letters", "title": "Visa Status", render: function (data, full, row) {
//                    var html = '';
//                    if ('SELECTED' in data) {
//                        html += '<button class="btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
//                    }
//                    if ('APPLIED' in data) {
//                        html += '<button class="btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
//                    }
//                    if ('APPROVED' in data) {
//                        html += '<button class="btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
//                    }
//                    if ('REJECTED' in data) {
//                        html += '<button class="btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
//                    }
//                    if ('WAITLISTED' in data) {
//                        html += '<button class="btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
//                    }
//                    if ('DEFERMENT_APPLIED' in data) {
//                        html += '<button class="btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
//                    }
//                    return html;
//                }
//            },
            {"data": null, title: 'Action', orderable: false, render: function (data, full, row) {
                    return '<a target="_blank" href="' + baseUrl + '/case-management/visa-detail/study/' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a>';
                }
            }
        ]
    });
}

$("#filter-button").on('click', function () {
    visaDatatable.draw();
});
$("#clear-button").on('click', function () {
    $("#lead-status").val('');
    $("#visa-type").val('');
    visaDatatable.draw();
});

window.deleteCandidateVisa = function (that) {
    swal({
        title: "Archive the record?",
        text: "Are you sure archive the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/visa-detail/delete/' + $(that).data('id'))
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".visa-application-ajax-response").html('<div class="alert alert-success justify-content-between">Archived Successfully</span>' + alertClose() + '</div>');
                                    visaDatatable.draw();
                                } else {
                                    $(".visa-application-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                $(".visa-application-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong</span>' + alertClose() + '</div>');
                                $(window).unblock();
                            });
                }
            });
}

window.alertClose = function () {
    return '<div class="alert-close d-inline-block float-right"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</button></div>';
}