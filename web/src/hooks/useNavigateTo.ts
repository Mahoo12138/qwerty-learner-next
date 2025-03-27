import { useRouter } from "@tanstack/react-router";

const useNavigateTo = () => {
  const router = useRouter();

  const navigateToWithViewTransition = (to: string) => {
    const document = window.document;

    if (!document.startViewTransition) {
      router.navigate({ to });
    } else {
      document.startViewTransition(() => {
        router.navigate({ to });
      });
    }
  };

  return navigateToWithViewTransition;
};

export default useNavigateTo;
