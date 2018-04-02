
var CONFIG = {
  algorithmSpecification: {
    "iv": null,
    "v": 1,
    "iter": 10000,
    "ks": 128,
    "ts": 64,
    "mode": "ccm",
    "adata": "",
    "cipher": "aes",
    "salt": null,
    "ct": null,
  },
};

function InvalidQueryError(message) {
  this.name = 'InvalidQueryError';
  this.message = message || '';
}
InvalidQueryError.prototype = Object.create(Error.prototype);

function IncorrectPasswordError(message) {
  this.name = 'IncorrectPasswordError';
  this.message = message || '';
}
IncorrectPasswordError.prototype = Object.create(Error.prototype);

function packEncryptionData(data) {
  return data["iv"] + data["salt"] + data["ct"];
}

function unpackEncryptionData(data) {
  var parts = data.split("=");
  var initializationVector = parts[0] + "==";
  var salt = parts[2] + "=";
  var cipherText = parts[3] + "=";

  return objectAssign({}, {
    "iv": initializationVector,
    "salt": salt,
    "ct": cipherText,
  });
}

function decodeEncryptionData(data) {
  return atob(data);
}

function encodeEncryptionData(data) {
  return btoa(data);
}

function getBaseUrl() {
  var portComponent = '';
  // only add port component for non-standard ports
  if (
    window.location.port &&
    window.location.port != 80 &&
    window.location.port != 443
  ) {
    portComponent = ':' + window.location.port;
  }

  var pathComponent = window.location.pathname;
  if (pathComponent[0] != '/') {
    pathComponent = '/' + pathComponent;
  }

  return (
    window.location.protocol + '//' +
    (window.location.hostname || '') +
    portComponent + pathComponent
  );
}

function makeParcelUrl(parcel) {
  return getBaseUrl() + '?' + parcel;
}

function getParcelFromUrl() {
  var queryParts = window.location.search.split("?");
  if (queryParts.length >= 2) {
    return queryParts[1];
  }
  return false;
}

function encryptIntoParcel(message, password) {
  var encryptedData = sjcl.encrypt(password, message);
  var packedData = packEncryptionData(JSON.parse(encryptedData));
  return encodeEncryptionData(packedData);
}

function decryptParcel(parcel, password) {
  try {
    var packedData = decodeEncryptionData(parcel);
    var unpackedData = unpackEncryptionData(packedData);
    var algorithmSpecification = objectAssign({}, CONFIG.algorithmSpecification, unpackedData);
    var jsonAlgorithmSpecification = JSON.stringify(algorithmSpecification);
  } catch (e) {
    throw new InvalidQueryError();
  }

  try {
    return sjcl.decrypt(password, jsonAlgorithmSpecification);
  } catch (e) {
    // SJCL doesn't specify an error name if `decrypt` fails, so we need a
    // custom error object
    throw new IncorrectPasswordError();
  }
}

function encryptInput() {
  var password = getEncryptPassword();
  var message = getEncryptMessage();
  var decryptUrl = makeParcelUrl(encryptIntoParcel(message, password));
  setEncryptOutput(decryptUrl);
}

function decryptInput() {
  try {
    var message = decryptParcel(getParcelFromUrl(), getDecryptPassword());
  } catch (e) {
    if (e.name == 'InvalidQueryError') {
      showMessage(`Sorry, but the message you are trying to decode is not valid.`);
      return;
    } else if (e.name == 'IncorrectPasswordError') {
      showMessage(`Sorry, but the password you entered is incorrect.`);
      return;
    }
  }
  setDecryptedMessage(message);
  showDecryptOutputContainer();
}

function newMessage() {
  window.location.href = getBaseUrl();
}

function run() {
  if (getParcelFromUrl()) {
    showDecryptModule();
    showDecryptPasswordContainer();
  } else {
    showEncryptModule();
  }
}

function callOnEnter(event, f) {
  if (event.keyCode == 13) {
    f();
  }
}

function showMessage(message) {
  window.alert(message);
}

function showEncryptModule() {
  document.getElementById('encrypt-container').style.display = 'block';
  document.getElementById('encrypt-message').focus();
}

function showDecryptModule() {
  document.getElementById('decrypt-container').style.display = 'block';
}

function showDecryptPasswordContainer() {
  document.getElementById('decrypt-password-container').style.display = 'block';
  document.getElementById('decrypt-output').style.display = 'none';
  document.getElementById('decrypt-password').focus();
}

function showDecryptOutputContainer() {
  document.getElementById('decrypt-password-container').style.display = 'none';
  document.getElementById('decrypt-output').style.display = 'block';
}

function getDecryptPassword() {
  return document.getElementById('decrypt-password').value;
}

function setDecryptedMessage(message) {
  var elem = document.getElementById('decrypted-message');
  elem.value = message;
}

function setEncryptOutput(url) {
  var elem = document.getElementById('decrypt-link-text');
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild);
  }

  document.getElementById('encrypt-output').style.display = 'block';

  var linkText = document.createTextNode(url);
  elem.appendChild(linkText);
  elem.focus();
  elem.select();

  document.getElementById('decrypt-link').setAttribute('href', url);
}

function getEncryptPassword() {
  return document.getElementById('encrypt-password').value;
}

function getEncryptMessage() {
  return document.getElementById('encrypt-message').value;
}

window.addEventListener('load', function () {
  run();
});
