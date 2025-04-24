"use client";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  );
}
