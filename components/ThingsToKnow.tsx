import { listing } from "@/data/loadListing";
import Icon, { type IconName } from "@/components/Icon";

function LearnMore({ topic }: { topic: string }) {
  return (
    <button
      type="button"
      aria-label={`Learn more about ${topic}`}
      className="mt-2 rounded text-[14px] font-medium text-[var(--fg)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--fg)]"
    >
      Learn more
    </button>
  );
}

function Column({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Icon name={icon} className="mb-[18px] h-6 w-6 text-[var(--fg)]" />
      <h3 className="mb-3.5 text-[16px] font-medium leading-[20px] text-[var(--fg)]">
        {title}
      </h3>
      <div className="space-y-2 text-[14px] font-normal leading-[1.5] text-[var(--fg)]">
        {children}
      </div>
      <LearnMore topic={title} />
    </div>
  );
}

export default function ThingsToKnow() {
  const { thingsToKnow } = listing;

  return (
    <section
      id="things-to-know"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
    >
      <h2 className="mb-6 text-[22px] font-medium leading-[26px] text-[var(--fg)]">
        Things to know
      </h2>

      <div className="grid grid-cols-3 gap-8">
        <Column icon="calander-date-not-available" title="Cancellation policy">
          {thingsToKnow.cancellation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Column>

        <Column icon="key" title="House rules">
          {thingsToKnow.houseRules.map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </Column>

        <Column icon="shield" title="Safety & property">
          {thingsToKnow.safety.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </Column>
      </div>
    </section>
  );
}
