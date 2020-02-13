const electron = require("electron");
const {ipcRenderer} = electron

const switch_light = document.getElementById('switch_light')
const slider = document.getElementById('bright:slider')
const vl = document.getElementById('vl')

ipcRenderer.send('req:bright')

let b = 0

switch_light.addEventListener('click', function(){
    ipcRenderer.send('switch')
})

ipcRenderer.on('bright', function(e ,value){
    slider.value = value
    vl.innerHTML = value
})

slider.oninput = function(){
    if(b == 0){
        b = 1
        setTimeout(function(){
            ipcRenderer.send('bright:lvl', slider.value)
            b = 0
        }, 500)
    }

    vl.innerHTML = slider.value
}
