// declare constants
const video = document.querySelector("video");

/// load all model
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startVideo); // start the video function

/// start using the webcam
function startVideo() {
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        error => console.error(error) // log the error in case of an error
    );
}

// start detecting faces ones the camera motion is detected (playing)
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions()
        const resizeDetections = faceapi.resizeResults(detections, displaySize);
        // clear the canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        /*
        *
        * Draw the detection on the video
        * draw more details
        * */
        console.log(detections);
        faceapi.draw.drawDetections(canvas, resizeDetections); // detect face
        faceapi.draw.drawFaceLandmarks(canvas, resizeDetections); // detect face features, eyes, mouths etc
        faceapi.draw.drawFaceExpressions(canvas, resizeDetections); // detect emotions
    }, 100);
});