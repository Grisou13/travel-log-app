import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-editable-paragraphe',
  templateUrl: './editable-paragraphe.component.html',
  styleUrls: [],
})
export class EditableParagrapheComponent {
  @Output() onChange = new EventEmitter();
}
