"use strict";

// ***********************************************************
//*************************VARIABLES**************************
//************************************************************

const userURL = `http://mpp.erikpineiro.se/dbp/sameTaste/users.php`;

const pictureIDURL = `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=11&q=snow`;

const pictureURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/`;

let mainUserFavorites = [];
let userArray = [];
let arrayOfImages = [];
const mainUser = 21;
const testerUser = 666;
let selectedUser = mainUser;

// ***********************************************************
//*************************GRAB USERS**************************
//************************************************************

async function grabUsers() {
  const response = await fetch(userURL);
  const data = await response.json();

  return data.message;
}

setInterval(displayUsers, 30000);
displayUsers();

// ***********************************************************
//*************************LOADING SCREENS*********************
//************************************************************

//If local storage is empty then it will display a loading screen for the pictures while they are fetched from the API.
if (localStorage.length <= 0) {
  ("hej");
  loadingBarPaintingsWindow();
}

function loadingBarUserList() {
  let blackWindowWithText = document.createElement("div");
  blackWindowWithText.classList.add("loadingScreen");
  blackWindowWithText.innerHTML = `Loading`;

  document.querySelector("#listOfUsers").append(blackWindowWithText);

  setTimeout(function () {
    blackWindowWithText.remove();
  }, 2000);
}

function loadingBarPaintings(domElement) {
  let blackWindowWithText = document.createElement("div");
  blackWindowWithText.classList.add("loadingScreen");
  blackWindowWithText.innerHTML = `Loading`;

  domElement.append(blackWindowWithText);

  setTimeout(function () {
    blackWindowWithText.remove();
  }, 5000);
}

function loadingBarPaintingsWindow() {
  let blackWindowWithText = document.createElement("div");
  blackWindowWithText.classList.add("loadingScreen");
  blackWindowWithText.innerHTML = `Loading`;

  document.querySelector("#paintingWindow").append(blackWindowWithText);

  setTimeout(function () {
    blackWindowWithText.remove();
  }, 5000);
}

// ***********************************************************
//*************************TIMER********************
//** *********************************************************

//Creates a timer DOM with an interval that updates the dom every second, which after 30 seconds gets cleared.
function userListTimer() {
  let i = 29;
  let timer = document.createElement("div");
  timer.classList.add("timer");
  timer.innerHTML = `Time until refresh: ${i}`;
  let timerInterval = setInterval(() => {
    i--;
    timer.innerHTML = `Time until refresh: ${i}`;
  }, 1000);

  document.querySelector("#listOfUsers").append(timer);
  setTimeout(() => {
    clearInterval(timerInterval);
  }, 30000);
}

// ***********************************************************
//*************************USER PRINTS********************
//** *********************************************************

/*Gets the promise from grabUsers which contains an array of all the users, which then gets saved into a resolved array of users.
Separates main and tester users from the array with a filter after finding both objects and saving them in a variable. After which it takes all the info from the arrays and calls on crateUsers arrays with arguments from the variables or arrays containing user info. After which it calls on displayPictures to display paintings on load of website. 

*/
async function displayUsers() {
  document.querySelector("#listOfUsers").innerHTML = "";
  let arrayOfUsers = await grabUsers();
  userArray = arrayOfUsers;

  arrayOfUsers.sort((a, b) => a.alias > b.alias);
  loadingBarUserList();
  userListTimer();

  const mainUserFound = arrayOfUsers.find((user) => user.id == mainUser);
  mainUserFavorites = mainUserFound.favs;

  const mainTesterFound = arrayOfUsers.find((user) => user.id == testerUser);

  let intTesterFavs = mainTesterFound.favs.map((element) =>
    parseInt(element, 10)
  );
  const mainTesterCommonFavs = intTesterFavs.filter((element) => {
    return mainUserFavorites.includes(element);
  });

  createMainUser(
    mainUserFound.alias,
    mainUserFound.favs.length,
    mainUserFound.id
  );

  createMainTester(
    mainTesterFound.alias,
    mainTesterFound.favs.length,
    mainTesterCommonFavs.length,
    mainTesterFound.id
  );

  arrayOfUsers = arrayOfUsers.filter(
    (user) => user.id != mainUser && user.id != testerUser
  );

  arrayOfUsers.forEach((user) => {
    let intArrayOfUserFavs = user.favs.map((element) => parseInt(element, 10));

    const userCommonFavs = intArrayOfUserFavs.filter((element) => {
      return mainUserFavorites.includes(element);
    });

    createUserDivs(
      user.alias,
      user.favs.length,
      userCommonFavs.length,
      user.id
    );
  });

  displayPictures();
}

//Function that crates the main users, with parameters of the name of the user, amount of favorites and the users ID. If the selected user is the mainuser (Which it is by default) then it'll add the dom as selected so its the selected one for first time loading of the website. Then it adds the main user class on the DOM and an event listener which will make the selected user the ID it was provided in the function. If there is a previous selected DOM then it'll find it and remove the selected class from it and add the class to the new one. After it'll call on displayPictures() so the pictures gets displayed after a user is selected. The functions for testers and users follow the same structure.

function createMainUser(alias, amountOfFavs, id) {
  let nameTag = document.createElement("div");
  nameTag.innerHTML = `${alias} [${amountOfFavs} ]`;

  if (selectedUser == mainUser) {
    nameTag.classList.add("selected");
  }

  nameTag.classList.add("mainUser");

  nameTag.addEventListener("click", (e) => {
    selectedUser = id;
    //goes through the document and gets any html tag that has the selected class
    let previousSelected = document.querySelector(".selected");
    //if its not undefined then it removes the selected class from the element
    if (previousSelected) {
      previousSelected.classList.remove("selected");
    }
    e.target.classList.add("selected");
    displayPictures();
  });

  document.querySelector("#listOfUsers").append(nameTag);
}

function createMainTester(alias, amountOfFavs, commonFavs, id) {
  let nameTag = document.createElement("div");

  if (selectedUser == id) {
    nameTag.classList.add("selected");
  }

  nameTag.classList.add("mainTester");
  nameTag.innerHTML = `${alias} [${amountOfFavs}] (${commonFavs})`;
  nameTag.addEventListener("click", (e) => {
    selectedUser = id;
    //goes through the document and gets any html tag that has the selected class
    let previousSelected = document.querySelector(".selected");
    //if its not undefined then it removes the selected class from the element
    if (previousSelected) {
      previousSelected.classList.remove("selected");
    }
    e.target.classList.add("selected");
    displayPictures();
  });
  document.querySelector("#listOfUsers").append(nameTag);
}

function createUserDivs(alias, amountOfFavs, commonFavs, id) {
  let nameTag = document.createElement("div");

  if (selectedUser == id) {
    nameTag.classList.add("selected");
  }

  nameTag.innerHTML = `${alias} [${amountOfFavs}] (${commonFavs})`;
  nameTag.classList.add("nameTags");
  nameTag.addEventListener("click", (e) => {
    selectedUser = id;
    //goes through the document and gets any html tag that has the selected class
    let previousSelected = document.querySelector(".selected");
    //if its not undefined then it removes the selected class from the element
    if (previousSelected) {
      previousSelected.classList.remove("selected");
    }
    e.target.classList.add("selected");
    displayPictures();
  });
  document.querySelector("#listOfUsers").append(nameTag);
}

// ***********************************************************
//*************************GRAB PICTURES********************
//** *********************************************************

async function grabPictureIDs() {
  const response = await fetch(pictureIDURL);
  const data = await response.json();

  return data.objectIDs;
}

// ***********************************************************
//*************************DISPLAY PICTURES*******************
//** *********************************************************

//Gets the promise of an array with painting IDS which is then saved into a variable after resolve. Then these IDs are put into a new array of promises which we call on grabPicture array with element as arguments. Afterwards it goes through a promise.all and after we go through each element and save everything in localStorage. We also save photo information in a global array.

async function savePhotos() {
  let arrayOfPictureIDs = await grabPictureIDs();
  let arrayOfPromises = arrayOfPictureIDs.map((pictureID) =>
    grabPicture(pictureID)
  );

  let arrayOfImageObjects = await Promise.all(arrayOfPromises);

  arrayOfImages = arrayOfImageObjects;
  arrayOfImageObjects.forEach((element) => {
    localStorage.setItem(`${element.objectID}.Title`, element.title);
    localStorage.setItem(
      `${element.objectID}.ImageSmall`,
      element.primaryImageSmall
    );
    localStorage.setItem(
      `${element.objectID}.ArtistName`,
      element.artistDisplayName
    );
  });

  displayPictures();
}

//If an id is present in local storage then it returns an object with the paint information otherwise we fetch it from the API. Picture ID so it knows to search for either the title of the local storage or api URL.

async function grabPicture(pictureID) {
  if (localStorage.getItem(`${pictureID}.Title`)) {
    return {
      objectID: pictureID,
      title: localStorage.getItem(`${pictureID}.Title`),
      primaryImageSmall: localStorage.getItem(`${pictureID}.ImageSmall`),
      artistDisplayName: localStorage.getItem(`${pictureID}.ArtistName`),
    };
  }

  const response = await fetch(pictureURL + pictureID);
  const data = await response.json();

  return data;
}

savePhotos();

// If the selecteduser is not the main user then it finds a user within the userarray if it matches with selecteduser then it finds the object and the array of favorites inside. The elements of the array is then used to call on grabpicture array and then displays those favorite photos.  if the main user is selecteduser id then it displays all pictures instead.

async function displayPictures() {
  document.querySelector("#paintingWindow").innerHTML = "";
  let selectedUserID = selectedUser;

  if (selectedUserID != mainUser) {
    let userFavs = userArray.find((user) => user.id == selectedUserID).favs;

    let favPromises = userFavs.map((favs) => grabPicture(favs));

    let response = await Promise.all(favPromises);
    let sortedResponse = response.sort((a, b) => a.title > b.title);

    sortedResponse.forEach((element) => createPictureDOM(element));
  } else {
    let SortedarrayOfImages = arrayOfImages.sort((a, b) => a.title > b.title);

    SortedarrayOfImages.forEach((images) => createPictureDOM(images));
  }
}

//Creates the DOMs to be displayed in a window of paintings. TWo buttons with event listeners are included which calls on either a remove favorite function or add favorite function.

function createPictureDOM(picture) {
  let pictureDivWrapper = document.createElement("div");
  let pictureDOM = document.createElement("img");
  let paragraphDOM = document.createElement("p");
  let pictureID = parseInt(picture.objectID, 10);

  if (selectedUser == mainUser) {
    let pictureButton = document.createElement("button");
    pictureButton.classList.add("pictureButtonClick");
    pictureButton.innerHTML = "Add";
    if (mainUserFavorites.includes(picture.objectID)) {
      pictureButton.innerHTML = "Remove";
      pictureDivWrapper.classList.add("favoritePictures");
    }

    pictureButton.addEventListener("click", (e) => {
      if (e.target.innerHTML == "Add") {
        addPictureToFavs(pictureID, e.target.parentElement);
        loadingBarPaintings(e.target.parentElement);
        e.target.parentElement.classList.add("favoritePictures");
        pictureButton.innerHTML = "Remove";
      } else {
        removePictureToFavs(pictureID);
        loadingBarPaintings(e.target.parentElement);
        e.target.parentElement.classList.remove("favoritePictures");
        pictureButton.innerHTML = "Add";
      }
    });

    pictureDivWrapper.append(pictureButton);
  } else {
    if (mainUserFavorites.includes(pictureID)) {
      pictureDOM.classList.add("commonFavoritePictures");
    } else {
      pictureDOM.classList.add("favoritePictures");
    }
  }

  pictureDivWrapper.classList.add("pictureDivs");
  pictureDOM.src = picture.primaryImageSmall;

  paragraphDOM.innerHTML = `${picture.title} by ${picture.artistDisplayName}`;

  pictureDivWrapper.append(pictureDOM);
  pictureDivWrapper.append(paragraphDOM);
  document.querySelector("#paintingWindow").append(pictureDivWrapper);
}

//Adds a favorite painting by calling the api and provides an object of information including the method and content type necessary.
async function addPictureToFavs(pictureFavID, divWrapper) {
  let URL = await fetch(
    new Request(userURL, {
      method: `PATCH`,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ id: mainUser, addFav: pictureFavID }),
    })
  );
  responseHandler(URL.status, "add", divWrapper);
  displayUsers();
  console.log("Added Picture", pictureFavID);
}

//Removes a favorite painting by calling the api and provides an object of information including the method and content type necessary. Afterwards the responseHandler gets called which will display the necessary feedback after an action.

async function removePictureToFavs(pictureFavID) {
  let URL = await fetch(
    new Request(userURL, {
      method: `PATCH`,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ id: mainUser, removeFav: pictureFavID }),
    })
  );

  responseHandler(URL.status, "remove");
  displayUsers();
  console.log("Remove Picture", pictureFavID);
}

//Handles all promise errors and displays an alert window
function responseHandler(fetch, addOrRemove, divWrapper) {
  if (fetch == 409) {
    divWrapper.classList.remove("favoritePictures");
    window.alert("You have added too many favorites");
  } else if (fetch == 400) {
    window.alert("Bad request");
  } else if (fetch == 404) {
    window.alert("Not found");
  } else if (fetch == 200 && addOrRemove == "remove") {
    window.alert("Removal successful");
  } else if (fetch == 200 && addOrRemove == "add") {
    window.alert("Add successful");
  }
}
