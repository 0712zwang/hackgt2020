import {drawBoundingBox, drawKeypoints, drawSkeleton, isMobile} from './utils.js'

const videoWidth = 600;
const videoHeight = 500;

const defaultQuantBytes = 2;
const defaultMobileNetMultiplier = 0.75;
const defaultMobileNetStride = 16;
const defaultMobileNetInputResolution = 500;

const guiState = {
  	algorithm: 'single-pose',
  	input: {
    	architecture: 'MobileNetV1',
    	outputStride: defaultMobileNetStride,
    	inputResolution: defaultMobileNetInputResolution,
    	multiplier: defaultMobileNetMultiplier,
    	quantBytes: defaultQuantBytes
  	},
  	singlePoseDetection: {
    	minPoseConfidence: 0.1,
    	minPartConfidence: 0.5,
  	},
  	multiPoseDetection: {
    	maxPoseDetections: 5,
    	minPoseConfidence: 0.15,
    	minPartConfidence: 0.1,
    	nmsRadius: 30.0,
  	},
  	output: {
    	showVideo: true,
    	showSkeleton: true,
    	showPoints: true,
    	showBoundingBox: false,
  	},
  	net: null,
};

async function setupVideo() {
	const video = document.getElementById('test_vid');
  video.width = videoWidth;
  video.height = videoHeight;

  return new Promise(
		(resolve) => {
  		video.onloadeddata = () => {
    			resolve(video);
  		};
		});
}

async function loadVideo() {
  const video = await setupVideo();
  video.play();
  console.log("playing video")

  return video;
}

function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output_1');
  const ctx = canvas.getContext('2d');

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;
    const pose = await guiState.net.estimatePoses(video, {
      flipHorizontal: flipPoseHorizontal,
      decodingMethod: 'single-person'
    });
    console.log(pose)
    poses = poses.concat(pose);
    minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
    minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctx);
        }
      }
    });

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

export async function bindPage() {
  /*toggleLoadingUI(true);*/
  guiState.net = await posenet.load()

  console.log("net")
  console.log(guiState.net)

  let video;

  try {
    video = await loadVideo();
    console.log("video loaded")
  } catch (e) {
    console.log('this browser does not support video capture, or this device does not have a camera')
  }
  console.log(video)
  detectPoseInRealTime(video, guiState.net);

  var imageElement = document.getElementById('test_vid');

  let poses = []
  posenet.load().then(function(net) {
    const pose = net.estimateSinglePose(imageElement, {
      flipHorizontal: false
    });
    return pose;
  }).then(function(pose){
    poses.push(pose)
    console.log(pose);
  })

  poses.forEach(({score, keypoints}) => {
      console.log("drawing", score, keypoints)
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctx);
        }
      }
    });  
}

bindPage()