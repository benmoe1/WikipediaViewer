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
  function clearDOM() {
    searchResultContainer.innerHTML = '';
  }
  function answerIntoDOM(answer) {
    clearDOM();
    const keyArray = Object.keys(answer.query.pages);
    for (let i = 0; i < keyArray.length; i += 1) {
      const id = keyArray[i];
      const title = answer.query.pages[id].title;
      const extract = answer.query.pages[id].extract;
      const urlToArticle = answer.query.pages[id].fullurl;
      const heading = createElement('h2', title);
      const paragraphForExtract = createElement('p', extract, undefined);
      const buttonToFullArticle = createElement('div');
      const linkToArticle = createElement('a', 'See full');
      const divider = createElement('hr');
      linkToArticle.setAttribute('href', urlToArticle);
      buttonToFullArticle.classList.add('button', 'success');

      buttonToFullArticle.appendChild(linkToArticle);
      searchResultContainer.appendChild(heading);
      searchResultContainer.appendChild(paragraphForExtract);
      searchResultContainer.appendChild(buttonToFullArticle);
      searchResultContainer.appendChild(divider);
    }
  }

  function checkForSuccess(answer) {
    switch (answer.query) {
      case undefined: {
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
    const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=search&prop=extracts|info&inprop=url&exintro&explaintext&exlimit=max&gsrsearch=${searchQuery}&origin=*`;
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
        inputField.setCustomValidity('Your search can\'t be empty \u{1f633}');
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
