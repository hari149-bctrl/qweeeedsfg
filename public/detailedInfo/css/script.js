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
          editor1: createEditor("editor1", `selector { 
    property: value;
}`),
          editor2: createEditor("editor2", `h1 { 
    color: blue;
}`),
          editor3: createEditor("editor3", `p { 
    font-size: 20px; 
}`),
          editor4: createEditor("editor4", `<p style="color: green;">This is green text.</p>`),
          editor5: createEditor("editor5", `<style>
    h1 { 
        color: red;
    }
</style>`),
          editor6: createEditor("editor6", `p { 
    color: orange;
}`),
          editor7: createEditor("editor7", `<link rel="stylesheet" href="styles.css">`),
          editor8: createEditor("editor8", `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First CSS Page!</title>
    
    <style>
        body {
            background-color: lightblue;
            font-family: Arial, sans-serif;
            text-align: center;
        }

        h1 {
            color: darkblue;
            border-bottom: 2px solid darkblue;
            padding-bottom: 10px;
            display: inline-block;
        }

        p {
            color: darkred;
            font-size: 20px;
        }
    </style>
</head>
<body>

    <h1>Welcome to My CSS World! 🚀</h1>
    <p>This is a simple example of a styled webpage using CSS.</p>

</body>
</html>
`),
  
  
  
  
  
      };
  
    window.copyCode = function (editorId) {
        navigator.clipboard.writeText(editors[editorId].getValue()).then(() => {
            const copyBtn = document.querySelector(`#${editorId}`).closest(".code-wrapper").querySelector(".copy-btn img");
            copyBtn.src = "../../Images/Code/copied.png";
            setTimeout(() => {
                copyBtn.src = "../../Images/Code/copy.png";
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
  