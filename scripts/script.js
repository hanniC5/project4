
const emotionApp = {};

emotionApp.emotions = {};
emotionApp.attributes = {};

emotionApp.userImage = '';
emotionApp.userName = '';

//function making ajax call to API to analyze the user image and give data back 
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
		emotionApp.getEmotions(response);
		emotionApp.getAttributes(response);
		console.log(emotionApp.emotions);
	})
	.fail( function(response){ 
		console.log(response);
		alert("File path not recognized, please try again!");
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
	$('form').on('submit', (e) => {
		e.preventDefault();
		emotionApp.userName = $('input[name=name]').val();
		console.log(emotionApp.userName);
		emotionApp.userImage = $('input[name=imagePath]').val();
		emotionApp.processImage(emotionApp.userImage);
		emotionApp.userInfo(emotionApp.userName, emotionApp.userImage);
	});
};

//function switching screens on submit: izmodal plugin

//function putting image into div for profile pic and user name onto screen in proper HTML locations
emotionApp.userInfo = function(name, image) {
	$('.userName').text(name);
	$('#userImg').attr('src',image);
};
//function changing user greeting font based on ___ rating
//function changing user background based on the ___rating
//function changing user news story based on ____rating
//function changing user song recommendation 
//function changing user age based on age from emotionApp.attributes object
//function changing user smile rating based on emotionApp.attributes

//generate profile function to call the above

// INIT FUNCTION
emotionApp.init = function(){
	emotionApp.userInputs();
}

// DOCUMENT READY
$(function(){
	emotionApp.init();

}); 

















