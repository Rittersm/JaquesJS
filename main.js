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
  var form_source   = $("#login-form").html();
  var login_template = Handlebars.compile(form_source);
  var form_source   = $("#user-form").html();
  var user_template = Handlebars.compile(form_source);
  var source   = $("#note-template").html();
  var template = Handlebars.compile(source);


  var api_root = 'https://safe-bayou-88361.herokuapp.com/api/'

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
        author: note.user.username || "Anonymous",
        created: moment(note.created_at).format('MMMM Do YYYY, h:mm:ss a')};
      var html = template(context)
      $('#notes').append(html)
    })
  }

  function noteForm() {
    $.post({
      url: api_root + "notes",
      data: {title: $('note-title').val(),
            body: $('note-body').val(),
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
      data: {username: $('#user-username').val(),
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
    $('#modalWindow .modal-title').text(title || "")
    $('#modalWindow .modal-body').html(template(context || {}))
  }

  fetchData()

  $('#new-note').on('click', function(ev){
    fillModal(form_template, "", "New Note")
    $('#modalWindow').modal('show')
  })

  $('#login-form').on('click', function(ev){
    fillModal(login_template, "", "Login")
    $('#modalWindow').modal('show')
  })

  $('#user-create').on('click', function(ev){
    fillModal(user_template, "", "New User")
    $('#modalWindow').modal('show')
  })


  $(document.body).on('submit', '#note-form', function(ev){
    ev.preventDefault()
    noteForm()
  })

  $(document.body).on('submit', '#login-form', function(ev){
    ev.preventDefault()
    loginForm()
  })

  $(document.body).on('submit', '#user-create', function(ev){
    ev.preventDefault()
    createForm()
  })

})
