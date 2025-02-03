import Note from './Note.js';
import Page from './Page.js';

var total_notes = document.getElementById("total_notes");
var add_note = document.getElementById("add_note");
var delete_all_notes = document.getElementById("delete_all_notes");
var search_note = document.getElementById('search_note');
var notes_container = document.getElementById("notes_container");

let notesArray = [];

window.onload = function() {
	Note.loadTotalNotes();
	loadNotes();
	update_total_notes();
	render_notes();
}

add_note.addEventListener('click', function() {
	let newNote = new Note();
	Page.addPage(newNote);
	notesArray.push(newNote);
	console.log("Created new note with ID: " + newNote.getId);
	update_total_notes();
	render_notes();
	saveNotes();
});

delete_all_notes.addEventListener('click', function() {
	if (!confirm("This action is irreversible, are you sure?"))
		return ;
	notesArray = [];
	Note.setTotal_notes = 0;
	Note.setNext_id = 1;
	Note.saveTotalNotes();
	update_total_notes();
	render_notes();
	saveNotes();
});

search_note.addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredNotes = notesArray.filter(note => note.note_title.toLowerCase().includes(searchTerm));
    render_filtered_notes(filteredNotes);
});

/**
 * Displays a message indicating the total amount of notes created by the user.
 */
function update_total_notes() {
	let notes_counter = Note.getTotal_notes;

	if (notes_counter === 0)
		return (total_notes.innerHTML =
				"You haven't created any notes yet.");
	total_notes.innerHTML = "You have " + notes_counter.toString() + " notes.";
}

/**
 * Renders all notes in the notes container.
 */
function render_notes() {
	notes_container.innerHTML = '';

	notesArray.forEach(note => {
		let currentPage = Page.getCurrentPage(note);
		let noteElement = document.createElement('div');
		noteElement.className = 'col-12 col-md-6 col-lg-4 mb-3';
		noteElement.innerHTML = `
			<div class="card bg-warning text-black">
				<div class="note card-body">
					<input type="text" class="form-control mb-2" value="${note.note_title}" placeholder="No title" onchange="updateNoteTitle(${note.getId}, this.value)">
					<input type="text" class="form-control mb-2" value="${currentPage.page_subtitle}" placeholder="No subtitle" onchange="updateNoteSubtitle(${note.getId}, this.value)">
					<textarea class="form-control mb-2" rows="3" placeholder="Empty" onchange="updateNoteContent(${note.getId}, this.value)">${currentPage.content}</textarea>
					<div class="d-flex justify-content-between">
						<button class="btn btn-secondary" onclick="prevPage(${note.getId})">&lt;</button>
						<span>Page ${note.currentPageIndex + 1} of ${note.pages.length}</span>
						<button class="btn btn-secondary" onclick="nextPage(${note.getId})">&gt;</button>
					</div>
					<button class="btn btn-primary mt-2" onclick="addPage(${note.getId})">Add Page</button>
					<div class="d-flex justify-content-between mt-2">
						<button class="btn btn-danger" onclick="deletePage(${note.getId}, ${note.currentPageIndex})" ${note.pages.length === 1 ? 'disabled' : ''}>Delete Page</button>
						<button class="btn btn-danger" onclick="deleteNote(${note.getId})">Delete Note</button>
					</div>
				</div>
			</div>
		`;
		notes_container.appendChild(noteElement);
	});
}

function render_filtered_notes(filteredNotes) {
    const notesContainer = document.getElementById('notes_container');
    notesContainer.innerHTML = '';
    filteredNotes.forEach(note => {
        const currentPage = note.pages[note.currentPageIndex];
        const noteElement = document.createElement('div');
        noteElement.className = 'col-12 col-md-6 col-lg-4 mb-3';
        noteElement.innerHTML = `
            <div class="card bg-warning text-black">
                <div class="note card-body">
                    <input type="text" class="form-control mb-2" value="${note.note_title}" placeholder="No title" onchange="updateNoteTitle(${note.getId}, this.value)">
                    <input type="text" class="form-control mb-2" value="${currentPage.page_subtitle}" placeholder="No subtitle" onchange="updateNoteSubtitle(${note.getId}, this.value)">
                    <textarea class="form-control mb-2" rows="3" placeholder="Empty" onchange="updateNoteContent(${note.getId}, this.value)">${currentPage.content}</textarea>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-secondary" onclick="prevPage(${note.getId})">&lt;</button>
                        <span>Page ${note.currentPageIndex + 1} of ${note.pages.length}</span>
                        <button class="btn btn-secondary" onclick="nextPage(${note.getId})">&gt;</button>
                    </div>
                    <button class="btn btn-primary mt-2" onclick="addPage(${note.getId})">Add Page</button>
                    <div class="d-flex justify-content-between mt-2">
                        <button class="btn btn-danger" onclick="deletePage(${note.getId}, ${note.currentPageIndex})" ${note.pages.length === 1 ? 'disabled' : ''}>Delete Page</button>
                        <button class="btn btn-danger" onclick="deleteNote(${note.getId})">Delete Note</button>
                    </div>
                </div>
            </div>
        `;
        notesContainer.appendChild(noteElement);
    });
}

