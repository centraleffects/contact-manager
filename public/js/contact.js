/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/contact.js":
/*!*********************************!*\
  !*** ./resources/js/contact.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Contains codes exclusive for Contacts
 */
(function ($) {
  var NewContactForm = $('#new-contact-form');
  var Contact = {
    init: function init() {
      Contact.getContacts();
      Contact.getContactRequest();
      Contact.getBlockedList();
      Contact.getAllUsers();
      $('.contact-menu a').on('click', function (e) {
        Contact.preventDefault(e);
        $('.contact-content').removeClass('show');
        $($(this).attr('href')).addClass('show');

        if ($(this).attr('href') == "#list") {
          //update list
          Contact.getContacts();
        }
      });
      $('.new-info').on('click', function (e) {
        Contact.preventDefault(e);
        $('.info-holder').append(Contact.newInfo($('.info-holder .form-group').length));
      });
      NewContactForm.on('change', '.info-type', function () {
        if ($(this).val() == 'other') {
          $(this).siblings('input').removeClass('hidden');
        } else {
          $(this).siblings('input').addClass('hidden');
        }
      }).on('submit', function (e) {
        Contact.preventDefault(e);
        Contact.ajax(APP_URL + '/api/' + 'contacts/new', function (data) {
          if (data.success) {
            alert('Request complete!');
            NewContactForm.trigger('reset');
          }
        }, $(this).serialize(), 'POST');
      }); // Delete a selected contact

      $('body').on('click', '.btn-delete', function () {
        if (confirm('Are you sure to delete this entry?')) {
          Contact.ajax(APP_URL + '/api/' + 'contacts/delete/' + $(this).data('id'), function (data) {
            if (data.success) {
              alert('Request complete!');
              Contact.getContacts();
            }
          }, {}, 'DELETE');
        }
      }) //display form to edit a contact
      .on('click', '.btn-edit', function (e) {
        Contact.displayUpdateForm($(this).data('id'));
      }) //block contact request
      .on('click', '.btn-block', function (e) {
        if (confirm('Are you sure to block this user?')) {
          Contact.ajax(APP_URL + '/api/' + 'contacts/block/' + $(this).data('id'), function (data) {
            if (data.success) {
              alert('Request complete!');
              Contact.getContactRequest();
            }
          });
        }
      }) // accept contact request
      .on('click', '.btn-accept', function (e) {
        if (confirm('Are you sure to accept this user?')) {
          Contact.ajax(APP_URL + '/api/' + 'contacts/accept/' + $(this).data('id'), function (data) {
            if (data.success) {
              alert('Request complete!');
              Contact.getContactRequest();
            }
          });
        }
      }) // add block 
      .on('click', '#btn-add-blocked', function (e) {
        Contact.ajax(APP_URL + '/api/' + 'contacts/blockedlist', function (data) {
          if (data.success) {
            alert('Request complete!');
            Contact.getBlockedList();
            $('#block-content').val('');
          }
        }, {
          'type': $('#block-type option:selected').val(),
          'content': $('#block-content').val()
        }, 'POST');
      }).on('click', '.btn-explore-add', function (e) {
        alert('Request complete!');
      });
      $('#search').on('keyup', function (e) {
        Contact.getContacts({
          search: $(this).val().trim()
        });
      });
    },
    getContacts: function getContacts() {
      var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Contact.ajax(APP_URL + '/api/' + 'contacts/list', function (contacts) {
        $('#contact-list').empty();
        $.each(contacts.data, function (i, c) {
          $('#contact-list').append($(Contact.listTemplateItem(c)));
        });
      }, search);
    },
    newInfo: function newInfo() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      index++;
      return $('<div class="form-group">\
				<label for="info">\
					<select class="info-type" name="info[' + index + '][type]">\
						<option value="email">Email</option>\
						<option value="mobile">Mobile</option>\
						<option value="tel">Tel</option>\
						<option value="fax">Fax</option>\
						<option value="work">Work</option>\
						<option value="address">Address</option>\
						<option value="other">Other</option>\
					</select>\
					<input type="text" class="hidden" \
					name="info[' + index + '][custom]" placeholder="custom"></span>\
				</label>\
				<input type="text" id="info" name="info[' + index + '][value]" class="form-control">\
			</div>');
    },
    preventDefault: function preventDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    /**
     * Create a custom AJAX request to always include our token
     */
    ajax: function ajax(url) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'functon(data){}';
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET';
      var response;
      var auth = window.Laravel.apiToken ? window.Laravel.apiToken : '';
      $.ajax({
        url: url,
        data: data,
        type: type,
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
        },
        success: callback,
        error: function error(request, status, _error) {
          alert('ERROR: ' + JSON.parse(request.responseText).message);
        }
      });
      return;
    },
    listTemplateItem: function listTemplateItem(contact) {
      return '<a href="#contact-info-' + contact.id + '" \
				data-toggle="collapse"   role="button" aria-expanded="false" \
				aria-controls="contact-info-' + contact.id + '" \
				class="list-group-item list-group-item-action">\
			' + contact.first_name + ' ' + contact.last_name + '</a>\
			<div class="card collapse" id="contact-info-' + contact.id + '">\
			  <div class="card-body">\
			   	' + Contact.listTemplateItemInfo(contact.info) + '\
			  	<br>\
			  	<p>' + contact.notes + '</p>\
			   	<div class="btn-group float-right" role="group">\
			   		<button type="button" class="btn btn-secondary btn-sm btn-edit"  data-id="' + contact.id + '">EDIT</button> \
			  		<button type="button" class="btn btn-secondary \
			  		btn-sm btn-delete" data-id="' + contact.id + '">DELETE</button>\
			  	</div>\
			  </div>\
			</div>\
			';
    },
    listTemplateItemInfo: function listTemplateItemInfo(infos) {
      str = '<ul class="list-group">';
      $.each(infos, function (i, info) {
        str += '<li class="list-group-item"><small>' + info.type + '</small><br>' + info.content + '</li>';
      });
      str += '</ul>';
      return str;
    },
    // display contact form for edit
    displayUpdateForm: function displayUpdateForm(contactId) {
      Contact.ajax(APP_URL + '/api/' + 'contacts/get/' + contactId, function (contact) {
        console.log(contact);
      });
    },
    // Get list of contact request
    getContactRequest: function getContactRequest() {
      var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Contact.ajax(APP_URL + '/api/' + 'contacts/request', function (requests) {
        $('#request-list').empty();
        $.each(requests.data, function (i, request) {
          $('#request-list').append($(Contact.requestTemplateItem(request)));
        });
      }, search);
    },
    requestTemplateItem: function requestTemplateItem(request) {
      return '<a href="#contact-info-' + request.id + '" \
				data-toggle="collapse"   role="button" aria-expanded="false" \
				aria-controls="contact-info-' + request.id + '" \
				class="list-group-item list-group-item-action">\
			' + request.user.first_name + ' ' + request.user.last_name + ' ' + (request.blocked_at ? '<span class="badge badge-danger float-right">BLOCKED</span>' : '') + '</a>\
			<div class="card collapse" id="contact-info-' + request.id + '">\
			  <div class="card-body">\
			  	<p>more info here.</p>\
			   	<div class="btn-group float-right" role="group">\
			   		<button type="button" class="btn btn-secondary btn-sm btn-accept" \
			   			data-id="' + request.id + '">ACCEPT</button> \
			  		<button type="button" class="btn btn-secondary \
			  			btn-sm btn-block" data-id="' + request.id + '" \
			  			data-user-id="' + request.user.id + '">BLOCK</button>\
			  	</div>\
			  </div>\
			</div>\
			';
    },
    // display blocked list
    getBlockedList: function getBlockedList() {
      var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Contact.ajax(APP_URL + '/api/' + 'contacts/blocked-list', function (lists) {
        $('#block-list').empty();
        $('#block-list').append($(Contact.listTemplateItemInfo(lists.data)));
      }, search);
    },
    // Get all list of users
    getAllUsers: function getAllUsers() {
      var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Contact.ajax(APP_URL + '/api/' + 'contacts/explore', function (lists) {
        $('#explore-list').empty();
        $('#explore-list').append($(Contact.listUsersTemplateItem(lists.data)));
      }, search);
    },
    listUsersTemplateItem: function listUsersTemplateItem(users) {
      str = '<ul class="list-group">';
      $.each(users, function (i, user) {
        str += '<li class="list-group-item">' + user.first_name + ' ' + user.last_name + '<buton class="btn btn-primary btn-sm float-right btn-explore-add" data-id="' + user.id + '">ADD</buton>';
        '</li>';
      });
      str += '</ul>';
      return str;
    } // Execute on DomReady

  };
  $(function () {
    Contact.init();
  });
})(jQuery);

/***/ }),

/***/ 1:
/*!***************************************!*\
  !*** multi ./resources/js/contact.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /media/rex/data/htdocs/contact-manager/resources/js/contact.js */"./resources/js/contact.js");


/***/ })

/******/ });