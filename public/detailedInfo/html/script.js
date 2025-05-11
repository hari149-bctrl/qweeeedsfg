document.addEventListener("DOMContentLoaded", function () {
  function showContent(sectionId, updateURL = true) {
      // Remove 'active' class from all sidebar buttons
      document.querySelectorAll('.nav-item').forEach(button => {
          button.classList.remove('active');
      });

      // Add 'active' class to the clicked button
      const activeButton = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
      if (activeButton) {
          activeButton.classList.add('active');
      } else {
          console.warn("No matching .nav-item found for section:", sectionId);
      }

      // Hide all content sections smoothly
      document.querySelectorAll('.content-section').forEach(section => {
          section.style.opacity = 0;
          setTimeout(() => {
              section.classList.remove('active');
              section.style.display = "none";
          }, 300);
      });

      // Show the selected content smoothly
      setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
              section.style.display = "block";
              setTimeout(() => {
                  section.classList.add('active');
                  section.style.opacity = 1;
              }, 50);
          }
      }, 350);

      // Store selection in localStorage
      localStorage.setItem('lastActiveSection', sectionId);

      // Update URL only if not triggered by `hashchange`
      if (updateURL && window.location.hash !== `#${sectionId}`) {
          history.pushState(null, null, `#${sectionId}`);
      }
  }

  function checkURLHash() {
      const hash = window.location.hash.substring(1); // Remove #
      const lastSection = localStorage.getItem('lastActiveSection');

      if (hash) {
          showContent(hash, false); // Show the section from the hash
      } else {
          // No hash in URL → Show first sidebar item
          const firstNavItem = document.querySelector('.nav-item');
          if (firstNavItem) {
              const firstSection = firstNavItem.getAttribute('data-section');
              showContent(firstSection, false);
          }
      }
  }

  checkURLHash(); // Run once when the page loads

  window.addEventListener("hashchange", checkURLHash);

  document.querySelectorAll('.nav-item').forEach(button => {
      button.addEventListener('click', function () {
          const sectionId = this.getAttribute('data-section');
          showContent(sectionId);
      });
  });
});

















// code block
require.config({
    paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }
});

