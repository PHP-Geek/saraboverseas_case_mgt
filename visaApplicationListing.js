var axios = require('axios');
var swal = require('sweetalert');
var visaDatatable;
window.camelize = function (str) {
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
            function (s) {
                return s.toUpperCase();
            });
}

$(function () {
    $('select').select2();
    if (caseType == 'REG') {
        $(".tabs").find(".nav-link").first().addClass('active');
    } else if (caseType == 'RTOA') {
        $(".tabs").find(".nav-link").eq(1).addClass('active');
    } else if (caseType == 'APPLIED') {
        $(".tabs").find(".nav-link").eq(2).addClass('active');
    } else if (caseType == 'APPROVED') {
        $(".tabs").find(".nav-link").eq(3).addClass('active');
    } else if (caseType == 'REJECTED') {
        $(".tabs").find(".nav-link").eq(4).addClass('active');
    }
    var columns = generateColumns(caseType);
    getDatatable(caseType, columns);
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
                d._case_type = data;
                d._visa_type = visaType;
                d._country = $("#country").val();
            }
        },
        "columns": columns
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

$("#country").on('change', function () {
    visaDatatable.draw();
});

window.getCaseType = function (that) {
    if (!$(that).hasClass('active')) {
        var columns = generateColumns($(that).data('value'));
        getDatatable($(that).data('value'), columns);
    }
}

window.viewCandidateVisa = function (that, type) {
    window.location.href = baseUrl + '/case-management/visa-detail/' + type + '/' + $(that).data('id');
}

window.generateColumns = function (type) {
    switch (type) {
        case 'REG':
            $("#visa-add-button").show();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "candidate_passport_no", 'title': 'Passport', 'orderable': false},
                {"data": "offer_letters", "title": "Offer Letter Status", 'orderable': false, render: function (data, full, row) {
                        var html = '';
                        if ('SELECTED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
                        }
                        if ('APPLIED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
                        }
                        if ('APPROVED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
                        }
                        if ('REJECTED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
                        }
                        if ('WAITLISTED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
                        }
                        if ('DEFERMENT_APPLIED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
                        }
                        return html;
                    }
                },
                {data: "created_by_agent", title: "Agent/Created by", orderable: false},
                {"data": null, title: 'Action', 'orderable': false, render: function (data, full, row) {
                        return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'' + visaType + '\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a>';
                    }
                }
            ];
            break;
        case 'RTOA':
            $("#visa-add-button").hide();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                 {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "candidate_passport_no", 'title': 'Passport', 'orderable': false},
                {"data": "offer_letters", "title": "Offer Letter Status", 'orderable': false, render: function (data, full, row) {
                        var html = '';
                        if ('SELECTED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
                        }
                        if ('APPLIED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
                        }
                        if ('APPROVED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
                        }
                        if ('REJECTED' in data) {
                            html += '<button class="btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
                        }
                        if ('WAITLISTED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
                        }
                        if ('DEFERMENT_APPLIED' in data) {
                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
                        }
                        return html;
                    }
                },
                {data: "created_by_agent", title: "Agent/Created by", orderable: false},
                {"data": null, title: 'Action', 'orderable': false, render: function (data, full, row) {
                        return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'' + visaType + '\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a>';
                    }
                }
            ];
            break;
        case 'DROPPED':
            $("#visa-add-button").hide();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                 {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "candidate_passport_no", 'title': 'Passport', 'orderable': false},
                {"data": "visa_status_type", 'title': 'Visa Status', 'orderable': false, render: function (data, full, row) {
                        return data != null ? camelize((data.toLowerCase()).split("_").join(" ")) : '';
                    }},
//                {"data": "offer_letters", "title": "Visa Status", render: function (data, full, row) {
//                        var html = '';
//                        if ('SELECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
//                        }
//                        if ('APPLIED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
//                        }
//                        if ('APPROVED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
//                        }
//                        if ('REJECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
//                        }
//                        if ('WAITLISTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
//                        }
//                        if ('DEFERMENT_APPLIED' in data) {
//                            html += '<button class="btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
//                        }
//                        return html;
//                    }
//                },
                {data: "created_by_agent", title: "Agent/Created by", orderable: false},
                {"data": null, title: 'Action', 'orderable': false, render: function (data, full, row) {
                        return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'' + visaType + '\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a>';
                    }
                }
            ];
            break;
        case 'APPLIED':
            $("#visa-add-button").hide();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                {"data": "candidate_passport_no", 'title': 'Passport', 'orderable': false},
                 {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "candidate_visa_uci_id", 'title': 'UCI ID', 'orderable': false},
                {"data": "candidate_visa_app_id", 'title': 'APP ID', 'orderable': false},
                {"data": "applied_on", 'title': 'Submission Date', 'orderable': false},
                {"data": "visa_status_type", 'title': 'Visa Status', 'orderable': false, render: function (data, full, row) {
                        return data != null ? camelize((data.toLowerCase()).split("_").join(" ")) : '';
                    }},
