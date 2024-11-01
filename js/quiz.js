const quizData = [
    ["What is the capital of France?", ["Berlin", "Madrid", "Paris"], 2, "img/nelly/IMG_3769.jpg"],
    ["Which planet is known as the Red Planet?", ["Earth", "Mars", "Jupiter"], 1, "img/nelly/FB_IMG_1443423702338.jpg"],
    ["Which element has the chemical symbol 'O'?", ["Oxygen", "Hydrogen", "Carbon"], 0, "img/nelly/20171030_185036.jpg"]
  ];
  
  
  let currentQuestion = 0;
  let correctAnswers = 0;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  
  function loadQuestion() {
    const questionContainer = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const feedback = document.getElementById('feedback');
    
    // Clear previous options and feedback
    optionsContainer.innerHTML = '';
    feedback.textContent = '';
    
    const currentQuiz = quizData[currentQuestion];
    
    questionContainer.textContent = currentQuiz[0];
    
    // Set background image (optional)
    document.body.style.backgroundImage = `url(${currentQuiz[3]})`;
  
    // Reset the next button
    document.getElementById('next-btn').disabled = true;
  
    currentQuiz[1].forEach((option, index) => {
      const button = document.createElement('button');
      button.textContent = option;
      button.onclick = () => checkAnswer(index);
      optionsContainer.appendChild(button);
    });
  }
  
  function checkAnswer(selected) {
    const correctAnswer = quizData[currentQuestion][2];
    const feedback = document.getElementById('feedback');
    
    // Show correct answer feedback
    if (selected === correctAnswer) {
      correctAnswers++;
      feedback.textContent = "Correct!";
      feedback.classList.add("correct");
      feedback.classList.remove("wrong");
    } else {
      feedback.textContent = `Wrong! The correct answer is "${quizData[currentQuestion][1][correctAnswer]}"`;
      feedback.classList.add("wrong");
      feedback.classList.remove("correct");
    }
  
    // Disable all buttons to prevent re-selecting
    const optionButtons = document.querySelectorAll('#options button');
    optionButtons.forEach(button => {
      button.disabled = true;
    });
  
    // Enable next button
    document.getElementById('next-btn').disabled = false;
  }
  
  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      // Show results after last question
      showResults();
    }
  }
  
  function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';  // Clear the container
  
    if (correctAnswers === quizData.length) {
      // Redirect to success page if all answers are correct
      window.location.href = "quiz_success.html";
    } else {
      const resultMessage = document.createElement('p');
      resultMessage.textContent = `You got ${correctAnswers} out of ${quizData.length} correct!`;
  
      const retryButton = document.createElement('button');
      retryButton.textContent = "Retry";
      retryButton.onclick = () => {
        // Reset state
        currentQuestion = 0;
        correctAnswers = 0;
  
        // Clear the container and repopulate with initial structure
        quizContainer.innerHTML = `
          <div id="question"></div>
          <div id="options"></div>
          <p id="feedback"></p>
          <button id="next-btn" disabled onclick="nextQuestion()">Next</button>
        `;
  
        // Reinitialize the quiz by loading the first question
        loadQuestion();
      };
  
      quizContainer.appendChild(resultMessage);
      quizContainer.appendChild(retryButton);
    }
  }
  
  
  // Drag-and-drop functionality for the quiz container
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - quizContainer.getBoundingClientRect().left;
    offsetY = e.clientY - quizContainer.getBoundingClientRect().top;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      quizContainer.style.left = `${e.clientX - offsetX}px`;
      quizContainer.style.top = `${e.clientY - offsetY}px`;
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  window.onload = loadQuestion;