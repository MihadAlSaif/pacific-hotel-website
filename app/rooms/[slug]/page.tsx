import type { Metadata } from "next";
import { RoomPage } from "@/components/RoomPage";
import { HOTEL, ROOMS, slugOf } from "@/site";

/** One page per room that has a full description. Built ahead of time, no server needed. */
export const dynamicParams = false;
export function generateStaticParams() {
  return ROOMS.filter((r) => r.description).map((r) => ({ slug: slugOf(r.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS.find((r) => slugOf(r.name) === slug);
  return {
    title: `${room?.name ?? "Room"} | ${HOTEL.name}, ${HOTEL.town}`,
    description: room?.blurb,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RoomPage slug={slug} />;
}
