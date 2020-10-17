client_vid = null

function updateFile() {
	client_vid = document.getElementById('client_vid').value
}

function poseEstimate() {
	var flipHorizontal = false;

	var imageElement = document.getElementById('test_vid');

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