const electronApp = require('electron').remote;
const dialog = electronApp.dialog;
const fs = require('fs');

console.log('hey');

document.getElementById('save-file').addEventListener('click', saveFile);

function saveFile() {
  dialog
    .showSaveDialog((fileName) => {
      console.log(fileName);
      if (fileName === undefined) {
        alert('Please specify a name for the file');
      }
    })
    .then((fileName) => {
      console.log(fileName);
      const content = document.getElementById('invisible').innerHTML;
      fs.writeFile(fileName.filePath, content, (err) => {
        if (err) console.error(err);
        alert('Your file has been saved.');
      });
    });
}
