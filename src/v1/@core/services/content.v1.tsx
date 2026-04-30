import {} from "@presentation/containers";
import type { FC } from "react";

export const partContainers = {
  HOME: undefined,
  // ABOUT: PartAbout,
  // DRIVER: undefined,
  // SERVICE: PartService,
  // CONTACT: PartContact,
} satisfies Record<IPart["id"], FC<IPartProps> | undefined>;

export const contentPage = (): IContent => {
  return {
    parts: [
      {
        id: "HOME",
        order: 1,
        showMenu: true,
        selected: true,
        textLink: "Início",
        title: "Home",
      },
      // {
      //   id: "ABOUT",
      //   order: 2,
      //   showMenu: true,
      //   selected: false,
      //   textLink: m.link_about,
      //   title: m.title_about,
      // },
      // {
      //   id: "DRIVER",
      //   order: 5,
      //   showMenu: true,
      //   selected: false,
      //   textLink: m.link_drivers,
      //   title: m.title_drivers,
      // },
      // {
      //   id: "SERVICE",
      //   order: 4,
      //   showMenu: true,
      //   selected: false,
      //   textLink: m.link_services,
      //   title: m.title_services,
      // },
      // {
      //   id: "CONTACT",
      //   order: 5,
      //   showMenu: true,
      //   selected: false,
      //   textLink: m.link_contact,
      //   title: m.title_contact,
      // },
    ],
  };
};
