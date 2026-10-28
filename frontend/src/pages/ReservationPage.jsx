import { getBookingInfo } from "../services/api";
import { useApi } from "../hooks/useApi";
import SectionHeading from "../components/SectionHeading";
import StateMessage from "../components/StateMessage";
import ReservationForm, { label12 } from "../components/ReservationForm";
import "../styles/reservation.css";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ReservationPage() {
  const { data, loading, error, retry } = useApi((s) => getBookingInfo(s), []);

  return (
    <section className="page-stub">
      <div className="noire-container">
        <div className="row g-5">
          <div className="col-lg-5">
            <SectionHeading
              as="h1"
              eyebrow="Reservations"
              title="Reserve your table."
              text="Send us your preferred date and time. The restaurant reviews every request and confirms it by phone or email."
            />

            {data && (
              <>
                <h2 className="footer-heading">Opening hours</h2>
                <ul className="hours-list">
                  {data.hours.map((h) => (
                    <li key={h.weekday}>
                      <span>{DAYS[h.weekday]}</span>
                      <span>
                        {h.is_closed ? "Closed" : `${label12(h.opens)} to ${label12(h.closes)}`}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="field-hint mt-3">
                  Hours shown are the restaurant's service times. The last bookable time is earlier.
                </p>
              </>
            )}
          </div>

          <div className="col-lg-7">
            {loading && (
              <div className="booking-card skeleton" style={{ minHeight: 520 }} aria-hidden="true" />
            )}
            {!loading && error && (
              <StateMessage
                title="Reservations are unavailable right now."
                text="We couldn't load the booking details. Please try again."
                onRetry={retry}
              />
            )}
            {!loading && !error && data && <ReservationForm info={data} />}
          </div>
        </div>
      </div>
    </section>
  );
}