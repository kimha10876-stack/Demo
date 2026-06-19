import RootLayout from "../../components/Language/RootLayout";
import { LanguageProvider } from "./components/LanguageContext";
import Organizer from "./components/Organizer";

export default function OrganizerCenter() {
return(
    <LanguageProvider>
      <RootLayout>
        <Organizer />
      </RootLayout>
    </LanguageProvider>
    )
}