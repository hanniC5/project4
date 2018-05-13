
const emotionApp = {};

emotionApp.emotions = {};
emotionApp.attributes = {};

emotionApp.userImage = '';
emotionApp.userName = '';
emotionApp.highestEmotion = '';
emotionApp.secHighestEmotion = '';

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
	emotionApp.rankEmotions();
	emotionApp.setSong(emotionApp.highestEmotion);
	emotionApp.setNews(emotionApp.highestEmotion);
	emotionApp.setBackground(emotionApp.highestEmotion, emotionApp.secHighestEmotion);
};

//function getting attribute data and putting into attribute object 
emotionApp.getAttributes = function(res) {
	const face = res[0];
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
	emotionApp.setAge();
	emotionApp.setSmile();
};

emotionApp.rankEmotions = function () {
	const sortable = [];
	for (emotion in emotionApp.emotions) {
		sortable.push([emotion, emotionApp.emotions[emotion]])
	}
	const highestToLowest = sortable.sort((arr1, arr2) => {
		return arr1[1] < arr2[1];
	})
	const highEmo = highestToLowest[0];
	const secHighEmo = highestToLowest[1];
	emotionApp.highestEmotion = highEmo[0];
	emotionApp.secHighestEmotion = secHighEmo[0];
}

//function that take the user inputs and gets them into global variables to be used
emotionApp.userInputs = function() {
	$('form').on('submit', (e) => {
		e.preventDefault();
		emotionApp.userName = $('input[name=name]').val();
		console.log(emotionApp.userName);
		emotionApp.userImage = $('input[name=imagePath]').val();
		emotionApp.processImage(emotionApp.userImage);
		emotionApp.userInfo(emotionApp.userName, emotionApp.userImage);
		$('.wrapper').fadeOut();
	});
};

//function putting image into div for profile pic and user name onto screen in proper HTML locations
emotionApp.userInfo = function(name, image) {
	$('.userName').text(name);
	$('#userImg').attr('src',image);
};

//function changing user background based on the emotion rating
emotionApp.setBackground = function(emotion1, emotion2) {
	const highest = emotion1;
	const secHighest = emotion2;
	$('.bg-light').css('background', bgLight[highest]) ;
	$('.bg-dark').css('background', bgDark[secHighest]) ;
};
//function changing user news story based on emotion rating
emotionApp.setNews =function(emotions) {
	const newsRef = emotions;
	$('.newsLink').attr('href', newsItems[newsRef].url);
	$('.newsHeadline').text(newsItems[newsRef].headline);
	$('.newsImg').attr('src', newsItems[newsRef].photo);
	$('.newsSource').text(newsItems[newsRef].source);
};
//function changing user song recommendation 
emotionApp.setSong = function(emotions) {
		const songRef = emotions;
		$('.songRec').html(playlists[songRef]);
};

//function changing user age based on age from emotionApp.attributes object
emotionApp.setAge = function() {
	$('.age').text(emotionApp.attributes.age);
};


//function changing user smile rating based on emotionApp.attributes
emotionApp.setSmile = function() {
	let smileRating = Math.round(emotionApp.attributes.smile * 100);
	$('.smile').text(smileRating);
};



//generate profile function to call the above

// INIT FUNCTION
emotionApp.init = function(){
	// userInputs runs on submit
	emotionApp.userInputs();

}

// DOCUMENT READY
$(function(){
	emotionApp.init();

}); 

















