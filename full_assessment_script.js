document.addEventListener("DOMContentLoaded", function () {
	// Select all likert options
	const likertOptions = document.querySelectorAll(".likert-option");
	const progressBar = document.getElementById("progressBar");
	const submitButton = document.getElementById("submitAssessment");
	const consentCheckbox = document.getElementById("consentCheckbox");

	// Initialize response tracking
	let totalQuestions = document.querySelectorAll(".likert-scale").length;
	let answeredQuestions = 0;

	/*// Handle likert option selection -- this is commented out to avoid conflicts with the new code
	likertOptions.forEach((option) => {
		option.addEventListener("click", function () {
			// Get the parent scale
			const parentScale = this.parentElement;

			// Remove selected class from all options in this scale
			parentScale.querySelectorAll(".likert-option").forEach((opt) => {
				opt.classList.remove("selected");
			});

			// Add selected class to clicked option
			this.classList.add("selected");

			// Check if this question was already answered
			if (!parentScale.dataset.answered) {
				parentScale.dataset.answered = "true";
				answeredQuestions++;

				// Update progress bar
				const progress = (answeredQuestions / totalQuestions) * 100;
				progressBar.style.width = progress + "%";
			}
		});
	});*/

	// Use event delegation for likert options
	document.addEventListener("click", function (e) {
		if (e.target.classList.contains("likert-option")) {
			const parentScale = e.target.parentElement;

			// Remove selected class from all options in this scale
			parentScale.querySelectorAll(".likert-option").forEach((opt) => {
				opt.classList.remove("selected");
			});

			// Add selected class to clicked option
			e.target.classList.add("selected");

			// Debug: Log selection
			console.log("Selected value:", e.target.dataset.value);

			// Check if this question was already answered
			if (!parentScale.dataset.answered) {
				parentScale.dataset.answered = "true";
				answeredQuestions++;

				// Update progress bar
				const progress = (answeredQuestions / totalQuestions) * 100;
				if (progressBar) progressBar.style.width = progress + "%";
			}
        }
	});
	// Handle consent checkbox
	consentCheckbox.addEventListener("change", function () {
		submitButton.disabled = !this.checked;
	});

	// Handle form submission
	/*document.getElementById('personalityAssessment').addEventListener('submit', function(event) {
                event.preventDefault();
                
                const userName = document.getElementById('userName').value;
                const userEmail = document.getElementById('userEmail').value;
                
                if (!userName || !userEmail) {
                    alert('Please enter your name and email address.');
                    return;
                }
                
                if (answeredQuestions < totalQuestions) {
                    alert(`You've answered ${answeredQuestions} out of ${totalQuestions} questions. Please complete all questions to receive your personalized assessment.`);
                    return;
                }
                
                // Here you would normally send the data to your server
                // For this demo, we'll just show a success message
                alert('Thank you for completing the BE YOU Institute Personality Assessment! Your responses have been submitted successfully. You will receive your personalized results soon.');
                
                // Normally you would redirect to a thank you page or show the results
                // window.location.href = '/results-page'; (You will want to have the '/results-page.html' in your file repository)
            });*/

	// ...existing code...

	// Replace the form submission handler with this:
	document
		.getElementById("personalityAssessment")
		.addEventListener("submit", async function (event) {
			event.preventDefault();

			const userName = document.getElementById("userName").value;
			const userEmail = document.getElementById("userEmail").value;

			if (!userName || !userEmail) {
				alert("Please enter your name and email address.");
				return;
			}

			if (answeredQuestions < totalQuestions) {
				alert(
					`You've answered ${answeredQuestions} out of ${totalQuestions} questions. Please complete all questions to receive your personalized assessment.`
				);
				return;
			}

			// Gather responses
			const responses = {};
			document.querySelectorAll(".likert-scale").forEach((scale) => {
				const question = scale.dataset.question;
				const selected = scale.querySelector(".likert-option.selected");
				responses[question] = selected ? selected.dataset.value : "";
			});

			// POST to Google Apps Script Web App
            try {
                const response = await fetch(
									"https://script.google.com/macros/s/AKfycbw4d47eokx2hZYPR1x6QZ4PVCxsEE0y1aJ5qe3dUuMyfrXqN34akUVUWl-smwYxh5wm/exec", // <-- Replace this with your actual Web App URL
									{
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({
											name: userName,
											email: userEmail,
											work_habits_1: responses.work_habits_1 || "",
											work_habits_2: responses.work_habits_2 || "",
											work_habits_3: responses.work_habits_3 || "",
											achievement_1: responses.achievement_1 || "",
											achievement_2: responses.achievement_2 || "",
											openness_1: responses.openness_1 || "",
											self_confidence_1: responses.self_confidence_1 || "",
											self_confidence_2: responses.self_confidence_2 || "",
											conscientiousness_1: responses.conscientiousness_1 || "",
											conscientiousness_2: responses.conscientiousness_2 || "",
											patience_1: responses.patience_1 || "",
											assertiveness_1: responses.assertiveness_1 || "",
											assertiveness_2: responses.assertiveness_2 || "",
											competitiveness_1: responses.competitiveness_1 || "",
											extroversion_1: responses.extroversion_1 || "",
											cooperativeness_1: responses.cooperativeness_1 || "",
											cooperativeness_2: responses.cooperativeness_2 || "",
											temperament_1: responses.temperament_1 || "",
											interaction_1: responses.interaction_1 || "",
											temperament_2: responses.temperament_2 || "",
											comfort_alone: responses.comfort_alone || "",
											comfort_discussions: responses.comfort_discussions || "",
											comfort_changes: responses.comfort_changes || "",
											comfort_leading: responses.comfort_leading || "",
										}),
									}
								);
                const result = await response.json();
                if (result.result === "success") {
                    alert(
                        "Thank you for completing the BE YOU Institute Personality Assessment! Your responses have been submitted successfully. You will receive your personalized results soon."
                    );
                    // Optionally reset the form here
                } else {
                    alert(
                        "There was an error submitting your assessment. Please try again."
                    );
                }
            } catch (error) {
                alert("There was an error connecting to the server. Please try again.");
            }
        });

	// Animate sections on scroll
	const animateSections = function () {
		const sections = document.querySelectorAll(".form-section");

		sections.forEach((section) => {
			const sectionTop = section.getBoundingClientRect().top;
			const windowHeight = window.innerHeight;

			if (sectionTop < windowHeight * 0.85) {
				section.style.opacity = "1";
			}
		});
	};

	// Run animation on load and scroll
	animateSections();
	window.addEventListener("scroll", animateSections);
});
