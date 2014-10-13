tabris.load(function() {

  var message;

  var page = tabris.create("Page", {
    title: "Oceanic Flight 815 Booking",
    topLevel: true
  });

  var firstNameLabel = tabris.create("Label", {
    layoutData: {left: 10, top: 10, width: 120},
    alignment: "left",
    text: "First Name:"
  });

  var firstNameInput = tabris.create("Text", {
    layoutData: {left: [firstNameLabel, 10], right: 10, top: 10},
    message: "First Name"
  });

  var lastNameLabel = tabris.create("Label", {
    layoutData: {left: 10, top: [firstNameInput, 10], width: 120},
    alignment: "left",
    text: "Last Name:"
  });

  var lastNameInput = tabris.create("Text", {
    layoutData: {left: [lastNameLabel, 10], right: 10, top: [firstNameInput, 10]},
    message: "Last Name"
  });

  var passphraseLabel = tabris.create("Label", {
    layoutData: {left: 10, top: [lastNameInput, 10], width: 120},
    alignment: "left",
    text: "Passphrase:"
  });

  var passphraseInput = tabris.create("Text", {
    type: "password",
    layoutData: {left: [passphraseLabel, 10], right: 10, top: [lastNameInput, 10]},
    message: "Passphrase"
  });

  var countryLabel = tabris.create("Label", {
    layoutData: {left: 10, top: [passphraseInput, 10], width: 120},
    alignment: "left",
    text: "Country:"
  });

  var countryCombo = tabris.create("Combo", {
    layoutData: {left: [countryLabel, 10], right: 10, top: [passphraseInput, 10]},
    items: ["Germany", "Canada", "USA", "Bulgaria"],
    selectionIndex: 0
  });

  var classLabel = tabris.create("Label", {
    layoutData: {left: 10, top: [countryCombo, 10], width: 120},
    alignment: "left",
    text: "Class:"
  });

  var classCombo = tabris.create("Combo", {
    layoutData: {left: [classLabel, 10], right: 10, top: [countryCombo, 10]},
    items: ["Business", "Economy", "Economy Plus"],
    selectionIndex: 0
  });

  var dateTimeLabel = tabris.create("Label", {
    layoutData: {left: 10, top: [classCombo, 10], width: 120},
    alignment: "left",
    text: "Date:"
  });

  var dateTime = tabris.create("DateTime", {
    style: ["DATE"],
    layoutData: {left: [dateTimeLabel, 10], right: 10, top: [classCombo, 10]},
    year: 2014,
    day: 20,
    month: 5
  });

  var checkbox = tabris.create("CheckBox", {
    layoutData: {left: [dateTimeLabel, 10], right: 10, top: [dateTime, 10]},
    text: "Vegetarian"
  });

  var button = tabris.create("Button", {
    layoutData: {left: 10, right: 10, top: [checkbox, 20]},
    text: "Place Reservation",
    background: "#8b0000",
    foreground: "white"
  }).on("Selection", function() {
    populateMessage();
  });

  page.append(firstNameLabel, firstNameInput, lastNameLabel, lastNameInput, passphraseLabel, passphraseInput,
    countryLabel, countryCombo, classLabel, classCombo, dateTimeLabel, dateTime, checkbox, button);

  function populateMessage() {
    if (!message) {
      message = tabris.create("Label", {
        layoutData: {left: 10, right: 10, top: [button, 10]},
        alignment: "left",
        text: "Flight booked for: " + createName() + "\n" + "Departure: " + createDepartureDate()
      });
    } else {
      message.dispose();
      message = null;
      populateMessage();
    }
  }

  function createName() {
    return [firstNameInput.get("text"), lastNameInput.get("text")].join(" ");
  }

  function createDepartureDate() {
    return [dateTime.get("year"), (dateTime.get("month") + 1), dateTime.get("day")].join("/");
  }

  page.open();

});