/**
 * Updates the title of a note.
 * @param {number} noteId - The ID of the note to update.
 * @param {string} newTitle - The new title for the note.
 */
function updateNoteTitle(noteId, newTitle) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		note.note_title = newTitle;
		render_notes();
		saveNotes();
	}
}

/**
 * Updates the subtitle of a note.
 * @param {number} noteId - The ID of the note to update.
 * @param {string} newSubtitle - The new subtitle for the note.
 */
function updateNoteSubtitle(noteId, newSubtitle) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		let currentPage = Page.getCurrentPage(note);
		currentPage.page_subtitle = newSubtitle;
		render_notes();
		saveNotes();
	}
}

/**
 * Updates the content of a note.
 * @param {number} noteId - The ID of the note to update.
 * @param {string} newContent - The new content for the note.
 */
function updateNoteContent(noteId, newContent) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		let currentPage = Page.getCurrentPage(note);
		currentPage.content = newContent;
		render_notes();
		saveNotes();
	}
}

/**
 * Adds a new page to a note.
 * @param {number} noteId - The ID of the note to add a page to.
 */
function addPage(noteId) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		Page.addPage(note);
		render_notes();
		saveNotes();
	}
}

/**
 * Deletes a page from a note.
 * @param {number} noteId - The ID of the note to delete a page from.
 * @param {number} pageIndex - The index of the page to delete.
 */
function deletePage(noteId, pageIndex) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		Page.deletePage(note, pageIndex);
		render_notes();
		saveNotes();
	}
}

/**
 * Deletes a note.
 * @param {number} noteId - The ID of the note to delete.
 */
function deleteNote(noteId) {
	notesArray = notesArray.filter(note => note.getId !== noteId);
	Note.setTotal_notes = notesArray.length;
	Note.saveTotalNotes();
	update_total_notes();
	render_notes();
	saveNotes();
}

/**
 * Navigates to the next page of a note.
 * @param {number} noteId - The ID of the note to navigate.
 */
function nextPage(noteId) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		Page.nextPage(note);
		render_notes();
		saveNotes();
	}
}

/**
 * Navigates to the previous page of a note.
 * @param {number} noteId - The ID of the note to navigate.
 */
function prevPage(noteId) {
	let note = notesArray.find(note => note.getId === noteId);
	if (note) {
		Page.prevPage(note);
		render_notes();
		saveNotes();
	}
}

/**
 * Saves notes to localStorage.
 */
function saveNotes() {
    const notesData = notesArray.map(note => ({
        note_id: note.note_id,
        note_title: note.note_title,
        pages: note.pages.map(page => ({
            page_subtitle: page.page_subtitle,
            content: page.content
        })),
        currentPageIndex: note.currentPageIndex
    }));
    localStorage.setItem('notes', JSON.stringify(notesData));
}

/**
 * Loads notes from localStorage.
 */
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        parsedNotes.forEach(noteData => {
            const note = new Note(noteData.note_title, false);
            note.pages = noteData.pages.map(pageData => {
                const page = new Page(noteData.note_title, pageData.page_subtitle, pageData.content);
                return page;
            });
            note.currentPageIndex = noteData.currentPageIndex || 0;
            note.note_id = noteData.note_id;
            notesArray.push(note);
        });
    }
    render_notes();
}

window.updateNoteTitle = updateNoteTitle;
window.updateNoteSubtitle = updateNoteSubtitle;
window.updateNoteContent = updateNoteContent;
window.addPage = addPage;
window.deletePage = deletePage;
window.deleteNote = deleteNote;
window.nextPage = nextPage;
window.prevPage = prevPage;
