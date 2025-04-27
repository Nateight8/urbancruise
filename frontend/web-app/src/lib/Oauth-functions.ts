const handleGoogleAuth = () => {
  // Always use the environment variable for the backend auth URL
  const backendUrl = process.env.NEXT_PUBLIC_AUTH_URL;
  if (!backendUrl) {
    throw new Error(
      "NEXT_PUBLIC_AUTH_URL is not set in the environment variables."
    );
  }
  window.location.href = backendUrl;
};

export { handleGoogleAuth };
