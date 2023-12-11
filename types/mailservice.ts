export interface MailInterface {
    from?: string;
    to?: string[];
    cc?: string;
    bcc?: string;
    subject?: string;
    text?: string;
    link?: string;
    html?: string;
    attachments?: Attachment[] | string;
  }
  
  export interface Attachment {
    filename: string;
    path: string;
  }