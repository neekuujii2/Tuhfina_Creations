declare module 'sanitize-html' {
  interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    disallowedTagsMode?: 'discard' | 'escape';
    [key: string]: any;
  }

  function sanitizeHtml(input: string, options?: IOptions): string;
  export = sanitizeHtml;
}
