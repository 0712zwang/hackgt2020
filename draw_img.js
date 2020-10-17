/*import * as posenet from '@tensorflow-models/posenet';

import Stats from 'stats.js'*/
import {drawBoundingBox, drawKeypoints, drawSkeleton, toggleLoadingUI, tryResNetButtonName, tryResNetButtonText, updateTryResNetButtonDatGuiCss} from './utils.js';


function drawOnImage() {
	var flipHorizontal = false;

	var imageElement = document.getElementById('test_image');

	posenet.load().then(
		function(net) {
  			const pose = net.estimateSinglePose(
  				imageElement, {
    				flipHorizontal: true
  				});
  			return pose;
		}).then(function(pose){
  			console.log(pose);
		}
	)
}
