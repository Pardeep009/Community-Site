function showsidebar() {
	var element = document.getElementById('viewscreen');
	element.classList.toggle('toggle-pc');

	var element = document.getElementById('sidebar');
	element.classList.toggle('sidebar-width');

	var element = document.getElementById('rightview');
	element.classList.toggle('set-rightview');
}

function open_home_page() {
	window.location = '/home';
}

function open_adduser_page() {
	window.location = '/admin/adduser';
}

function open_userlist_page() {
	window.location = '/admin/userslist';
}

function open_communitylist_page() {
	window.location = '/admin/communitylist';
}

function open_switchmodel_page() {
	let word = 'Admin';
	if ($('p').html() == 'admin') word = 'User';
	$.confirm({
		title: `Switch As ${word}`,
        	content: 'Do you really want switch state...',
        	draggable: true,
       		buttons: {
			Yes: {
				btnClass: 'btn-success',
                	action() {
                	   window.location = '/switchcommunityhome';
            	    },
       		},
			No: {
				btnClass: 'btn-danger',
				action() {},
       		},
        	},
    		});
}

function open_tag_page() {
	window.location = '/admin/tagpanel';
}

function open_changepassword_page() {
	window.location = '/changepassword';
}

function open_communities_page() {
	window.location = '/community/communitypanel';
}

function editpage() {
	window.location = '/editpage';
}

function open_logout() {
	$.confirm({
      	title: 'Confirm Logout!',
      	content: 'Do you really want logout?',
      	draggable: true,
		theme: 'supervan',
     		buttons: {
			Yes: {
				btnClass: 'btn-success',
              	action() {
              	   window.location = '/logout';
          	    },
     		    },
			No: {
				btnClass: 'btn-danger',
				action() {},
     		   },
      	},
  		});
}
