import { MapPin, Phone, Clock } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata = {
  title: "Store Locator | Vernont",
  description: "Find a Vernont boutique or authorized retailer near you.",
};

const stores = [
  {
    name: "Munich Flagship",
    type: "Flagship Store",
    address: "Parfümstraße 42, 80331 Munich, Germany",
    phone: "+49 89 123 456 789",
    hours: "Mon-Sat: 10:00-19:00, Sun: Closed",
  },
  {
    name: "Paris Boutique",
    type: "Boutique",
    address: "42 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
    phone: "+33 1 23 45 67 89",
    hours: "Mon-Sat: 10:00-19:00, Sun: 12:00-18:00",
  },
  {
    name: "London Store",
    type: "Boutique",
    address: "123 New Bond Street, London W1S 1AB, UK",
    phone: "+44 20 1234 5678",
    hours: "Mon-Sat: 10:00-19:00, Sun: 12:00-18:00",
  },
  {
    name: "Milan Boutique",
    type: "Boutique",
    address: "Via Montenapoleone 15, 20121 Milan, Italy",
    phone: "+39 02 123 4567",
    hours: "Mon-Sat: 10:00-19:00, Sun: Closed",
  },
  {
    name: "Dubai Mall",
    type: "Boutique",
    address: "The Dubai Mall, Fashion Avenue, Dubai, UAE",
    phone: "+971 4 123 4567",
    hours: "Sun-Wed: 10:00-22:00, Thu-Sat: 10:00-24:00",
  },
  {
    name: "New York",
    type: "Boutique",
    address: "680 Madison Avenue, New York, NY 10065, USA",
    phone: "+1 212 123 4567",
    hours: "Mon-Sat: 10:00-19:00, Sun: 12:00-18:00",
  },
];

export default function StoresPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="font-serif text-gold tracking-[0.3em] uppercase text-sm mb-3">
            Find Us
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Store Locator
          </h1>
          <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
            Visit one of our boutiques to experience the world of Vernont in person.
            Our fragrance consultants are ready to help you find your signature scent.
          </p>
        </div>

        {/* Store List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stores.map((store, index) => (
            <div key={index} className="p-6 border border-border hover:border-gold transition-colors">
              <span className="font-serif text-xs text-gold uppercase tracking-wider">
                {store.type}
              </span>
              <h3 className="font-display text-xl tracking-wide mt-2 mb-4">{store.name}</h3>

              <div className="space-y-3 text-sm font-serif text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>{store.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="bg-secondary p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl tracking-wide">In-Store Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="font-display text-lg mb-2">Fragrance Consultation</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Our expert consultants will help you discover your perfect fragrance through
                a personalized consultation.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg mb-2">Gift Wrapping</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Complimentary gift wrapping and personalized messages available for all purchases.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg mb-2">Engraving</h3>
              <p className="font-serif text-muted-foreground text-sm">
                Add a personal touch with complimentary engraving on select bottles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
