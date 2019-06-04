// Define Contacts object
var contacts = {
	index: window.localStorage.getItem("contacts:index"),
	table: document.getElementById('contacts-table'),
	form: document.getElementById('contacts-form'),
	saveButton: document.getElementById('save-button'),
	clearButton: document.getElementById('discard-button'),
	
	init: () => {
		// Initialise storage index (if index is null, set to 1)
		if(!contacts.index){
			window.localStorage.setItem("contacts:index", contacts.index = 1);
		}
		
		// Initialise the form (reset form if button is clicked)
		contacts.form.reset();
		
		// Wait for clear button to be clicked
		contacts.clearButton.addEventListener("click", (event) => {
			contacts.form.reset();
			contacts.form.id_entry.value = 0;
		}, true);
		
		// Wait for submit button to be clicked
		contacts.form.addEventListener("submit", function(event) {
			// Store contact details to entry object
			var entry = {
				id: parseInt(this.id_entry.value),
				firstName: this.firstName.value,
				lastName: this.lastName.value,
				email: this.emailAddress.value
			};
			if(entry.id == 0) {
				// New Entry, not selected from existing contact
				contacts.storeAdd(entry);
				contacts.tableAdd(entry);
			}
			else{
				// Contact exists in table, edit record
				contacts.storeEdit(entry);
				contacts.tableEdit(entry);
			}
			// Reset form on submission
			this.reset();
			this.id_entry.value = 0;
			// Prevent the button from submitting to a new page
			event.preventDefault();
		}, true);
		
		// Initialise the table (if items are stored in local storage)
		if(window.localStorage.length -1) {
			var contactsList = [], i, key;
			// Loop through local storage items
			for(i = 0; i < window.localStorage.length; i++){
				key = window.localStorage.key(i);
				if(/contacts:\d+/.test(key)) {
					// Search for valid keys which start with "contacts" and end with an integer
					contactsList.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}
			// Sort contacts by ID and add each contact to the table
			if(contactsList.length){
				contactsList.sort(function(a, b) {
					return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
				})
				.forEach(contacts.tableAdd);
			}
		}
		// Wait for click on table element, then determine what was clicked
		contacts.table.addEventListener("click", (event) => {
			// Get data-op from clicekd item to calcualte whether to edit or remove
			var op = event.target.getAttribute("data-op");
			// If edit or remove or info is clicked
			if(/edit|remove|info/.test(op)){
				var entry = JSON.parse(window.localStorage.getItem("contacts:" + event.target.getAttribute("data-id")));
				// If Edit is clicked
				if(op == "edit"){
					contacts.form.firstName.value = entry.firstName;
					contacts.form.lastName.value = entry.lastName;
					contacts.form.emailAddress.value = entry.email;
					contacts.form.id_entry.value = entry.id;
				}
				// Else if Remove is clicked
				else if(op == "remove"){
					// Confirm deletion
					if(confirm('Are you sure you wish to remove "' + entry.firstName + ' ' + entry.lastName + '" from your contact list?')){
						contacts.storeRemove(entry);
						contacts.tableRemove(entry);
					}
				}
				// Else if Info is clicked
				else if(op == "info"){
					// Hide page content
					document.getElementById('contact-list-page').classList.remove("hidden");
					document.getElementById('contact-info-container').classList.remove("hidden");
					// Populate new window with contact details
					
	
					// Click cross to close pop-up and show page content
					var closeButton = document.getElementById('close-contact');
					closeButton.addEventListener("click", function(event){
						document.getElementById('contact-list-page').classList.add("hidden");
						document.getElementById('contact-info-container').classList.add("hidden");
					}, true);	
				}
			}
		}, true);
	},
	
	// Manipulate the storage area
	storeAdd: function(entry){
		entry.id = contacts.index;
		window.localStorage.setItem("contacts:" + entry.id, JSON.stringify(entry));
		// Increment contact index value (for new contacts)
		window.localStorage.setItem("contacts:index", ++contacts.index)
	},
	storeEdit: function(entry){
		window.localStorage.setItem("contacts:"+ entry.id, JSON.stringify(entry));;
	},
	storeRemove: function(entry){
		window.localStorage.removeItem("contacts:" + entry.id);
	},
	
	// Manipulate the table data
	tableAdd: function(entry){
		// Create a new table row and define td and val variables
		var tr = document.createElement("tr"), td, val;
		// For each property (name, email...) in entry object, add to table row
		for(val in entry){
			// If entry has property
			if(entry.hasOwnProperty(val)){
				// Create table cell for data
				td = document.createElement("td");
				// Append data to table cell
				td.appendChild(document.createTextNode(entry[val]));
				// Append table cell to row
				tr.appendChild(td);
			}
		}
		// Create new table cell
		td = document.createElement("td");
		// Add edit/remove options to cell
		td.innerHTML = '<button class="btn btn-success btn-block" data-op="info" data-id="'+ entry.id +'">More Info</button><button class="btn btn-info btn-block" data-op="edit" data-id="'+ entry.id +'">Edit</button><button class="btn btn-danger btn-block" data-op="remove" data-id="'+ entry.id +'">Remove</button>';
		// Append table cell to row
		tr.appendChild(td);
		// Set id of table row to match contact id
		tr.setAttribute("id", "entry-" + entry.id);
		// Add new row to the table
		contacts.table.appendChild(tr);
	},
	tableEdit: function(entry){
		// Define table row and cell variables
		var tr = document.getElementById("entry-"+entry.id), td, keyTwo;
		// Set existing table row to empty
		tr.innerHTML = "";
		// Loop through all properties of entry object
		for(keyTwo in entry){
			// If entry has property
			if(entry.hasOwnProperty(keyTwo)){
				// Create table cell for data
				td = document.createElement("td");
				// Append data to table cell
				td.appendChild(document.createTextNode(entry[keyTwo]));
				// Append table cell to row
				tr.appendChild(td);
			}
		}
		// Create new table cell
		td = document.createElement("td");
		// Add edit/remove buttons
		td.innerHTML = '<button class="btn btn-success btn-block" data-op="info" data-id="'+ entry.id +'">More Info</button><button class="btn btn-info btn-block" data-op="edit" data-id="'+ entry.id +'">Edit</button><button class="btn btn-danger btn-block" data-op="remove" data-id="'+ entry.id +'">Remove</button>';
		// Add table cell to row
		tr.appendChild(td);
	},
	tableRemove: function(entry){
		contacts.table.removeChild(document.getElementById("entry-" + entry.id));
	}
};

// Initialise the application
contacts.init();
