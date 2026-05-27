// Универсальная навигация для всех подглав
(function() {
  var path = window.location.pathname;
  var parts = path.split("/");
  var currentFile = parts.pop();
  var currentChapterPath = parts.join("/");
  
  // Если мы в папке главы (есть файлы .html)
  if (currentChapterPath.includes("Часть_") && currentFile.endsWith(".html")) {
    // Загружаем список файлов из той же папки
    fetch(currentChapterPath + "/")
      .then(function(response) { return response.text(); })
      .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var links = doc.querySelectorAll("a");
        var siblings = [];
        for (var i = 0; i < links.length; i++) {
          var href = links[i].getAttribute("href");
          if (href && href.endsWith(".html") && !href.includes("..")) {
            siblings.push(href);
          }
        }
        siblings.sort();
        var idx = siblings.indexOf(currentFile);
        
        var navDiv = document.querySelector(".navigation");
        if (navDiv) {
          var prevLink = navDiv.querySelector(".nav-prev");
          var nextLink = navDiv.querySelector(".nav-next");
          
          if (idx > 0) prevLink.href = siblings[idx-1];
          else if (prevLink) prevLink.style.visibility = "hidden";
          
          if (idx < siblings.length-1) nextLink.href = siblings[idx+1];
          else if (nextLink) nextLink.style.visibility = "hidden";
        }
      })
      .catch(function() {
        // fallback — если не удалось прочитать папку
        var siblings = ["1_1_Определение_RAG_и_история.html", "1_2_Компоненты_RAG_системы.html", "1_3_Когда_RAG_нужен_а_когда_нет.html"];
        var idx = siblings.indexOf(currentFile);
        var navDiv = document.querySelector(".navigation");
        if (navDiv) {
          if (idx > 0) navDiv.querySelector(".nav-prev").href = siblings[idx-1];
          else navDiv.querySelector(".nav-prev").style.visibility = "hidden";
          if (idx < siblings.length-1) navDiv.querySelector(".nav-next").href = siblings[idx+1];
          else navDiv.querySelector(".nav-next").style.visibility = "hidden";
        }
      });
  }
})();
