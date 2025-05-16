document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded");
    fetchAllFiles();
    fetchDataFromMongo();
});

const fileContainer = document.getElementById('fileContainer');
const linksRight = document.querySelector('.linksRight')
let dataFolders;
let dataFiles = [];
async function fetchDataFromMongo() {
    try {
        let response = await fetch('/materials/folders');
        let data = await response.json();
        console.log(data);

        data.forEach(d => {
            const div = document.createElement('div');
            div.className = 'link-container';
            div.textContent = d.folderName;

            div.addEventListener('click', async () => {
                console.log('Clicked:', d.folderName);
                console.log("dataFiles:", dataFiles);
                
                document.querySelector('.rightMainContainer').classList.remove('hidden');
                linksRight.textContent = ''; // Clear previous content
            
                const abc = dataFiles.filter(file => file.folderName.includes(d.folderName));
            
                abc.forEach(ab => {
                    const a = document.createElement('a');
                    a.className = 'rightLinks';
                    a.textContent = ab.fileName;
                    a.href = ab.fileLink;
                    linksRight.appendChild(a);
                    const br = document.createElement('br');
                    linksRight.appendChild(br);
                });
            });
            

            fileContainer.appendChild(div);
        });
    }catch(err){
        console.log(err);
    }
}

async function fetchAllFiles(){
    try{
        let res = await fetch(`/folder/files/`);
        let data = await res.json();
        console.log(data);
        dataFiles = data;
    }
    catch(err){
        console.log(err);
    }
}

function closeRightContainer(){
    console.log('btn clicked');
    document.querySelector('.rightMainContainer').classList.add('hidden')
}