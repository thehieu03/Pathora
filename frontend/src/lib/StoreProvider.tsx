"use client";

import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { useState } from "react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
