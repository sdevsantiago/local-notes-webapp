import Note from './Note.js';

/**
 * Page class
 */
class Page extends Note {
    constructor(note_title = "", page_subtitle = "", content = "") {
        super(note_title, false);
        this.page_subtitle = page_subtitle;
        this.content = content;
    }

    set page_subtitle(subtitle) {
        this._page_subtitle = (subtitle.trim().length) ? subtitle : "";
    }

    get page_subtitle() {
        return this._page_subtitle;
    }

    set content(content) {
        this._content = content;
    }

    get content() {
        return this._content;
    }

    /**
     * Adds a new page to the note
     */
    static addPage(note) {
        note.pages.push(new Page());
    }

    /**
     * Gets the current page
     */
    static getCurrentPage(note) {
        if (note.pages.length === 0) {
            Page.addPage(note);
        }
        return note.pages[note.currentPageIndex];
    }

    /**
     * Navigates to the next page
     */
    static nextPage(note) {
        if (note.currentPageIndex < note.pages.length - 1) {
            note.currentPageIndex++;
        }
    }

    /**
     * Navigates to the previous page
     */
    static prevPage(note) {
        if (note.currentPageIndex > 0) {
            note.currentPageIndex--;
        }
    }

    /**
     * Deletes a page from the note
     */
    static deletePage(note, pageIndex) {
        if (note.pages.length > 1) {
            note.pages.splice(pageIndex, 1);
            if (note.currentPageIndex >= note.pages.length) {
                note.currentPageIndex = note.pages.length - 1;
            }
        }
    }
}

export default Page;