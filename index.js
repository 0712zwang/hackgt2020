import {bindPage} from './video'

client_vid = null

function updateFile() {
	client_vid = document.getElementById('client_vid').value
}

function poseEstimate() {
  	bindPage()
}