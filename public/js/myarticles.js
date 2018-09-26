console.log('js loaded');
// Grab the articles as a json
$.getJSON("savedarticles", data => {
    console.log(data)
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log(data[i])
      let card = $('<div class="card" style="width: 36rem;" />');
      let cardBody = $('<div class="card-body" />');
      let cardTitle = $('<h5 class="card-title">');
      cardTitle.text(data[i].title);
      let cardArticleLink = $('<a class="card-link">Article Link</a>');
      cardArticleLink.attr('href', data[i].link);
      let cardNoteLink = $('<button class="btn btn-success float-right note-btn">New Note</button>'); 
      cardNoteLink.attr('data-id', data[i]._id)
      let notes = $('<ul class="list-group list-group-flush">');
      for (note in data[i.note]) {
        console.log(note);
        let noteInstance = $('<li class="list-group-item"></li>');
        noteInstance.text(note.body);
        notes.append(noteInstance);
      }
      cardBody.append([cardTitle, cardArticleLink, cardNoteLink]);
      card.append([cardBody, notes]);
      $('#articles').append(card);
  }
}); 

 
$(document).on('click', ".note-btn", function() {
  var thisId = $(this).attr("data-id");
  let miniForm = $('<form/>');
  let textbox = $('<textarea class="form-control" rows="5"></textarea>');
  let noteSubmit = $('<button class="btn btn-primary float-right note-submit" type="submit">Save</button>');
  noteSubmit.attr('data-id', thisId);
  miniForm.append([textbox, noteSubmit]);
  $(this).parent().append(miniForm);
});


$(document).on('click', ".note-submit", function(e) {
  e.preventDefault();
  var thisId = $(this).attr("data-id");
  let noteText = $(this).parent().find("textarea").val();
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId + "/comments",
    data: {
      body: noteText
    }
  }).then(data => {
    console.log(data);
  })
})

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});


  