export class FieldError extends Error {
  field: string;
  constructor(message: string, field: string) {
    super(message);
    this.name = "FieldError";
    this.field = field;
  }
}
