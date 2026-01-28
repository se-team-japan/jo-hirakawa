export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 py-12 md:py-16">
      <div className="max-w-container mx-auto px-6 md:px-8">
        <div className="space-y-4 text-center md:text-left">
          <p className="font-body text-xs text-black/60">
            掲載されているすべてのコンテンツの無断転載を禁じます。
          </p>
          <p className="font-body text-xs text-black/60">
            © {currentYear} Jo Hirakawa Official
          </p>
        </div>
      </div>
    </footer>
  );
}




