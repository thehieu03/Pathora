import dynamic from "next/dynamic";
import PoliciesLoading from "./loading";

const PolicyPage = dynamic(
  () => import("@/features/policies/components").then((m) => m.PolicyPage),
  { loading: () => <PoliciesLoading /> },
);

export default function PoliciesPage() {
  return <PolicyPage />;
}
