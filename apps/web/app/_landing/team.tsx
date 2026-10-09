import Image from "next/image";
import { Avatar } from "@nokgridcore/ui/avatar";
import { Divider } from "@nokgridcore/ui/divider";
import { Section, SectionHeader } from "./section";

const TEAM = [
  {
    name: "Emmanuel Anthony",
    role: "Design lead",
    bio: "Design systems and dashboards, and the occasional 2am variant audit.",
    avatar: "/landing/avatar-emmanuel.png",
    linkedin: "https://www.linkedin.com/in/emmanuel-anthony-639b07122/",
    github: "https://github.com/anthony-emmauel",
  },
  {
    name: "Kelvin",
    role: "Frontend engineer",
    bio: "React and TypeScript, with strong opinions about token naming.",
    avatar: "/landing/avatar-kelvin-ochubili.jpg",
    linkedin: "https://www.linkedin.com/in/kelvin-ochubili",
    github: "https://github.com/iykekelvins",
  },
  {
    name: "Timmy",
    role: "Product designer",
    bio: "Turns dense data into screens people can actually read.",
    avatar: "/landing/avatar-timmy.png",
    linkedin: "https://www.linkedin.com/in/oluwatimilehinakapo",
    github: "https://github.com/Oluwatimilehinakapo",
  },
];

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: "linkedin" | "github-social";
}) {
  return (
    // Opens the profile in a new tab. The hover circle extends the hit area to
    // 30px without moving the 18px icon.
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className="-m-1.5 flex rounded-full p-1.5 motion-safe:transition-[background-color,transform] motion-safe:duration-press motion-safe:ease-out hover:bg-background-overlay motion-safe:active:scale-press"
    >
      <Image
        src={`/landing/${icon}.svg`}
        alt=""
        width={18}
        height={18}
        className="dark:hidden"
      />
      <Image
        src={`/landing/${icon}-dark.svg`}
        alt=""
        width={18}
        height={18}
        className="hidden dark:block"
      />
    </a>
  );
}

export function Team() {
  return (
    <Section aria-labelledby="team-title" className="flex flex-col gap-12">
      <SectionHeader
        id="team-title"
        eyebrow="Built by"
        title="Made by a focused small team"
        description="Designers and engineers working from one file and one repo, so the system is decided once and shipped once."
      />

      <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
        {TEAM.map((person) => (
          <li
            key={person.name}
            className="flex flex-col rounded-lg border border-border-default bg-background-surface p-5"
          >
            <div className="flex items-start justify-between">
              <Avatar
                type="image"
                size="lg"
                src={person.avatar}
                alt={person.name}
              />
              <div className="flex items-center gap-3 pt-1">
                <SocialLink
                  href={person.linkedin}
                  label={`${person.name} on LinkedIn`}
                  icon="linkedin"
                />
                <SocialLink
                  href={person.github}
                  label={`${person.name} on GitHub`}
                  icon="github-social"
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5 pt-4">
              <p className="text-style-heading-sm text-text-primary">
                {person.name}
              </p>
              <p className="text-style-body-sm text-text-secondary">
                {person.role}
              </p>
            </div>
            <Divider className="my-4" style={{ width: "100%" }} />
            <p className="text-style-caption-md text-text-tertiary">
              {person.bio}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
