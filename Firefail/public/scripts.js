function pull() {
  var input = document.getElementById("searchField").value;
  document.getElementById("title").innerHTML = input;
  changePage("index.html");
  }

function search(){

}

function changePage(url) {
  window.location.href = url;
}
