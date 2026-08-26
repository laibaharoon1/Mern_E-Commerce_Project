import { Mail, ShoppingBag, Sparkles } from "lucide-react";

const pageContent = {
  about: {
    icon: ShoppingBag,
    title: "About Us",
    text: "We make it easy to discover quality products, shop with confidence, and receive helpful support whenever you need it.",
  },
  contact: {
    icon: Mail,
    title: "Contact Us",
    text: "Have a question about an order or a product? Send us a message and our support team will be happy to help.",
  },
  blog: {
    icon: Sparkles,
    title: "Our Blog",
    text: "Product updates, shopping ideas, and seasonal picks will appear here soon. Check back for new stories.",
  },
};

function ShoppingInfoPage({ page }) {
  const content = pageContent[page];
  const Icon = content.icon;

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-12">
        <Icon className="mx-auto mb-5 h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold">{content.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{content.text}</p>
      </div>
    </section>
  );
}

export default ShoppingInfoPage;
