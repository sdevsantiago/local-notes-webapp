/**
 * Note class
 */
class Note {
    static #total_notes = 0;
    static #next_id = 1;

    /**
     * Returns the total amount of notes created by the user
     */
    static get getTotal_notes() {
        return Note.#total_notes;
    }

    /**
     * Sets the total amount of notes created by the user
     */
    static set setTotal_notes(value) {
        Note.#total_notes = value;
    }

    /**
     * Returns the next available ID for a new note
     */
    static get getNext_id() {
        return Note.#next_id;
    }

    /**
     * Sets the next available ID for a new note
     */
    static set setNext_id(value) {
        Note.#next_id = value;
    }

    constructor(title = "", updateCounter = true) {
        this.note_title = title;
        if (updateCounter) {
            this.note_id = Note.#next_id++;
            Note.#total_notes++;
            Note.saveTotalNotes(); // Guardar el contador de notas en localStorage
        }
        else
            this.note_id = Note.#next_id;
        this.pages = []; // Inicializa con un array vacío
        this.currentPageIndex = 0; // Índice de la página actual
    }

    /**
     * Sets the title to the note. If it only contains spaces,
     * the title will then be empty.
     * @param {string} title The title specified by the user.
     */
    set setNote_title(title) {
        this.note_title = (title.split(' ').length) ? title : "";
    }

    /**
     * Returns the ID of the current note.
     */
    get getId() {
        return this.note_id;
    }

    /**
     * Saves the total amount of notes and the next available ID to localStorage
     */
    static saveTotalNotes() {
        localStorage.setItem('total_notes', Note.#total_notes);
        localStorage.setItem('next_id', Note.#next_id);
    }

    /**
     * Loads the total amount of notes and the next available ID from localStorage
     */
    static loadTotalNotes() {
        const savedTotalNotes = localStorage.getItem('total_notes');
        const savedNextId = localStorage.getItem('next_id');
        if (savedTotalNotes) {
            Note.#total_notes = parseInt(savedTotalNotes, 10);
        }
        if (savedNextId) {
            Note.#next_id = parseInt(savedNextId, 10);
        }
    }
}

export default Note;