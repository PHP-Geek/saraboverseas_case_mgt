var axios = require('axios');
var visaDatatable = $('#archived-visa-datatable').DataTable({
    "processing": true,
    "serverSide": true,
    "ajax": {
        "url": baseUrl + "/v1/ajax/case-management/visa-datatable/archived",
        "type": "POST",
        'data': function (d) {
            d._token = $('meta[name="csrf-token"]').attr('content');
        }
    },
    "columns": [
        {data: "id", visible: false},
        {"data": "id", name: "id", 'title': '#ID', orderable: false, render: function (data, full, row) {
                return '#SID-' + data;
            }
        },
        {"data": "candidate_name", 'title': 'Name', orderable: false},
        {"data": "candidate_dob", 'title': 'DOB', orderable: false},
         {"data": "candidate_visa_country", 'title': 'Country', 'orderable': false, render: function (data, full, row) {
                        return '<span class="' + (data.toLowerCase()) + '">' + data + '</span>'
                    }},
        {"data": "candidate_passport_no", 'title': 'Passport', orderable: false},
//        {"data": null, title: 'Action', render: function (data, full, row) {
//                return '<a href="javascript:;" onclick="viewCandidateVisa(this,\'study\')" data-id="' + btoa(row.candidate_visa_uuid) + '" class="btn m-1 btn-xs btn-outline-success"><i class="fa fa-eye"></i></a>';
//            }
//        }
    ]
});
