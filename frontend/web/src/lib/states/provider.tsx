// "use client";

// import { Provider } from "react-redux";
// import { makeStore, AppStore } from "./store";
// import { ReactNode, useRef } from "react";

// export function ReduxProvider({ children }: { children: ReactNode }) {
//   const storeRef = useRef<AppStore>();

//   if (!storeRef.current) {
//     storeRef.current = makeStore();
//   }

//   return <Provider store={storeRef.current}>{children}</Provider>;
// }
