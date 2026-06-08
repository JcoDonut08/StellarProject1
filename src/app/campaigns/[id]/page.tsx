import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CampaignDetailView from '@/components/CampaignDetailView';
import { campaigns, getCampaignById } from '@/lib/campaigns';

export function generateStaticParams() {
  return campaigns.map((campaign) => ({
    id: campaign.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaignById(id);

  if (!campaign) {
    return {
      title: 'Campaign not found',
    };
  }

  return {
    title: `${campaign.title} | Stellar Care Fund`,
    description: campaign.story,
  };
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return <CampaignDetailView campaign={campaign} />;
}
