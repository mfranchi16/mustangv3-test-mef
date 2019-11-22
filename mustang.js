/*
	Mario Franchi
	Web and Dist Programming
	Fall 2019
	PA 6
*/

var URLArray = [];
var NameArray = []; 
var EmailArray = [];
var CityArray = [];
var StateArray = [];
var ZipArray = [];
var contacts = [];
var contactContainer = document.getElementById("con");
var currentContactIndex = 0;

var preName = [];
autocomplete(document.getElementById("search"), preName);

function initApplication() {
    document.getElementById("nameID").value = "";   
    document.getElementById("emailID").value = "";   
    document.getElementById("cityID").value = "";   
    document.getElementById("stateID").value = "";
    document.getElementById("zipID").value = "";  
}

function setStatus(status) {
    document.getElementById("statusID").innerHTML = status;    
}

function importContacts() {
    console.log("importContacts()");
    loadIndexAndContacts();
}

function loadIndexAndContacts() {
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        console.log("Index JSON:" + indexRequest.responseText);
        document.getElementById("indexID").innerHTML = indexRequest.responseText;
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i = 0; i < contactIndex.length; i++) {
            URLArray.push(contactIndex[i].ContactURL);
        }
        console.log("URLArray: " + JSON.stringify(URLArray));
        loadContacts();
    }
    indexRequest.send();
}

function saveServer() {
    console.log("saveServer()");
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('Response: ' + this.responseText);
            setStatus(this.responseText)
        }
    };
    xmlhttp.open("POST", "save-contacts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("contacts=" + JSON.stringify(contactArray));   
}

function loadServer() {
    console.log("loadContactsFromServer()");
    contacts.length = 0;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            contacts = JSON.parse(this.responseText);
            setStatus("Loaded contacts (" + contacts.length + ")");
            currentContactIndex = 0;
            viewCurrentContact()
        }
    };
    xmlhttp.open("GET", "load-contacts.php", true);
    xmlhttp.send();   
}

function loadContacts() {
    contacts.length = 0;
    loadingContact = 0;
    if (URLArray.length > loadingContact) {
        loadNext(URLArray[loadingContact]);
    }
}

function loadNext(URL) {
    contactReq = new XMLHttpRequest();
    contactReq.open('GET', URL);
    contactReq.onload = function() {
        var contact;
        contact = JSON.parse(contactReq.responseText);
        console.log("Contact: " + contact.lastName + ", " + contact.firstName);
        contacts.push(contact);
		NameArray.push(contact.lastName + ", " + contact.firstName);
		preName.push(contact.preferredName);
		EmailArray.push(contact.email);
		CityArray.push(contact.city);
		StateArray.push(contact.state);
		ZipArray.push(contact.zip);
        loadingContact++;
        if (URLArray.length > loadingContact) {
            loadNext(URLArray[loadingContact]);
        }
        else {
            document.getElementById("statusID").innerHTML = "Status: Contacts Loaded (" + URLArray.length + ")";
            viewCurrentContact();
			console.log(contacts);
        }
    }
    contactReq.send();
}

function viewCurrentContact() {
    currentContact = contacts[currentContactIndex];
    document.getElementById("nameID").value = currentContact.preferredName;   
    document.getElementById("emailID").value = currentContact.email;   
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("zipID").value = currentContact.zip;  
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contacts.length;
}

function previous() {
    if (currentContactIndex > 0) {
        currentContactIndex--;
		
		//The if statements below disable the buttons when the currentContactIndex is 0
		if(currentContactIndex == 0){
			document.getElementById("pre").disabled = true;
		}
		if(currentContactIndex != (contacts.length - 1)){
			document.getElementById("next").disabled = false;
		}
		update(); //Saves the current values of the textboxes
    }
    currentContact = contacts[currentContactIndex];
    viewCurrentContact();
}

