# Aurora
This is the Aurora ecommerce project.

It consists of:
- A Next.js frontend
- An oRPC backend API 

## Important Things to Note for Devs

### Lenis + GSAP ScrollTrigger Initialization

When using GSAP ScrollTrigger with Lenis smooth scroll, there's an initialization timing conflict. ScrollTrigger can calculate incorrect scroll positions before Lenis fully initializes, causing animations to jump to their end state on page load.

**Solution:** Delay ScrollTrigger creation and explicitly set initial state:

```typescript
useGSAP(() => {
  // Set initial state explicitly
  gsap.set(elementRef.current, { y: 0, scale: 1 });

  // Delay ScrollTrigger creation to let Lenis initialize
  const timeout = setTimeout(() => {
    ScrollTrigger.create({
      trigger: "#target-element",
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(elementRef.current, {
          y: -50 * progress,
          scale: 1 - 0.02 * progress,
        });
      },
    });
    ScrollTrigger.refresh();
  }, 100);

  return () => clearTimeout(timeout);
}, { scope: elementRef });
```

See `components/hero.tsx` for a working implementation.