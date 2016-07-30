Handlebars.registerHelper('paragraphSplit', function(plaintext) {
  var i, output = '',
      lines = plaintext.split(/\r\n|\r|\n/g);
  for (i = 0; i < lines.length; i++) {
      if(lines[i]) {
          output += '<p>' + lines[i] + '</p>';
      }
  }
  return new Handlebars.SafeString(output);
});

$(document).ready(function(){

  var form_source   = $("#post-form").html();
  var form_template = Handlebars.compile(form_source);
  var form_source   = $("#user-login").html();
  var login_template = Handlebars.compile(form_source);
  var form_source   = $("#user-form").html();
  var user_template = Handlebars.compile(form_source);
  var source   = $("#note-template").html();
  var template = Handlebars.compile(source);

  var api_root = 'https://safe-bayou-88361.herokuapp.com/api/'

  function api_token(){
    sessionStorage.getItem('api_token')
  }

  function fetchData(){
    $.getJSON(api_root + 'notes', function(data){
      console.log(data)
      pageDisplay(data.notes)
    })
  }

  function pageDisplay(obj) {
    $.each(obj, function(i, note){
      var context = {
        title: note.title,
        body: note.body,
        tags: note.tags,
        author: note.user.username,
        created: moment(note.created_at).format('MMMM Do YYYY, h:mm:ss a')};
      var html = template(context)
      $('#notes').append(html)
    })
  }

  function noteForm() {
    $.post({
      url: api_root + "notes",
      data: {api_token: api_token(),
            title: $('note-title').val(),
            body: $('note-body').val(),
            author: $('note-author').val(),
            tags: $('note-tags').val()},
      success: function(note){
        console.log(note)
        $('#notes').prepend(note-template(note))
        $('#modalWindow').modal('hide')
      },
      error: function(note){
        console.log(note)
      }
    })
  }

  function createForm() {
    $.post({
      url: api_root + "users",
      data: {usrname: $('#user-username').val(),
        email: $('#user-email').val(),
        password: $('#user-password').val()},
      success: function(data){
        console.log(data)
        $('#modalWindow').modal(hide)
        },
      error: function(data){
        console.log(data)
        }
    })
  }

  function fillModal(template, context, title) {
    $('#modalWindow .modal-title').text(title || {})
    $('#modalWindow .modal-body').html(template(context || {}))
  }

  fetchData()

  $('#new-note').on('click', function(ev){
    fillModal(form_template)
    $('#modalWindow').modal('show')
  })

  $('#user-login').on('click', function(ev){
    fillModal(login_template)
    $('#modalWindow').modal('show')
  })

  $('#user-create').on('click', function(ev){
    fillModal(user_template)
    $('#modalWindow').modal('show')
  })

  $(document.body).on('submit', '#note-form', function(ev){
    ev.preventDefault()
    noteForm()
  })

  $(document.body).on('submit', '#user-login', function(ev){
    ev.preventDefault()
    loginForm()
  })

  $(document.body).on('submit', '#user-create', function(ev){
    ev.preventDefault()
    createForm()
  })

})
