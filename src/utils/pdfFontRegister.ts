import { Font } from "@react-pdf/renderer";

export function registerPlusJakartaSans() {
  Font.register({
    family: "Plus Jakarta Sans",
    fonts: [
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-ExtraLight.ttf",
        fontWeight: 200,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-ExtraLightltalic.ttf",
        fontWeight: 200,
        fontStyle: "italic",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Light.ttf",
        fontWeight: 300,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Lightltalic.ttf",
        fontWeight: 300,
        fontStyle: "italic",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Regular.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Italic.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Medium.ttf",
        fontWeight: 500,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Mediumltalic.ttf",
        fontWeight: 500,
        fontStyle: "italic",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-SemiBold.ttf",
        fontWeight: 600,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-SemiBoldltalic.ttf",
        fontWeight: 600,
        fontStyle: "italic",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Bold.ttf",
        fontWeight: 700,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-Boldltalic.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-ExtraBold.ttf",
        fontWeight: 800,
        fontStyle: "normal",
      },
      {
        src: "/fonts/plusJakartaSans/PlusJakartaSans-ExtraBoldltalic.ttf",
        fontWeight: 800,
        fontStyle: "italic",
      },
    ],
  });
}
