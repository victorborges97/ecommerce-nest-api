export interface ReturnDto<T> {
  error: boolean;
  message: string;
  data?: T;
}
