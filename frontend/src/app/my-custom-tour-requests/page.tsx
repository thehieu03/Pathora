import { ClientOnly } from "@/components/utils/ClientOnly";
import { MyCustomTourRequestsPage } from "@/components/partials/custom-tour-request";
import MyCustomTourRequestsLoading from "./loading";

export default function MyCustomTourRequestsRoute() {
  return (
    <ClientOnly fallback={<MyCustomTourRequestsLoading />}>
      <MyCustomTourRequestsPage />
    </ClientOnly>
  );
}
