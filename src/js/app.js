/* global document */
(function wikipediaViewer() {
  const inputField = document.getElementById('js_userInput');
  const submitButton = document.getElementById('js_userSubmit');
  const validationContainer = document.getElementById('js_validationMessage');
  const searchResultContainer = document.getElementById('js_showResult');
  const arrowToTop = document.getElementById('js_arrowTop');
  // create Elements
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
  // clear the DOM of the searchResultContainer
  function clearDOM() {
    searchResultContainer.innerHTML = '';
  }
  // Write all Wikipedia entries into the DOM
  function answerIntoDOM(answer) {
    clearDOM();
    const headingForSearchResult = createElement('h2', 'Your results:', 'titleForResult');
    searchResultContainer.appendChild(headingForSearchResult);
    const keyArray = Object.keys(answer.query.pages); // array of keys to get access to the nested objects, which are dynamic integers
    for (let i = 0; i < keyArray.length; i += 1) {
      const id = keyArray[i];
      const title = answer.query.pages[id].title;
      const extract = answer.query.pages[id].extract;
      const urlToArticle = answer.query.pages[id].fullurl;
      const heading = createElement('h3', title);
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
  // check if the ajax request answer contains wikipedia entries
  function checkForSuccess(answer) {
    switch (answer.query) {
      case undefined:
      {
        searchResultContainer.innerHTML = 'Your search was not successfull. Please try another query \u{1f605}';
        break;
      }
      default:
      {
        answerIntoDOM(answer);
      }
    }
  }
  function callOnNotSuccessful() {
    const paragraphForFailMessage = createElement('p', 'Oops, something went wrong \u{1f633}. Please try again.');
    searchResultContainer.appendChild(paragraphForFailMessage);
  }
  // make ajax call to the wikipedia api
  function requestArticle(input) {
    const searchQuery = input.toLowerCase();
    const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=search&prop=extracts|info&inprop=url&exintro&explaintext&exlimit=max&gsrsearch=${searchQuery}&origin=*`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function request() {
      if (this.readyState === 4 && this.status === 200) {
        const requestAnswer = JSON.parse(this.responseText);
        checkForSuccess(requestAnswer);
      } else {
        callOnNotSuccessful();
      }
    };
    xhr.send();
  }
  // checks if the user has actually submitted a not empty string
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
  // clears the validation message of former non-valid requests
  function clearValidationMessage() {
    validationContainer.innerHTML = '';
  }
  // fixed header on scroll down
  function showTitleOnScrollDown() {
    const header = document.getElementById('js_header');
    const HeaderBottomPosition = header.offsetTop + header.offsetHeight;
    if (window.scrollY >= HeaderBottomPosition) {
      header.classList.add('fixedHeader');
    } else {
      header.classList.remove('fixedHeader');
    }
  }
  // show an arrow to top on scroll down
  function showArrowToTopOnScrollDown() {
    const header = document.getElementById('js_header');
    const HeaderBottomPosition = header.offsetTop + header.offsetHeight;
    if (window.scrollY >= HeaderBottomPosition) {
      arrowToTop.classList.remove('hide');
    } else {
      arrowToTop.classList.add('hide');
    }
  }
  // Smooth scrolling
  // https://stackoverflow.com/questions/1144805/scroll-to-the-top-of-the-page-using-javascript-jquery
  function scrollToTop() {
    const positionOnPage = document.documentElement.scrollTop || document.body.scrollTop;
    if (positionOnPage > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, positionOnPage - (positionOnPage / 3));
    }
  }
  // focus effect when input is focused
  function makeFocusEffect() {
    document.body.classList.add('focus');
  }
  // removes focus effect when input is leaved
  function removeFocusEffect() {
    document.body.classList.remove('focus');
  }

  submitButton.addEventListener('click', validateUserInput);
  inputField.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      validateUserInput();
    }
  });
  inputField.addEventListener('focus', clearValidationMessage);
  inputField.addEventListener('focus', makeFocusEffect);
  inputField.addEventListener('blur', removeFocusEffect);
  window.addEventListener('scroll', showTitleOnScrollDown);
  window.addEventListener('scroll', showArrowToTopOnScrollDown);
  arrowToTop.addEventListener('click', scrollToTop);
}());
