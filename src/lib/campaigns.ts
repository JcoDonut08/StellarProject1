import type { AssetCode } from './donations';

export interface CampaignProofAttachment {
  label: string;
  description: string;
}

export interface Campaign {
  id: string;
  patientName: string;
  title: string;
  story: string;
  medicalDescription: string;
  targetAmount: string;
  assetCode: AssetCode;
  walletAddress: string;
  hospital: string;
  location: string;
  proofAttachments: CampaignProofAttachment[];
}

export const campaigns: Campaign[] = [
  {
    id: 'nina-heart-surgery',
    patientName: 'Nina Santos',
    title: 'Emergency heart surgery for Nina',
    story:
      'Nina needs urgent heart surgery after a sudden cardiac complication. Her family is raising direct donations to cover the hospital deposit, operating room fees, and recovery care.',
    medicalDescription:
      'Cardiothoracic surgery with ICU monitoring, medication support, and follow-up imaging.',
    targetAmount: '4200',
    assetCode: 'XLM',
    walletAddress: 'GDGRGOWWU4KLOBMYLUCDV2QB5IMNXNMH3BK57YBFV4SUSXEUKFHWHWNY',
    hospital: 'Quezon City Medical Center',
    location: 'Quezon City, Philippines',
    proofAttachments: [
      {
        label: 'Admission slip',
        description: 'Hospital admission confirmation and treatment estimate.',
      },
      {
        label: 'Specialist note',
        description: 'Cardiology recommendation for urgent surgery.',
      },
    ],
  },
  {
    id: 'rafael-kidney-transplant',
    patientName: 'Rafael Dela Cruz',
    title: 'Kidney transplant support for Rafael',
    story:
      'Rafael is preparing for a kidney transplant and needs help with pre-transplant clearance, donor screening, and medication reserves that are not fully covered by insurance.',
    medicalDescription:
      'Transplant preparation, laboratory screening, anti-rejection medicine, and post-op monitoring.',
    targetAmount: '15000',
    assetCode: 'USDC',
    walletAddress: 'GDFVJPEFAMXNSA6EGBW2OWIC6LBPSKDJTKKGQQFE43KB2O4FRLCCBRQT',
    hospital: 'St. Luke\'s Medical Center',
    location: 'Taguig, Philippines',
    proofAttachments: [
      {
        label: 'Nephrology clearance',
        description: 'Doctor-issued recommendation for transplant preparation.',
      },
      {
        label: 'Lab bundle',
        description: 'Dialysis and transplant screening documents.',
      },
    ],
  },
  {
    id: 'maria-trauma-recovery',
    patientName: 'Maria Lopez',
    title: 'Rehabilitation and trauma recovery for Maria',
    story:
      'Maria survived a motorcycle accident and needs surgery follow-up, rehabilitation therapy, and mobility support equipment before she can return home safely.',
    medicalDescription:
      'Orthopedic follow-up, physical therapy, imaging, and assistive equipment.',
    targetAmount: '2800',
    assetCode: 'XLM',
    walletAddress: 'GDBRME2IX4BS4KMYSTLNRRQP2GC5Q4ALKZGV7DFT7V2EIMP3DZ67B7MQ',
    hospital: 'Philippine Orthopedic Center',
    location: 'Manila, Philippines',
    proofAttachments: [
      {
        label: 'X-ray summary',
        description: 'Initial trauma imaging and treatment summary.',
      },
      {
        label: 'Therapy plan',
        description: 'Rehabilitation schedule and supply estimate.',
      },
    ],
  },
];

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.id === id);
}
