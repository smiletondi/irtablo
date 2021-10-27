// interface Option {
//   name: string;
// }
export interface IProps {
  box?: boolean;
  title: string;
  options: string[];
  [restProps: string]: any;
}
