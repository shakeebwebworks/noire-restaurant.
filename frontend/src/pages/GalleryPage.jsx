import SectionHeading from "../components/SectionHeading";
import Gallery from "../components/Gallery";

export default function GalleryPage() {
  return (
    <section className="page-stub">
      <div className="noire-container">
        <SectionHeading
          as="h1"
          eyebrow="Gallery"
          title="The atmosphere, the plates, the people."
        />
      </div>
      <Gallery filters heading={false} />
    </section>
  );
}