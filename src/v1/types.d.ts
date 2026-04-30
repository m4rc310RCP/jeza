export {};
declare global {
  interface IPart {
    // id: "HOME" | "ABOUT" | "DRIVER" | "SERVICE" | "CONTACT";
    id: "HOME";
    order: number;
    showMenu: boolean;
    selected: boolean;
    // container: ComponentType<PartContainerProps & HTMLAttributes<HTMLDivElement>>;
    textLink?: string;
    title?: string;
  }

  interface IPartProps {
    part?: IPart;
    className?: string;
  }

  interface IContent {
    parts: IPart[];
  }

  //type ITypeContactMethod = EMAIL | CELL_PHONE | PHONE | ADDRESS;
  //interface ICompany {}
}
