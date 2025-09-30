export interface UpdateUserPopupProp {
  user: {
    name: string;
    email: string;
  };
  onClose: () => void;
}
