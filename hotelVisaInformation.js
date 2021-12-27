var axios = require('axios');
var swal = require('sweetalert');
var hotelInformationDatatable;
$(function () {
    $("#hotelInformation-modal").find("#entry_date,#exit_date").datetimepicker({
        autoClose: true,
        scrollInput: false,
        format: 'd/m/Y',
        timepicker: false,
        yearStart: (new Date()).getFullYear() - 10,
        yearEnd: (new Date()).getFullYear(),
        maxDate: new Date()
    });
    hotelInformationDatatable = $('#hotelInformation-datatable').DataTable({
        "processing": true,
        searching: false,
        lengthChange: false,
        "serverSide": true,
        "ajax": {
            "url": baseUrl + "/v1/ajax/case-management/hotel-information/datatables",
            "type": "POST",
            'data': function (d) {
                d._token = $('meta[name="csrf-token"]').attr('content');
                d._candidate_visa_uuid = visaUuid;
            }
        },
        "columns": [
            {data: "id", orderable: false, visible: false},
            {"data": "visa_hotel_name", 'title': 'Hotel Name', orderable: false},
            {"data": "visa_hotel_place", 'title': 'Place', orderable: false},
            {"data": "visa_hotel_entry_date", 'title': 'Entry Date', orderable: false},
            {"data": "visa_hotel_exit_date", 'title': 'Exit Date', orderable: false},
            {"data": null, 'title': 'Action', orderable: false, render: function (data, full, row) {
                    return ' <a onclick="updateHotelInfoRow(\'' + row.hotel_information_uuid + '\')" href="javascript:;" class="m-1 btn btn-xs btn-outline-warning"><i class="fa fa-pencil-alt"></i></a> <a href="javascript:;" onclick="deleteHotelInfoRow(\'' + row.hotel_information_uuid + '\')" class="m-1 btn btn-xs btn-outline-danger"><i class="fa fa-trash"></i></a>';
                }
            }
        ],
    });
});

window.showAddHotelInfoModal = function () {
    $("#hotelInformation-modal").find('input:not(input[name=_token])').val('');
    $("#hotelInformation-modal").find('select').select2('val', null);
    $("#hotelInformation-modal").modal('show');
}

/**
 * delete hotelInformation row
 * @param {type} uuid
 * @returns {undefined}
 */
window.deleteHotelInfoRow = function (uuid) {
    swal({
        title: "Delete the record?",
        text: "Are you sure delete the record?",
        icon: "warning",
        buttons: true,
        dangerMode: false,
    })
            .then((willConfirm) => {
                if (willConfirm) {
                    axios.delete(baseUrl + '/v1/ajax/case-management/hotel-information/delete/' + uuid)
                            .then(function (response) {
                                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                                    $(".hotelInformation-ajax-response").html('<div class="alert alert-success justify-content-between">Deleted Successfully</span>' + alertClose() + '</div>');
                                    hotelInformationDatatable.draw();
                                } else {
                                    $(".hotelInformation-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            })
                            .catch(function (error) {
                                if ((error.response.data).hasOwnProperty('message')) {
                                    $(".hotelInformation-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                                } else {
                                    $(".hotelInformation-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                                }
                                $(window).unblock();
                            });
                }
            });
}

window.updateHotelInfoRow = function (id) {
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
    axios.get(baseUrl + '/v1/ajax/case-management/hotel-information/detail?uuid=' + id)
            .then(function (response) {
                if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                    $("#hotelInformation-modal").find('#hotel_information_uuid').val(response.data.data.hotel_information_uuid);
                    $("#hotelInformation-modal").find('#hotel_name').val(response.data.data.visa_hotel_name);
                    $("#hotelInformation-modal").find('#hotel_place').val(response.data.data.visa_hotel_place);
                    $("#hotelInformation-modal").find('#entry_date').val(response.data.data.visa_hotel_entry_date);
                    $("#hotelInformation-modal").find('#exit_date').val(response.data.data.visa_hotel_exit_date);
                    $("#hotelInformation-modal").modal('show');
                } else {
                    alert('Something went wrong');
                }
                $(window).unblock();
            })
            .catch(function (error) {
                if ((error.response.data).hasOwnProperty('message')) {
                    $(".hotelInformation-ajax-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                } else {
                    $(".hotelInformation-ajax-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                }
                $(window).unblock();
            });
}

$("#hotelInformation-form").validate({
    errorElement: "span",
    errorClass: "text-danger text-right d-block",
    ignore: [],
    rules: {
        hotel_name: {
            required: true
        },
        hotel_place: {
            required: true
        },
        entry_date: {
            required: true
        },
        exit_date: {
            dateGreaterThan: $("#hotelInformation-form").find("#entry_date")
        }
    },
    messages: {
        hotel_name: {
            required: "Hotel name is required"
        },
        hotel_place: {
            required: "Place is required"
        },
        entry_date: {
            required: "Entry date is required"
        },
        exit_date: {
            dateGreaterThan: "Exit date must be greater than entry date"
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
        axios.post(baseUrl + '/v1/ajax/case-management/hotel-information/store', $("#hotelInformation-form").serialize() + '&candidate_visa_uuid=' + visaUuid)
                .then(function (response) {
                    $(window).unblock();
                    if ((response.data).hasOwnProperty('code') && response.data.code == 'success') {
                        $("#hotelInformation-modal").modal('hide');
                        $(".hotelInformation-ajax-response").html('<div class="alert alert-success justify-content-between"><span class="d-inline-block">Sponsor Detail Updated Successfully.</span>' + alertClose() + '</div>');
                        hotelInformationDatatable.draw();
                    } else {
                        $(".hotelInformation-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">Something went wrong. Please try again</span>' + alertClose() + '</div>');
                    }
                })
                .catch(function (error) {
                    $(window).unblock();
                    if ((error.response.data).hasOwnProperty('message')) {
                        $(".hotelInformation-modal-response").html('<div class="alert alert-danger justify-content-between"><span class="d-inline-block">' + error.response.data.message + '</span>' + alertClose() + '</div>');
                    } else {
                        $(".hotelInformation-modal-response").html('<div class="alert alert-danger justify-content-between">Something went wrong</span>' + alertClose() + '</div>');
                    }
                });
    }
});