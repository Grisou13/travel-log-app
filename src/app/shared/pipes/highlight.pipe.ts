import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string,
    searchTerm: string,
    caseSensitive = false,
    customClasses = ''
  ): string {
    if (searchTerm === '') {
      return value;
    }
    const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
    const newText = value.replace(regex, (match: string) => {
      return `<mark class="highlight ${customClasses}">${match}</mark>`;
    });
    const sanitzed = this.sanitizer.sanitize(SecurityContext.HTML, newText);
    return sanitzed || '';
  }
}