require(["vs/editor/editor.main"], function () {
    monaco.editor.defineTheme("hackthebox", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "keyword", foreground: "C586C0", fontStyle: "bold" },
            { token: "attribute.name", foreground: "9CDCFE" },
            { token: "attribute.value", foreground: "CE9178" },
            { token: "string", foreground: "CE9178" },
            { token: "comment", foreground: "6A9955", fontStyle: "italic" },
            { token: "number", foreground: "B5CEA8" }
        ],
        colors: {
            "editor.background": "#0B0F19",
            "editor.foreground": "#D4D4D4",
            "editor.lineHighlightBackground": "#1E1E2E",
            "editorLineNumber.foreground": "#5F6870",
            "editor.selectionBackground": "#264F78"
        }
    });
    
    




    function createEditor(id, initialValue) {
        return monaco.editor.create(document.getElementById(id), {
            value: initialValue,
            language: "html",
            theme: "hackthebox",
            fontSize: 16,
            automaticLayout: true,
            accessibilitySupport: "off",
            scrollBeyondLastLine: false,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
        });
    }

    const editors = {
        editor1: createEditor("editor1", `<!DOCTYPE html>
<html>
    <head>
        <title>My First Page</title>
    </head>
    <body>
        <h1>Hello, HTML!</h1>
        <p>This is my first webpage. 🚀</p>
    </body>
</html>`),
        editor2: createEditor("editor2", `<!DOCTYPE html>
<html>
    <head>
        <title>My First Page</title>
    </head>
    <body>
        <h1>Hello, HTML!</h1>
        <p>This is my first webpage. 🚀</p>
    </body>
</html>`),
        editor3: createEditor("editor3", `<body>
  <h1>Hello, world!</h1>
  <p>Welcome to my website.</p>
</body>
`),
editor4: createEditor("editor4", `<style>
h1 {
  color: blue;
}
</style>
<body>
    <h1>Hello, world!</h1>
</body>`),
editor5: createEditor("editor5", `<button onclick="alert('Hello!')">Click me!</button>`),
editor6: createEditor("editor6", `<meta charset="UTF-8">`),
editor7: createEditor("editor7", `<p>Hello, world!</p>  
<!-- This is a note for myself: Add an image below -->
<img src="../../Images/Brainy voyage LOGO_processed.png">
`),
editor8: createEditor("editor8", `<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>

<p>This is a paragraph of text.</p>

<p><b>Bold text</b></p>
<p><i>Italic text</i></p>
<p><u>Underlined text</u></p>
<p><s>Strikethrough text</s></p>

<p>H<sub>2</sub>O (Subscript)</p>
<p>x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup> (Superscript)</p>

<p>Line break below:<br>New line starts here.</p>

<hr>

<pre>
    This is preformatted text.
    It preserves spaces and line breaks.
</pre>`),


editor9: createEditor("editor9", `<a href="https://brainyvoyage.com">Click Here</a>`),
editor10: createEditor("editor10", `<a href="https://brainyvoyage.com" target="_blank">BrainyVoyage (New Tab)</a>`),
editor11: createEditor("editor11", `<a href="https://brainyvoyage.com" target="_blank" rel="noopener noreferrer">BrainyVoyage (New Tab)</a>`),
editor12: createEditor("editor12", `<a href="mailto:brainyvoyage.complaints@gmail.com">Send an Email</a>
<a href="tel: 911">Call Mom</a>`),
editor13: createEditor("editor13", `<ul>
  <li>Apples 🍏</li>
  <li>Bananas 🍌</li>
  <li>Chocolates 🍫</li>
</ul>
`),
editor14: createEditor("editor14", `<ol>
  <li>Wake up ⏰</li>
  <li>Brush teeth 🦷</li>
  <li>Eat breakfast 🍞</li>
</ol>
`),
editor15: createEditor("editor15", `<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language – the code for making websites.</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets – the code for making websites look cool!</dd>
</dl>
`),
editor16: createEditor("editor16", `<ul>
  <li>Fruits 🍎  
    <ul>
      <li>Apples 🍏</li>
      <li>Bananas 🍌</li>
    </ul>
  </li>
  <li>Snacks 🍪  
    <ul>
      <li>Chips 🍟</li>
      <li>Chocolate 🍫</li>
    </ul>
  </li>
</ul>`),
editor17: createEditor("editor17", `<img src="cat.jpg" alt="A cute cat">`),
editor18: createEditor("editor18", `<img src="cat.jpg" srcset="cat.jpg 1024w, cat.jpg 600w, cat.jpg 300w" alt="A beautiful landscape">
<p>Change the layout size, The image size also chnages accordingly</p>
`),
editor19: createEditor("editor19", `<video controls width="400">
  <source src="video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
`),
editor20: createEditor("editor20", `<audio controls>
  <source src="song.mp3" type="audio/mp3"> 
  Your browser does not support the audio tag.
</audio>
`),
editor21: createEditor("editor21", `<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  allowfullscreen>
</iframe>
`),
editor22: createEditor("editor22", `<table>
  <tr>
    <td>🍏 Apple</td>
    <td>10</td>
  </tr>
  <tr>
    <td>🍌 Banana</td>
    <td>5</td>
  </tr>
</table>
`),
editor23: createEditor("editor23", `<table>
  <tr>
    <th>Fruit</th>
    <th>Quantity</th>
  </tr>
  <tr>
    <td>🍏 Apple</td>
    <td>10</td>
  </tr>
  <tr>
    <td>🍌 Banana</td>
    <td>5</td>
  </tr>
</table>
`),
editor24: createEditor("editor24", `<table>
  <caption>Fruit Inventory</caption>
  <tr>
    <th>Fruit</th>
    <th>Quantity</th>
  </tr>
  <tr>
    <td>🍏 Apple</td>
    <td>10</td>
  </tr>
  <tr>
    <td>🍌 Banana</td>
    <td>5</td>
  </tr>
</table>
`),
editor25: createEditor("editor25", `<table>
  <tr>
    <th colspan="2">Fruits Inventory</th>
  </tr>
  <tr>
    <td>🍏 Apple</td>
    <td>10</td>
  </tr>
  <tr>
    <td>🍌 Banana</td>
    <td>5</td>
  </tr>
</table>
`),
editor26: createEditor("editor26", `<style>
  table {
    border-collapse: collapse;
    width: 50%;
  }
  th, td {
    border: 2px solid black;
    padding: 10px;
    text-align: center;
  }
  th {
    background-color: yellow;
  }
</style>

<table>
  <tr>
    <th>Fruit</th>
    <th>Quantity</th>
  </tr>
  <tr>
    <td>🍏 Apple</td>
    <td>10</td>
  </tr>
  <tr>
    <td>🍌 Banana</td>
    <td>5</td>
  </tr>
</table>
`),
editor27: createEditor("editor27", `<form>
  <!-- Input fields go here -->
</form>
`),
editor28: createEditor("editor28", `<form>
  <input type="text" placeholder="Enter your name">
</form>
`),
editor29: createEditor("editor29", `<form>
  <label for="username">Your Name:</label>
  <input type="text" id="username">
</form>
`),
editor30: createEditor("editor30", `<form>
  <label for="message">Your Message:</label><br>
  <textarea id="message" rows="4" cols="30"></textarea>
</form>
`),
editor31: createEditor("editor31", `<form>
  <label for="fruit">Choose a fruit:</label>
  <select id="fruit">
    <option>🍎 Apple</option>
    <option>🍌 Banana</option>
    <option>🍉 Watermelon</option>
  </select>
</form>
`),
editor32: createEditor("editor32", `<form>
  <p>Pick your favorite pet:</p>
  <input type="radio" id="dog" name="pet">
  <label for="dog">🐶 Dog</label>

  <input type="radio" id="cat" name="pet">
  <label for="cat">🐱 Cat</label>
</form>
`),
editor33: createEditor("editor33", `<form>
  <p>What do you like?</p>
  <input type="checkbox" id="pizza">
  <label for="pizza">🍕 Pizza</label>

  <input type="checkbox" id="icecream">
  <label for="icecream">🍦 Ice Cream</label>
</form>
`),
editor34: createEditor("editor34", `<form>
  <button type="submit">Submit</button>
</form>
`),
editor35: createEditor("editor35", `<input type="text" required>`),
editor36: createEditor("editor36", `<input type="text" pattern="[0-9]+" title="Only numbers allowed">`),
editor37: createEditor("editor37", `<div class="header">Welcome!</div>
<div class="nav">Menu</div>
<div class="content">Main Content</div>
<div class="footer">Contact Us</div>
`),
editor38: createEditor("editor38", `<header>Welcome!</header>
<nav>Menu</nav>
<main>Main Content</main>
<footer>Contact Us</footer>`),
editor39: createEditor("editor39", `<header>
  <h1>Welcome to My Website</h1>
</header>`),
editor40: createEditor("editor40", `<nav>
  <a href="home.html">Home</a>
  <a href="about.html">About</a>
</nav>`),
editor41: createEditor("editor41", `<main>
  <h2>About Me</h2>
  <p>I love coding and building websites!</p>
</main>`),
editor42: createEditor("editor42", `<section>
  <h2>Our Services</h2>
  <p>We build amazing websites!</p>
</section>`),
editor43: createEditor("editor43", `<article>
  <h2>Breaking News</h2>
  <p>The sun is shining today! ☀️</p>
</article>`),
editor44: createEditor("editor44", `<aside>
  <h3>Related Posts</h3>
  <p>Learn more about Semantic HTML!</p>
</aside>`),
editor45: createEditor("editor45", `<footer>
  <p>© 2025 My Website</p>
</footer>`),
editor46: createEditor("editor46", `<img src="dog.jpg" alt="A happy golden retriever dog">`),
editor47: createEditor("editor47", `<img src="dog.jpg" alt="Image123">`),
editor48: createEditor("editor48", `<button aria-label="Close menu">❌</button>`),
editor49: createEditor("editor49", `<a href="help.html" title="Go to Help Page">Help</a>`),
editor50: createEditor("editor50", `<input type="text" id="email" aria-describedby="emailHelp">
<p id="emailHelp">Enter a valid email (e.g., name@example.com)</p>`),
editor51: createEditor("editor51", `&lt;h1&gt;Hello&lt;/h1&gt;`),
editor52: createEditor("editor52", `&amp;`),
editor53: createEditor("editor53", `&quot;Hello&quot; 
&apos;World&apos;`),
editor54: createEditor("editor54", `Hello&nbsp;&nbsp;&nbsp;World!`),
editor55: createEditor("editor55", `&copy;   &trade;   &reg;`),
editor56: createEditor("editor56", `&plus;   &minus;   &times;   &divide;`),
editor57: createEditor("editor57", `&rarr;   &larr;   &uarr;   &darr;`),
editor58: createEditor("editor58", `&euro;   &pound;   &yen;   &dollar;`),
editor59: createEditor("editor59", `<form action="submit.php">
  <input type="hidden" name="userID" value="12345">
  <input type="text" name="name" placeholder="Enter your name">
  <button type="submit">Submit</button>
</form>`),
editor60: createEditor("editor60", `<form action="upload.php" method="post" enctype="multipart/form-data">
  <label for="file">Upload your picture:</label>
  <input type="file" id="file" name="profilePic">
  <button type="submit">Upload</button>
</form>`),
editor61: createEditor("editor61", `<label for="city">Choose a city:</label>
<input list="cities" id="city" name="city">

<datalist id="cities">
  <option value="New York">
  <option value="London">
  <option value="Tokyo">
  <option value="Paris">
</datalist>
`),
editor62: createEditor("editor62", `<form>
  <fieldset>
    <legend>Personal Information</legend>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
  </fieldset>
  
  <button type="submit">Submit</button>
</form>`),
editor63: createEditor("editor63", `<label for="progress">Uploading:</label>
<progress id="progress" value="50" max="100"></progress>`),
editor64: createEditor("editor64", `<label for="battery">Battery Level:</label>
<meter id="battery" value="0.7" min="0" max="1"></meter>`),
editor65: createEditor("editor65", `<canvas id="myCanvas" width="200" height="200"></canvas>

<script>
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 100, 100); // (x, y, width, height)
</script>`),
editor66: createEditor("editor66", `<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" stroke="blue" stroke-width="3" fill="lightblue" />
</svg>`),
editor67: createEditor("editor67", `<img src="funny.gif" alt="Funny Animation">`),
editor68: createEditor("editor68", `<button onclick="getLocation()">Find My Location</button>
<p id="output"></p>

<script>
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        document.getElementById("output").innerHTML = 
          "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
      });
    } else {
      document.getElementById("output").innerHTML = "Geolocation is not supported!";
    }
  }
</script>`),
editor69: createEditor("editor69", `<img id="dragItem" src="image.jpg" draggable="true" width="100">

<div id="dropZone" style="width:200px; height:200px; border:2px dashed #000;">
  Drop Here!
</div>
<style>
#dragItem {
  cursor: grab;
  border: 2px solid #000;
  border-radius: 8px;
  transition: transform 0.2s;
}

#dragItem:active {
  cursor: grabbing;
  transform: scale(1.1);
}

#dropZone {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  color: #555;
  background-color: #f9f9f9;
  border: 2px dashed #000;
  border-radius: 10px;
  transition: background-color 0.3s, border-color 0.3s;
}

#dropZone.dragover {
  background-color: #d1ffd1;
  border-color: #0a0;
}
</style>
<script>
  let dragItem = document.getElementById("dragItem");
let dropZone = document.getElementById("dropZone");

// Handle drag start
dragItem.ondragstart = (event) => {
  event.dataTransfer.setData("text", event.target.id);
  setTimeout(() => event.target.style.opacity = "0.5", 0); // Slight fade effect when dragging
};

// Handle drag end
dragItem.ondragend = () => {
  dragItem.style.opacity = "1"; // Restore opacity after dragging
};

// Allow drop
dropZone.ondragover = (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover"); // Add visual cue
};

// Handle drag leave (when dragged away from drop zone)
dropZone.ondragleave = () => {
  dropZone.classList.remove("dragover"); // Remove visual cue
};

// Handle drop
dropZone.ondrop = (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover"); // Remove visual cue
  let data = event.dataTransfer.getData("text");
  let draggedElement = document.getElementById(data);
  event.target.appendChild(draggedElement);
  draggedElement.style.opacity = "1"; // Restore opacity after drop
};
</script>`),
editor70: createEditor("editor70", `<input type="text" id="nameInput" placeholder="Enter your name">
<button onclick="saveName()">Save Name</button>
<p id="display"></p>

<script>
  function saveName() {
    let name = document.getElementById("nameInput").value;
    localStorage.setItem("username", name);
    document.getElementById("display").innerHTML = "Saved: " + name;
  }
</script>`),





    };

    window.copyCode = function (editorId) {
        navigator.clipboard.writeText(editors[editorId].getValue()).then(() => {
            document.querySelector(`#${editorId}`).closest(".code-wrapper").querySelector(".copy-btn").innerText = "✅ Copied!";
            setTimeout(() => {
                document.querySelector(`#${editorId}`).closest(".code-wrapper").querySelector(".copy-btn").innerText = "📋 Copy";
            }, 2000);
        }).catch(err => console.error("Error copying text:", err));
    };

    window.runCode = function (editorId) {
        const code = editors[editorId].getValue();
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write(code);
        newTab.document.close();
    };
});








// table codes
function copyTagToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied: ${text}`);
    });
}
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", function() {
      this.parentElement.scrollTo({
          left: this.offsetLeft - this.parentElement.offsetWidth / 2 + this.offsetWidth / 2,
          behavior: "smooth"
      });
  });
});
