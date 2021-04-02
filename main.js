let container = document.getElementsByClassName("questions")[0];

let totalPoints = questions.reduce(
	(previous, current) => previous + current.points,
	0
);

let pointsAccumulated = 0;

let positiveAnswers = []; // format: ["question-1", "question-4", ...]

let yesBar = document.getElementsByClassName("bar-yes")[0];
let noBar = document.getElementsByClassName("bar-no")[0];
let totalPercentageElement =
	document.getElementsByClassName("total-percentage")[0];

function updateScore(points) {
	pointsAccumulated += points;

	let totalPercentage = Math.ceil((pointsAccumulated / totalPoints) * 100);

	totalPercentage = Math.max(totalPercentage, 0);
	totalPercentage = Math.min(totalPercentage, 100);

	let span = totalPercentageElement.getElementsByTagName("span")[0];
	span.innerHTML = `&nbsp;${totalPercentage}%`;

	if (totalPercentage >= 50) {
		totalPercentageElement.classList.add("green-text");
		totalPercentageElement.classList.remove("red-text");
	} else {
		totalPercentageElement.classList.add("red-text");
		totalPercentageElement.classList.remove("green-text");
	}

	let noBarWidth = Math.round(100 - (totalPercentage * 2));

	noBarWidth = Math.max(noBarWidth, 0);

	noBar.style.width = `${noBarWidth}%`;

	let yesBarWidth = Math.round((totalPercentage - 50) * 2);

	yesBarWidth = Math.max(yesBarWidth, 0);

	yesBar.style.width = `${yesBarWidth}%`;
}

questions.forEach((question, index) => {
	let percentage = Math.ceil((question.points / totalPoints) * 100);

	let html = `
		<div class="question question-${index + 1}">
		<h2>${question.question}</h2>
		<div class="button-container">
			<button class="yes-button">Yes</button>
			<button class="no-button">No</button>
			<span class="percentage-positive green-text hide text-heavy">&nbsp;+${percentage}%</span>
			<span class="percentage-negative red-text hide text-heavy">&nbsp;+0%</span>
		</div>
		<div class="question-tips hide">
			<ul>
	`;

	question.tips.forEach(tip => {
		html += `
			<li>${tip}</li>
		`;
	});

	html += `
		</ul>
			</div>
		</div>
	`;

	container.insertAdjacentHTML("beforeend", html);

	let questionElement =
		document.getElementsByClassName(`question-${index + 1}`)[0];

	let yesButton =
		questionElement.getElementsByClassName("yes-button")[0];

	let noButton =
		questionElement.getElementsByClassName("no-button")[0];

	yesButton.addEventListener("click", () => {
		if (question.yesIsPositive) {
			yesButton.classList.add("green-background");
			onAnswerCorrect();
		} else {
			onAnswerWrong();
			yesButton.classList.add("red-background");
		}

		resetButtonColor(noButton);
	});

	noButton.addEventListener("click", () => {
		if (question.yesIsPositive) {
			onAnswerWrong();
			noButton.classList.add("red-background");
		} else {
			onAnswerCorrect();
			noButton.classList.add("green-background");
		}

		resetButtonColor(yesButton);
	});

	let percentagePositive =
		questionElement.getElementsByClassName("percentage-positive")[0];

	let percentageNegative =
		questionElement.getElementsByClassName("percentage-negative")[0];

	let questionTips =
		questionElement.getElementsByClassName("question-tips")[0];


	function onAnswerWrong() {
		percentageNegative.classList.remove("hide");
		percentagePositive.classList.add("hide");
		questionTips.classList.remove("hide");

		let i = positiveAnswers.indexOf(`question-${index + 1}`);

		if (i > -1) {
			positiveAnswers.splice(i, 1);
			updateScore(-1 * question.points);
		}
	}

	function onAnswerCorrect() {
		percentagePositive.classList.remove("hide");
		percentageNegative.classList.add("hide");
		questionTips.classList.remove("hide");

		let i = positiveAnswers.indexOf(`question-${index + 1}`);

		if (i < 0) {
			positiveAnswers.push(`question-${index + 1}`);
			updateScore(question.points);
		}
	}

	function resetButtonColor(button) {
		button.classList.remove("green-background", "red-background");
	}
});

updateScore(0);
