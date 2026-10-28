import SectionHeading from "./SectionHeading";

// Used for the 404 page and any simple page
export default function PageStub({ eyebrow, title, text }) {
  return (
    <section className="page-stub">
      <div className="noire-container">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} as="h1" />
      </div>
    </section>
  );
}