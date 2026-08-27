export function SkipLink() {
  return (
    <a
      href="#contenu-principal"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-green focus:px-4 focus:py-2 focus:text-white"
    >
      Aller au contenu
    </a>
  );
}
