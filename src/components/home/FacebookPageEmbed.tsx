import { facebookPageUrl } from "@/lib/facebook-gallery";

/** Fil d’actualité Facebook (posts, photos, reels si publiés). */
export function FacebookPageEmbed() {
  const href = encodeURIComponent(facebookPageUrl);
  const src = `https://www.facebook.com/plugins/page.php?href=${href}&tabs=timeline&width=500&height=520&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <section className="bg-paper-2 py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_min(100%,500px)] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Facebook</p>
            <h2 className="mt-2 font-display text-3xl text-green-deep md:text-4xl">
              Suivez nos actualités
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              Publications, photos et vidéos de la vie scolaire — directement depuis notre page
              officielle. Reels et annonces de rentrée y sont partagés en premier.
            </p>
            <a
              href={facebookPageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#1877F2] px-6 font-semibold text-white shadow-md hover:bg-[#166fe0]"
            >
              Page Facebook Les Étoiles
            </a>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
            <iframe
              title="Page Facebook — Groupe Scolaire les Etoiles de Bingerville"
              src={src}
              width="500"
              height="520"
              style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: "500px" }}
              scrolling="no"
              allow="encrypted-media"
              className="mx-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
