import dynamic from "next/dynamic";
import PoliciesLoading from "./loading";

const PolicyPage = dynamic(() =>
  import("@/components/partials/landing").then((m) => m.PolicyPage),
  { loading: () => <PoliciesLoading /> },
);

export default function PoliciesPage() {
  return <PolicyPage />;
}
