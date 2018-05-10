
const emotionApp = {};

emotionApp.emotions = {};

emotionApp.attributes = {};

emotionApp.userImage = '';
emotionApp.userName = '';

// in this case, whatever userImage is will be passed as picture to processImage function

emotionApp.processImage = (picture) => {
	const params = {
		"returnFaceId": "false",
		"returnFaceLandmarks": "false",
		"returnFaceAttributes": "age,headPose,smile,glasses,emotion,hair,occlusion,accessories",
	};
	const endpoint = `https://westus.api.cognitive.microsoft.com/face/v1.0/detect?`;
	const fullParams = $.param(params);
	$.ajax({
		url: endpoint + fullParams,
		headers: {
			"Content-type": "application/json",
			"Ocp-Apim-Subscription-Key": "ae8660b6e2024756a9ee315fa85db616"
		},
		type: "POST",
		data: `{"url": "${picture}"}`,
	})
	.then( function(response){
		// console.log(response);
		emotionApp.getEmotions(response);
		emotionApp.getAttributes(response);
		console.log(emotionApp.emotions);
	});
} 
//function getting the data into an emotion object store in emotionApp.emotions 
emotionApp.getEmotions = function(res) {
	const face = res[0];
	const emotions = face.faceAttributes.emotion;
	emotionApp.emotions = Object.assign(emotions);
};
//function getting attribute data and putting into attribute object 
emotionApp.getAttributes = function(res) {
	const face= res[0];
	const {age, smile, glasses} = face.faceAttributes;
	const {yaw} = face.faceAttributes.headPose;
	emotionApp.attributes.age = age;
	emotionApp.attributes.smile = smile;
	emotionApp.attributes.yaw = yaw;
	if (glasses === "NoGlasses") {
		emotionApp.attributes.glasses = false;
	} else {
		emotionApp.attributes.glasses = true;
	}
	console.log(emotionApp.attributes);
};
//function that take the user inputs and gets them into global variables to be used
emotionApp.userInputs = function() {
	$('form').on('submit', () => {
		emotionApp.userName = $('input[name=name]').val();
		console.log(emotionApp.userName);
		emotionApp.userImage = $('input[name=imagePath]').val();
		this.processImage(emotionApp.userImage);
	});
};

// INIT FUNCTION
emotionApp.init = function(){
	emotionApp.userInputs();
}

// DOCUMENT READY
$(function(){
	emotionApp.init();

}); 

















