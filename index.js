/*NOTE: the size of the files extracted from the <input type="file"> element
            is measured in Bytes. Thus, all convertions from Bytes, to KiloBytes, MegaBytes 
            and so on must take that into account. */

const MILLION = 1000*1000;
const total_space = 5*MILLION;/*in KB units. I will pretend I only have 1GB,
Otherwise it will be annoying to test what happens when I reach the limit of space available.*/
const total_space_gb = total_space/MILLION; // 1GB ~ 10^6 KB, thus in this case, it should be 0.1GB
let available_space = total_space - 0;//KB

/* a simple arrow function to translate space measured in KB to GB. */
const kb_to_gb = space => space/MILLION;

/* This is the event handler I wrote for the onload event for the body. That is to say,
this method runs when the body of the HTML document has done loading.
Will check for previously uploaded files, even after a refresh. */
const Initialize = e => {
    document.getElementById("max-capacity").innerText = `${total_space_gb} MB`;
    if(localStorage.getItem("available_space")== null){
        available_space = total_space;
    }
    else{
        available_space = parseInt(localStorage.getItem("available_space"));
        console.log("extracted available space from localstorage...");
        console.log(available_space);
    }
    let percentage = 100*(total_space-available_space)/total_space;
    console.log("percentage = "+percentage);
    document.getElementsByClassName("gradient-bar")[0].setAttribute("style",`width:${percentage}%;`);
    if (localStorage.length > 1){
        console.log(`Local storage kept the following files:`);
    }
    /* checks the localstorage for all previously uploaded images */
    for(let i = 0; i<localStorage.length;i++){
        let key = localStorage.key(i);
        console.log(key);
    }
    console.log(`done loading uploaded images from local storage. remaining: ${available_space}`);
}

/* Event handler for clicking the upload files button.
triggers the click event for the <input type="file"> element. */
const openUploadMenu = e => document.getElementById("upload-input").click();

const supported_extensions = ["jpg","jpeg","png","gif","JPG","JPEG","PNG","GIF"];

/* This is the event handler for when the user has finished selecting files to upload.  */
const onInput = e => {
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
        console.log(`The required space is: ${required_space}KB,
        the available: ${available_space}KB.The total space: ${total_space_gb}GB`);
        if(available_space < required_space){
            console.error("There is not enough space on the disk");
            return;
        }
        available_space -= required_space;
        for(let i = 0; i< files.length;i++){
            console.log(files[i]);
            localStorage.setItem(files[i].name,files[i]);
        }
        localStorage.setItem("available_space",String(available_space));
        let percentage = 100*(total_space-available_space)/total_space;
        document.getElementsByClassName("gradient-bar")[0].setAttribute("style",`width:${percentage}%`);
    }

};