function next() {
    if (currentContactIndex < (contacts.length-1)) {
        currentContactIndex++;
		
		//The if statements below disable the buttons when the currentContactIndex = the highest value.
		if(currentContactIndex != 0){
			document.getElementById("pre").disabled = false;
		}
		if(currentContactIndex == (contacts.length - 1)){
			document.getElementById("next").disabled = true;
		}
		update(); //Saves the current values of the textboxes
    }
    currentContact = contacts[currentContactIndex];
    viewCurrentContact();
}

//This is the function I used to save the values of the textboxes.
function update(){
	currentContact.preferredName = document.getElementById("nameID").value;
	currentContact.email = document.getElementById("emailID").value;
	currentContact.city = document.getElementById("cityID").value;
	currentContact.state = document.getElementById("stateID").value;
	currentContact.zip = document.getElementById("zipID").value;
}

//This is the function I use to add a new contact to the array and display them to the screen
function add(){
	var holder1 = "";
	var holder2 = "";
	var holder3 = "";
	var holder4 = "";
	var holder5 = "";
		
	holder1 = document.getElementById("nameID").value;
	holder2 = document.getElementById("emailID").value;
	holder3 = document.getElementById("cityID").value;
	holder4 = document.getElementById("stateID").value;
	holder5 = document.getElementById("zipID").value;
	
	contacts[contacts.length] = {firstName: " ", lastName: " ", preferredName: holder1, email: holder2, city: holder3, state: holder4, zip: holder5};
}

function remove(contacts, currentIndex){
	var elements = contacts.indexOf(currentIndex);
	contacts.splice(elements, 1);
}

function removeIt(){
	var valueHolder = contacts[currentContactIndex];
	remove(contacts, valueHolder);
	console.log(contacts);
}

function zipBlurFunction() {
    getPlace();
}

function getPlace() {
    var zip = document.getElementById("zipID").value
    console.log("zip:"+zip);
	//This if statement validates the zips based on the php file
	if(zip > 60199 || zip < 60101){
		alert("That function does not exist. getplace() was terminated.");
		return;
	}
    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            document.getElementById("cityID").value = place[0];
            document.getElementById("stateID").value = place[1];
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}

function autocomplete(input, names) {
	var currentFocus = -1;
	input.addEventListener("input", function(e) {
		var q, r, i, val = this.value;
		closeLists();
		if(!val){ 
			return false;
		}
		q = document.createElement("DIV");
		q.setAttribute("id", this.id + "autocomplete-list");
		q.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(q);
		for (i = 0; i < names.length; i++) {
			if(names[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){
				r = document.createElement("DIV");
				r.innerHTML = "<strong>" + names[i].substr(0, val.length) + "</strong>";
				r.innerHTML += names[i].substr(val.length);
				r.innerHTML += "<input type='hidden' value='" + names[i] + "'>";
				r.addEventListener("click", function(e) {
				input.value = this.getElementsByTagName("input")[0].value;
				closeLists();
			});
			q.appendChild(r);
			}
		}
	});
	input.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if(x){
			x = x.getElementsByTagName("div");
		}
		if(e.keyCode == 40){
			currentFocus++;
			addActive(x);
		}else if(e.keyCode == 38){
			currentFocus--;
			addActive(x);
		}else if(e.keyCode == 13){
			e.preventDefault();
		if (currentFocus > -1) {
			if (x) x[currentFocus].click();
		}
		}
	});
	function addActive(x) {
		if(!x){
			return false;
		}
		removeActive(x);
		if(currentFocus >= x.length){
			currentFocus = 0;
		}
		if(currentFocus < 0){
			currentFocus = (x.length - 1);
		}
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeLists(n) {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (n != x[i] && n != input) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function(m){
		closeLists(m.target);
	});
}

function searchUpdate(){
	var name = document.getElementById("search").value;
	var num = preName.lastIndexOf(name);
	
	document.getElementById("nameID").value = preName[num];
	document.getElementById("emailID").value = EmailArray[num];
	document.getElementById("cityID").value = CityArray[num];
	document.getElementById("stateID").value = StateArray[num];
	document.getElementById("zipID").value = ZipArray[num];
	currentContactIndex = num;
	document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contacts.length;
}