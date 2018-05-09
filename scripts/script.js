
const emotionApp = {};

const userImage = 'http://hackeryou.com/wp-content/uploads/2014/01/2018-team-danny-patton-1-500x462.jpg';

// in this case, whatever userImage is will be passed as picture to processImage function

emotionApp.processImage = (picture) => {

	// Request parameters.
	const params = {
		"returnFaceId": "false",
		"returnFaceLandmarks": "false",
		"returnFaceAttributes": "age,headPose,smile,glasses,emotion,hair,occlusion,accessories",
	};

	const endpoint = `https://westus.api.cognitive.microsoft.com/face/v1.0/detect?`;

	const fullParams = $.param(params);

	console.log(endpoint + fullParams);

	$.ajax({
		url: endpoint + fullParams,
		headers: {
			"Content-type": "application/json",
			"Ocp-Apim-Subscription-Key": "ae8660b6e2024756a9ee315fa85db616"
		},
		type: "POST",
		data: `{"url": "${picture}"}`,

	}).then( function(response){

			console.log(response);

	});
} 








// INIT FUNCTION
emotionApp.init = function(){

	emotionApp.processImage(userImage);

}

// DOCUMENT READY
$(function(){

emotionApp.init();

}); 