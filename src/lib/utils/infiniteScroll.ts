export const infiniteScroll = ({ fetch, element }: { fetch: Function, element: HTMLElement | null }) => {
  if (element) {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        fetch();
      }
    })

    observer.observe(element);
  }
}