//                {"data": "offer_letters", "title": "Visa App Status", render: function (data, full, row) {
//                        var html = '';
//                        if ('SELECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
//                        }
//                        if ('APPLIED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
//                        }
//                        if ('APPROVED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
//                        }
//                        if ('REJECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
//                        }
//                        if ('WAITLISTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
//                        }
//                        if ('DEFERMENT_APPLIED' in data) {
//                            html += '<button class="btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
//                        }
//                        return html;
//                    }
//                },
                {data: "created_by_agent", title: "Agent/Created by", orderable: false},
                {"data": null, title: 'Action', 'orderable': false, render: function (data, full, row) {
                        return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'' + visaType + '\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a>';
                    }
                }
            ];
            break;
        case 'APPROVED':
            $("#visa-add-button").hide();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                 {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "visa_status_type", 'title': 'Visa Status', 'orderable': false, render: function (data, full, row) {
                        return data != null ? camelize((data.toLowerCase()).split("_").join(" ")) : '';
                    }},
                {"data": "candidate_passport_no", 'orderable': false, 'title': 'Passport'},
//                {"data": "offer_letters", "title": "Visa Status", render: function (data, full, row) {
//                        var html = '';
//                        if ('SELECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
//                        }
//                        if ('APPLIED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
//                        }
//                        if ('APPROVED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
//                        }
//                        if ('REJECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
//                        }
//                        if ('WAITLISTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
//                        }
//                        if ('DEFERMENT_APPLIED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
//                        }
//                        return html;
//                    }
//                },
                {data: "created_by_agent", title: "Agent/Created by", orderable: false},
                {"data": null, title: 'Action', 'orderable': false, render: function (data, full, row) {
                        return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'' + visaType + '\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a> <a href="javascript:;" onclick="deleteCandidateVisa(this)" data-id="' + btoa(row.candidate_visa_uuid) + '" title="Archive" class="btn m-1 btn-xs btn-outline-danger"><i class="fa fa-ban"></i></a>';
                    }
                }
            ];
            break;
        case 'REJECTED':
            $("#visa-add-button").hide();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                 {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "candidate_passport_no", 'title': 'Passport', 'orderable': false},
                {"data": "visa_status_type", 'title': 'Visa Status', 'orderable': false, render: function (data, full, row) {
                        return data != null ? camelize((data.toLowerCase()).split("_").join(" ")) : '';
                    }},
//                {"data": "offer_letters", "title": "Visa Status", render: function (data, full, row) {
//                        var html = '';
//                        if ('SELECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-warning btn-block"><span class="d-inline">' + data.SELECTED + '</span> Selected</button>';
//                        }
//                        if ('APPLIED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.APPLIED + '</span> Applied</button>';
//                        }
//                        if ('APPROVED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-success btn-block"><span class="d-inline">' + data.APPROVED + '</span> Approved</button>';
//                        }
//                        if ('REJECTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-danger btn-block"><span class="d-inline">' + data.REJECTED + '</span> Rejected</button>';
//                        }
//                        if ('WAITLISTED' in data) {
//                            html += '<button class="btn-none btn btn-xs btn-info btn-block"><span class="d-inline">' + data.WAITLISTED + '</span> WaitListed</button>';
//                        }
//                        if ('DEFERMENT_APPLIED' in data) {
//                            html += '<button class="btn btn-xs btn-primary btn-block"><span class="d-inline">' + data.DEFERMENT_APPLIED + '</span> Deferment Applied</button>';
//                        }
//                        return html;
//                    }
//                },
                {data: "created_by_agent", title: "Agent/Created by", orderable: false},
                {"data": null, title: 'Action', 'orderable': false, render: function (data, full, row) {
                        return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'' + visaType + '\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a> ' + ($.inArray(role, ['admin']) != -1 ? '<a href="javascript:;" onclick="deleteCandidateVisa(this)" data-id="' + btoa(row.candidate_visa_uuid) + '" title="Archive" class="btn m-1 btn-xs btn-outline-danger"><i class="fa fa-ban"></i></a>' : '');
                    }
                }
            ];
            break;
        default :
            $("#visa-add-button").hide();
            return [
                {"data": "id", name: "id", 'title': '#ID', 'orderable': false, render: function (data, full, row) {
                        return (row.fee_paid == 'YES' ? '<i style="position: absolute;left: 0;font-size:20px;margin-top: -15px;" class="fa fa-check-circle text-success" aria-hidden="true"></i>' : '') + ' #SID-' + data;
                    }
                },
                {"data": "candidate_name", 'title': 'Name', 'orderable': false},
                {"data": "candidate_dob", 'title': 'DOB', 'orderable': false},
                 {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
                {"data": "candidate_passport_no", 'title': 'Passport', 'orderable': false},
            ];
    }

}

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