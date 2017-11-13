/* global document */
(function wikipediaViewer() {
  const inputField = document.getElementById('js_userInput');
  const submitButton = document.getElementById('js_userSubmit');
  const validationContainer = document.getElementById('js_validationMessage');

  function validateUserInput() {
    const input = inputField.value;
    switch (input) {
      case '':
        inputField.setCustomValidity('Your search can\'t be empty');
        validationContainer.textContent = inputField.validationMessage;
        break;
      default:
        inputField.value = '';
        console.log('would be searching now');
    }
  }
  function clearValidationMessage() {
    validationContainer.innerHTML = '';
  }
  submitButton.addEventListener('click', validateUserInput);
  inputField.addEventListener('focus', clearValidationMessage);
}());
