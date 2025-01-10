export const toTop = (elementId: string) => {
  const scrollableContainer = document.getElementById(elementId);

  if (scrollableContainer) {
    scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
