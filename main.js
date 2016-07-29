$(document).ready(function(){

  function fetchData(){
    $.getJSON('https://safe-bayou-88361.herokuapp.com/api/notes', function(data){
      console.log(data)
      pageDisplay(data.notes)
    })
  }

  var source   = $("#note-template").html();
  var template = Handlebars.compile(source);

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

  fetchData()

})
