const KB = 1024;
const MB = KB*KB;
const GB = KB*MB;

const supported_extensions = ["jpg",
    "jpeg","png","gif","bmp","tiff",
    "svg","webp","ico","heif","avif",
    "JPEG","PNG","GIF","BMP","TIFF",
    "SVG","WEBP","ICO","HEIF","AVIF",
    "JPG"];

const AVAIL_SPACE = "available_space";
const size_suffix = "&&fileSize";

const total_space = 10*MB;
let available_space;

const size_to_string = size_bytes => {
    if(size_bytes/GB>1){
        return `${(size_bytes/GB).toFixed(1)} GB`;
    }
    if(size_bytes/MB>1){
        return `${(size_bytes/MB).toFixed(1)} MB`;
    }
    if(size_bytes/KB>1){
        return `${(size_bytes/KB).toFixed(1)} KB`;
    }
    return `${size_bytes} Bytes`;
}

const sizeKey = fileName => `${fileName}${size_suffix}`;

const setAvailableSpace = num => localStorage.setItem(AVAIL_SPACE,num);

const setBarWidth = () => {
    let percentage = 100*(total_space-available_space)/total_space;
    document.getElementsByClassName("gradient-bar")[0].setAttribute("style",`width:${percentage}%`);
}

const updateUsed = () =>document.getElementById("used-space").innerText = size_to_string(total_space - available_space);

const updateRemaining = () => {
    const num_and_unit = size_to_string(available_space).split(" ");
    document.getElementById("remaining-space").innerHTML = 
    `${num_and_unit[0]} <span>${num_and_unit[1]} left</span>`;
}

const updateHTML =() => {
    setBarWidth();
    updateRemaining();
    updateUsed();
}


const removeFile = fileName => {
    localStorage.removeItem(fileName);
    let size = localStorage.getItem(sizeKey(fileName))
    available_space += parseInt(size);
    setAvailableSpace(available_space);
    localStorage.removeItem(sizeKey(fileName));
    htmlNode = document.getElementById(fileName);
    htmlNode.parentNode.removeChild(htmlNode);
}

const Initialize = e => {
    document.getElementById("max-capacity").innerText = size_to_string(total_space);
    available_space = Number(localStorage.getItem(AVAIL_SPACE))
    if(available_space == null){
        available_space = total_space;
    }
    updateHTML();
    for(let i = 0; i<localStorage.length;i++){
        let key = localStorage.key(i);
        if(key.split(size_suffix).length == 1 && key !== AVAIL_SPACE ){
            append_file_name(key);
        }
    }
}

const openUploadMenu = e => document.getElementById("upload-input").click();

const append_file_name = fileName => {
    const newNameElement = document.createElement('span');
    newNameElement.className = "uploaded-item icon-img";
    newNameElement.innerHTML = `${fileName} <span class="remove-file-span" id=${fileName}-span>&#11036</span>`;
    newNameElement.id = fileName;
    document.getElementById("file-names-container").append(newNameElement);
    document.getElementById(`${fileName}-span`).addEventListener("click",()=>{
        removeFile(fileName);
        updateHTML();
    });
}

const onInput = e => {
    const {files} = e.target;
    let all_files_valid = true;
    let required_space = 0;
    for(let i = 0; i< files.length;i++){
        const file_ext = files[i].name.split(".")[1];
        if((supported_extensions.includes(file_ext))==false){
            alert(`${file_ext} File format isn't supported`);
            all_files_valid = false;
            break;
        }
        else{
            required_space+=files[i].size;
        }
    }
    
    if(all_files_valid){
        if(available_space < required_space){
            alert("There is not enough space on the disk");
            return;
        }
        available_space -= required_space;
        setAvailableSpace(available_space);
        for(let i = 0; i< files.length;i++){
            let file_size = localStorage.getItem(sizeKey(files[i].name)); 
            if(file_size){
                removeFile(files[i].name);
                updateHTML();
            }
            localStorage.setItem(files[i].name,files[i]);
            localStorage.setItem(sizeKey(files[i].name),files[i].size);
            append_file_name(files[i].name);
        }
        updateHTML();
    }
};