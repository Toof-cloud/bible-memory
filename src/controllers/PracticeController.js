import { UIController } from './UIController.js';

export class PracticeController {
  constructor(ui = new UIController()) {
    this.ui = ui;
    this.verseRevealed = false;
  }
  display(verse) {
    this.ui.setReference(verse.ref);
    this.ui.setVerseText(verse.text);
    this.ui.setHint(verse.hint);
    this.ui.showVerse(false);
    this.verseRevealed = false;
    this.ui.resetTypingUI();
    this.ui.setRevealLabel('Reveal Verse <span class="kbd">(R)</span>');
  }
  toggleReveal(startTimerCb, stopTimerCb) {
    if (!this.verseRevealed) {
      startTimerCb && startTimerCb();
      this.ui.showVerse(true);
      this.ui.setRevealLabel('Hide Verse <span class="kbd">(R)</span>');
      this.verseRevealed = true;
    } else {
      this.ui.showVerse(false);
      stopTimerCb && stopTimerCb();
      this.ui.setRevealLabel('Reveal Verse <span class="kbd">(R)</span>');
      this.verseRevealed = false;
    }
  }
}
