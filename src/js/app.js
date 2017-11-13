/* global document */
(function wikipediaViewer() {
  const inputField = document.getElementById('js_userInput');
  const submitButton = document.getElementById('js_userSubmit');
  const validationContainer = document.getElementById('js_validationMessage');
  const searchResultContainer = document.getElementById('js_showResult');

  function createElement(elementName, textContent, className) {
    const element = document.createElement(elementName);
    if (textContent !== undefined) {
      const text = document.createTextNode(textContent);
      element.appendChild(text);
    }
    if (className !== undefined) {
      element.classList.add(className);
    }
    return element;
  }

  function answerIntoDOM(answer) {
    const id = answer.query.pageids[0];
    const title = answer.query.pages[id].title;
    const extract = answer.query.pages[id].extract;
    console.log(extract);
  }

  function checkForSuccess(answer) {
    switch (answer.query.pageids[0]) {
      case '-1': {
        searchResultContainer.innerHTML = 'Your search was not successfull. Please try another query';
        break;
      }
      default: {
        answerIntoDOM(answer);
      }
    }
  }
  function requestArticle(input) {
    const searchQuery = input.toLowerCase();
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&uselang=de&prop=extracts%7Cinfo&indexpageids=1&titles=${searchQuery}&exintro=1&explaintext=1&inprop=url&origin=*`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function request() {
      if (this.readyState === 4 && this.status === 200) {
        const requestAnswer = JSON.parse(this.responseText);
        checkForSuccess(requestAnswer);
      }
    };
    xhr.send();
  }
  function validateUserInput() {
    const input = inputField.value;
    switch (input) {
      case '':
        inputField.setCustomValidity('Your search can\'t be empty');
        validationContainer.textContent = inputField.validationMessage;
        break;

      default:
        inputField.value = '';
        requestArticle(input);
    }
  }
  function clearValidationMessage() {
    validationContainer.innerHTML = '';
  }
  submitButton.addEventListener('click', validateUserInput);
  inputField.addEventListener('focus', clearValidationMessage);
}());
