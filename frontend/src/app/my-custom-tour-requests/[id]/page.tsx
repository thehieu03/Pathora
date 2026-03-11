import { ClientOnly } from "@/components/utils/ClientOnly";
import { CustomTourRequestDetailPage } from "@/components/partials/custom-tour-request";
import MyCustomTourRequestDetailLoading from "./loading";

export default function MyCustomTourRequestDetailRoute() {
  return (
    <ClientOnly fallback={<MyCustomTourRequestDetailLoading />}>
      <CustomTourRequestDetailPage />
    </ClientOnly>
  );
}
