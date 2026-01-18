import { StaticImageData } from "next/image";

export interface BreadCrumbsProps {
  value: string;
}

export interface ColorItem<T extends string = string> {
  name: T;
  color: string;
}

export interface ColorSelectorProps<T extends string = string> {
  title: string;
  items: ColorItem<T>[];
  selected: T;
  setSelected: (name: T) => void;
}
export type Mode = "Black" | "White";
export type Color =
  | "Blue"
  | "Pink"
  | "Orange"
  | "LightBlue"
  | "Green"
  | "Purple"
  | "Gray";

export interface Size {
  width: number | undefined;
  height: number | undefined;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type TitleInfo = {
  title: string;
  description: string;
};
export type TitleMap = Record<string, TitleInfo>;

export type Card = {
  id: number;
  name: string;
  title: string;
  price: string;
  image: string;
  discount: string;
  secondaryImage: StaticImageData;
  colors: string[];
};

export type WhyChooseUsTypes = {
  title: string;
  description: string;
  id: number;
};

export type CartItem = {
  cartId?: number;
  quantity: number;
  productId: string;
  customName: string | null;
  fontId: number | null;
  imageUrl: string;
  sellingPrice: number;
  originalPrice: number;
  discountPercentage: number | string;
  name: string;
  deviceTypeId: number;
  deviceType: string;
};

export type FormDataType = {
  name: string;
  role: string;
  companyName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  
};

export type FieldConfig = {
  name: keyof FormDataType;
  label: string;
  type: "text" | "password" | "email";
  required?: boolean;
  showToggle?: boolean;
};

export type StepConfig = {
  title: string;
  subtitle: string;
};

export interface MyDevice {
  profileName: string;
  accountDeviceLinkId: number;
  deviceId: number;
  deviceUid: string;
  linkedAt: string;
  deviceNickName: string | null;
  deviceType: string;
  deviceLinkId: number | null;
  linkedProfileId: number | null;
  linkedModeId: number | null;
  deviceStatus: 1 | 0 | null;
  uniqueName: string | null;
  profileId: number | null;
  modeId: number | null;
  mode: string | null;
  modeUrl: string | null;
}

export type ThreeDotMenuOption = {
  label: string | React.ReactNode;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type ThreeDotMenuProps = {
  options: ThreeDotMenuOption[];
  visible?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ReactNode;
  triggerClassName?: string;
  iconClassName?: string;
  menuClassName?: string;
  closeOnSelect?: boolean;
};

export interface LeadForm{
  name: string;
  emailId: string;
  mobileNumber: string;
  location: string;
  where_you_met: string;
  company: string;
}

export type TableColumn<T> = {
  /** Unique key for the column (used for keys) */
  key: string;
  /** Header label or custom header node */
  header: React.ReactNode;
  /** Accessor function to render a cell (receives the row item and index) */
  render: (item: T, index: number) => React.ReactNode;
  /** Optional classes for <th> and <td> */
  headerClassName?: string;
  cellClassName?: string;
};

export type TableProps<T> = {
  /** Rows */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Extract a stable key per row (defaults to index) */
  rowKey?: (item: T, index: number) => React.Key;
  /** Optional row class name (can be a function per-row) */
  rowClassName?: string;
  /** Sticky header toggle */
  stickyHeader?: boolean;
  /** Fixed height for scrollable body (e.g., 'h-[400px]') */
  bodyHeightClassName?: string;

  /** Table and wrappers classNames */
  containerClassName?: string; // outer wrapper
  tableWrapperClassName?: string;
  tableClassName?: string; // <table>
  theadClassName?: string; // <thead>
  tbodyClassName?: string; // <tbody>
  /** Empty state slot (rendered when data.length === 0) */
  emptyIcon?: React.ReactNode;
  emptyMessage? : string
  /** Optional row click */
  onRowClick?: (item: T, index: number) => void;
};

export interface DropdownOption {
  label: string;
  value: string | number;
  isPro?:boolean;
}

export interface Props {
  options: DropdownOption[];
  onShow: () => void;
  onHide: () => void;
  label: string;
  visible: boolean;
  onSelect: (option?: DropdownOption) => void;
  value: string;
}