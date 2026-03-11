import { ClientOnly } from "@/components/utils/ClientOnly";
import { CustomTourRequestPage } from "@/components/partials/custom-tour-request";
import CustomTourRequestLoading from "./loading";

export default function CustomTourRequestRoute() {
  return (
    <ClientOnly fallback={<CustomTourRequestLoading />}>
      <CustomTourRequestPage />
    </ClientOnly>
  );
}
