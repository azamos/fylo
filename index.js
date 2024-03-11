/*NOTE: the size of the files extracted from the <input type="file"> element
            is measured in Bytes. Thus, all convertions from Bytes, to KiloBytes, MegaBytes 
            and so on must take that into account. */

const KB = 1024;
const MB = KB*KB;
const GB = KB*MB;

const total_space = 5*MB;/*measured in Byte units.*/
let available_space = total_space-0;//Bytes

/**
 * 
 * @param {int} size_bytes 
 * @returns {string} - a string representing the most fitting unit convertion of size_bytes
 */
function size_to_string(size_bytes){
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

/**
 * 
 * @param {Event} e 
 * @returns {void} - this body onload event handler updates
 *  the html elements representing the remaining space.
 */

function updateRemaining(){
    const num_and_unit = size_to_string(available_space).split(" ");
    document.getElementById("remaining-space").innerHTML = 
    `${num_and_unit[0]} <span>${num_and_unit[1]} left</span>`;
}

function Initialize(e){
    document.getElementById("max-capacity").innerText = size_to_string(total_space);
    if(localStorage.getItem("available_space")== null){/*Means no files were previously uploaded */
        available_space = total_space;
    }
    else{
        try{
            available_space = parseInt(localStorage.getItem("available_space"));
        }
        catch(err){
            available_space = total_space;
            console.error("Failed to convert available_space from string to integer");
        }
    }
    setBarWidth();
    updateRemaining();
    /* checks the localstorage for all previously uploaded images */
    for(let i = 0; i<localStorage.length;i++){
        let key = localStorage.key(i);
        //TODO: maybe do something with the image names later...
    }
}

/**
 * 
 * @param {*} e 
 * @returns {void} - This is an event handler for clicking the upload files button.
 * It triggers the click event for the <input type="file"> element.
 */
const openUploadMenu = e => document.getElementById("upload-input").click();

const supported_extensions = ["jpg","jpeg","png","gif","JPG","JPEG","PNG","GIF"];

/**
 * 
 * @param {*} e 
 * @returns {void} This is the event handler for when the user has finished selecting files to upload.
 * It checks if the selected files are in a vlid image format, and if there is enough space for them.
 * If all is ok, will upload and update the available space.
 */
function onInput(e){
    const {files} = e.target;/* extracting the FileList object from the Event object e */
    let all_files_valid = true;
    let required_space = 0;
    /* traversing the FileList object associated with the input element. */
    for(let i = 0; i< files.length;i++){
        const file_ext = files[i].name.split(".")[1];/* Extracting the file extension */
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
        for(let i = 0; i< files.length;i++){
            localStorage.setItem(files[i].name,files[i]);
        }
        localStorage.setItem("available_space",String(available_space));
        setBarWidth();
        updateRemaining();
    }

};

function setBarWidth(){
    let percentage = 100*(total_space-available_space)/total_space;
    document.getElementsByClassName("gradient-bar")[0].setAttribute("style",`width:${percentage}%`);
}